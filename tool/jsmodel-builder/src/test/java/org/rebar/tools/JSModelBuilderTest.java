/*
 * Copyright (c) 2017, Baidu Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.rebar.tools;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.kohsuke.args4j.CmdLineException;
import org.kohsuke.args4j.CmdLineParser;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import com.google.common.io.Files;

@RunWith(MockitoJUnitRunner.class)
public class JSModelBuilderTest {
  private static final String JS_REFER_NS = "rebar.test.model";
  private static final String JS_NS = JS_REFER_NS + ".java";
  private static final String TARGET_PATH = "/tmp";
  private static final Class<?> BUILDER_CLASS = JSModelBuilder.class;

  @Mock
  private File mockFile;

  @Spy
  private List<String> javaModelPackages = new ArrayList<String>();
  @Spy
  private List<File> jsFilePaths = new ArrayList<File>();
  @Spy
  private List<Class<?>> buildingClasses = new ArrayList<Class<?>>();
  @Spy
  private Map<String, String> jsReferClassMap = new HashMap<String, String>();

  @InjectMocks
  private JSModelBuilder testBuilder;

  @Before
  public void setup() throws CmdLineException {
    CmdLineParser cmdParser = new CmdLineParser(testBuilder);
    cmdParser.parseArgument(new String[] {"--javaPackage", this.getClass().getPackage().getName(), "--jsNS", JS_NS,
        "--jsReferNS", JS_REFER_NS, "--jsTargetPath", TARGET_PATH, "--classPattern", "[.$\\w]+JavaModel"});
  }

  @After
  public void tearDown() {
  }

  @Test
  public void testGetJSType() throws Exception {
    Method getJSTypeMethod = BUILDER_CLASS.getDeclaredMethod("getJSType", Class.class, boolean.class, Type.class,
        Class.class);
    getJSTypeMethod.setAccessible(true);

    Object jsType = getJSTypeMethod.invoke(testBuilder, Integer.class, false, null, null);
    JSModelBuilder.JSType expectedType = new JSModelBuilder.JSType("number", "0", JSModelBuilder.JsTypeCategory.BASE);
    Assert.assertEquals("Convert Integer to js type fail", expectedType, jsType);

    jsType = getJSTypeMethod.invoke(testBuilder, String.class, false, null, null);
    expectedType = new JSModelBuilder.JSType("string", "''", JSModelBuilder.JsTypeCategory.BASE);
    Assert.assertEquals("Convert String to js type fail", expectedType, jsType);

    jsType = getJSTypeMethod.invoke(testBuilder, ArrayList.class, false, ArrayList.class.getGenericSuperclass(), null);
    expectedType = new JSModelBuilder.JSType("Array", "[]", JSModelBuilder.JsTypeCategory.COMPOUND);
    Assert.assertEquals("Convert List to js type fail", expectedType, jsType);

    jsType = getJSTypeMethod.invoke(testBuilder, SimpleJavaModel.class, false, null, null);
    expectedType.fullName = JS_NS + "." + SimpleJavaModel.class.getSimpleName();
    expectedType.initVal = StringUtils.join(new String[] { "new ", expectedType.fullName, "()" });
    expectedType.category = JSModelBuilder.JsTypeCategory.CUSTOM;
    Assert.assertEquals("Convert TestModel to not referring js type fail", expectedType, jsType);

    Field f = SimpleJavaModel.class.getDeclaredField("selfField");
    f.setAccessible(true);
    jsType = getJSTypeMethod.invoke(testBuilder, f.getType(), false, f.getGenericType(), SimpleJavaModel.class);
    expectedType.initVal = "null";
    Assert.assertEquals("Convert intListField field of SimpleJavaModel to js type fail", expectedType, jsType);

    jsType = getJSTypeMethod.invoke(testBuilder, SimpleJavaModel.class, true, null, null);
    expectedType.fullName = JS_REFER_NS + "." + SimpleJavaModel.class.getSimpleName();
    expectedType.initVal = StringUtils.join(new String[] { "new ", expectedType.fullName, "()" });
    Assert.assertEquals("Convert TestModel to referring js type fail", expectedType, jsType);

    f = SimpleJavaModel.class.getDeclaredField("intListField");
    f.setAccessible(true);
    jsType = getJSTypeMethod.invoke(testBuilder, f.getType(), false, f.getGenericType(), null);
    expectedType = new JSModelBuilder.JSType("Array.<number>", "[]", JSModelBuilder.JsTypeCategory.COMPOUND);
    Assert.assertEquals("Convert intListField field of SimpleJavaModel to js type fail", expectedType, jsType);

    jsType = getJSTypeMethod.invoke(testBuilder, Assert.class, false, null, null);
    expectedType = new JSModelBuilder.JSType("*", "null", JSModelBuilder.JsTypeCategory.UNKNOW);
    Assert.assertEquals("Convert arbitrory class to js type fail", expectedType, jsType);
  }

  @Test
  public void testGetMatchedClasses() throws Exception {
    Method method = BUILDER_CLASS.getDeclaredMethod("getMatchedClasses");
    method.setAccessible(true);
    Object ret = method.invoke(testBuilder);
    @SuppressWarnings("unchecked")
    List<Class<?>> classes = (List<Class<?>>) ret;
    Assert.assertTrue(classes.size() == 3);
    Set<Class<?>> classesSet = new HashSet<Class<?>>();
    classesSet.addAll(classes);
    Assert.assertTrue(classesSet.contains(SimpleJavaModel.class));
    Assert.assertTrue(classesSet.contains(SimpleEmbededJavaModel.class));
    Assert.assertTrue(classesSet.contains(SimpleJavaModel.InnerEmbededJavaModel.class));
  }

  @Test
  public void testgetJSFilePath() throws Exception {
    String fileName = SimpleJavaModel.class.getSimpleName().toLowerCase() + ".js";
    Method getJSFilePath = BUILDER_CLASS.getDeclaredMethod("getJSFilePath", Class.class);
    getJSFilePath.setAccessible(true);

    // for the arguments initialized in setup, get SimpleJavaModel's target path
    File path = (File) getJSFilePath.invoke(testBuilder, SimpleJavaModel.class);
    File targetPath = new File(TARGET_PATH, fileName);
    Assert.assertEquals(targetPath.getCanonicalPath(), path.getCanonicalPath());

    // for the class Mockito not registered, default target path should
    // generated
    path = (File) getJSFilePath.invoke(testBuilder, Mockito.class);
    targetPath = new File(TARGET_PATH, Mockito.class.getSimpleName().toLowerCase() + ".js");
    Assert.assertEquals(targetPath.getCanonicalPath(), path.getCanonicalPath());

    // for the class Mockito registered, but no corresponding target path,
    // default should be return
    javaModelPackages.add(0, File.class.getPackage().getName());
    jsFilePaths.add(0, new File("/var"));
    javaModelPackages.add(Mockito.class.getPackage().getName());
    path = (File) getJSFilePath.invoke(testBuilder, Mockito.class);
    targetPath = new File(TARGET_PATH, Mockito.class.getSimpleName().toLowerCase() + ".js");
    Assert.assertEquals(targetPath.getCanonicalPath(), path.getCanonicalPath());

    // for the class Mockito registered, should return corresponding target path
    // registered
    javaModelPackages.add(0, javaModelPackages.remove(javaModelPackages.size() - 1));
    jsFilePaths.add(0, new File("/home"));
    path = (File) getJSFilePath.invoke(testBuilder, Mockito.class);
    targetPath = new File("/home", Mockito.class.getSimpleName().toLowerCase() + ".js");
    Assert.assertEquals(targetPath.getCanonicalPath(), path.getCanonicalPath());

    // for the class(org.rebar.tools.SimpleJavaModel) whose indirect
    // package(org) registered,
    // the complementary package parts should be generated in target path
    javaModelPackages.set(2, "org");
    path = (File) getJSFilePath.invoke(testBuilder, SimpleJavaModel.class);
    targetPath = new File(new File(TARGET_PATH, "rebar/tools"), fileName);
    Assert.assertEquals(targetPath.getCanonicalPath(), path.getCanonicalPath());
  }

  @Test
  public void testGetJSClassName() throws Exception {
    Method getJSClassName = BUILDER_CLASS.getDeclaredMethod("getJSClassName", boolean.class, Class.class);
    getJSClassName.setAccessible(true);

    Assert.assertEquals(JS_REFER_NS + "." + SimpleJavaModel.class.getSimpleName(),
        getJSClassName.invoke(testBuilder, true, SimpleJavaModel.class));
    Assert.assertEquals(JS_NS + "." + SimpleJavaModel.class.getSimpleName(),
        getJSClassName.invoke(testBuilder, false, SimpleJavaModel.class));

    // test inner class
    String innerClsSuffix = SimpleJavaModel.class.getSimpleName() + "."
        + SimpleJavaModel.InnerEmbededJavaModel.class.getSimpleName();
    Assert.assertEquals(JS_REFER_NS + "." + innerClsSuffix,
        getJSClassName.invoke(testBuilder, true, SimpleJavaModel.InnerEmbededJavaModel.class));
    Assert.assertEquals(JS_NS + "." + innerClsSuffix,
        getJSClassName.invoke(testBuilder, false, SimpleJavaModel.InnerEmbededJavaModel.class));

    // if class is searched by indirect ancestor package, the complementary
    // package parts should be inserted
    javaModelPackages.set(0, "org");
    Assert.assertEquals(JS_REFER_NS + ".rebar.tools." + SimpleJavaModel.class.getSimpleName(),
        getJSClassName.invoke(testBuilder, true, SimpleJavaModel.class));
    Assert.assertEquals(JS_NS + ".rebar.tools." + SimpleJavaModel.class.getSimpleName(),
        getJSClassName.invoke(testBuilder, false, SimpleJavaModel.class));

    // if hits the refer class map
    jsReferClassMap.put(SimpleJavaModel.class.getName(), "abc");
    Assert.assertEquals("abc", getJSClassName.invoke(testBuilder, true, SimpleJavaModel.class));
    Assert.assertEquals(JS_NS + ".rebar.tools." + SimpleJavaModel.class.getSimpleName(),
        getJSClassName.invoke(testBuilder, false, SimpleJavaModel.class));
  }

  @Test
  public void testInitJsReferMap() throws Exception {
    Method initJsReferMap = BUILDER_CLASS.getDeclaredMethod("initJsReferMap", BufferedReader.class);
    initJsReferMap.setAccessible(true);

    BufferedReader br = Mockito.mock(BufferedReader.class);
    Mockito.when(br.readLine()).thenReturn("a").thenReturn("# comment").thenReturn(" ").thenReturn("a.b : c.d")
        .thenReturn(" e.f:g.h:i").thenReturn(null);
    Assert.assertFalse((boolean) initJsReferMap.invoke(testBuilder, br));

    Assert.assertTrue((boolean) initJsReferMap.invoke(testBuilder, br));
    Assert.assertEquals(2, jsReferClassMap.size());
    Assert.assertEquals("c.d", jsReferClassMap.get("a.b"));
    Assert.assertEquals("g.h:i", jsReferClassMap.get("e.f"));
  }

  @Test
  public void testBuildClass() throws Exception {
    File jsFile = new File(this.getClass().getResource("/").getPath(), "simplejavamodel.js");
    List<String> jsLines = Files.readLines(jsFile, Charset.forName("UTF-8"));
    String jsContent = StringUtils.join(jsLines.toArray(), "\n");

    ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
    PrintWriter mockPrintWriter = new PrintWriter(byteStream);

    Method method = BUILDER_CLASS.getDeclaredMethod("buildClass", Class.class, PrintWriter.class);
    method.setAccessible(true);
    method.invoke(testBuilder, SimpleJavaModel.class, mockPrintWriter);
    // uncomment following statements to generate the build result to a
    // temporary file
     File jsBuiltFile = new File("/tmp/build_js_model_ut.js");
     byteStream.writeTo(new FileOutputStream(jsBuiltFile));

    Assert.assertEquals(1, buildingClasses.size());
    Assert.assertEquals(SimpleEmbededJavaModel.class, buildingClasses.get(0));
    Assert.assertArrayEquals((jsContent + "\n\n").getBytes(), byteStream.toByteArray());
  }
}
