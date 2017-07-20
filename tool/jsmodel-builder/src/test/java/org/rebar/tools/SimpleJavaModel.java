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

import java.sql.Date;
import java.util.ArrayList;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonProperty;

/**
 * 用来做测试的一个model类
 *
 * @author zhangzhihong02
 * @since 2014/2/2
 */
public class SimpleJavaModel {
  public static final String ENUMXX_AA = "aa";
  public static final String ENUMXX_BB = "bb";

  public static class InnerEmbededJavaModel extends SimpleEmbededJavaModel {
    private String def;

    public String getDef() {
      return def;
    }

    public void setDef(String def) {
      this.def = def;
    }
  }

  private ArrayList<Integer> intListField;
  @com.fasterxml.jackson.annotation.JsonProperty("custom_list_field")
  private ArrayList<SimpleEmbededJavaModel> customListField;
  private SimpleEmbededJavaModel customField;
  private InnerEmbededJavaModel customInnerField;
  private SimpleJavaModel selfField;
  @JsonProperty("date_field")
  private Date dateField;
  @JsonProperty("int_field")
  private int intField;
  private Class<?> unknownField;
  private boolean booleanField;
  private Map<String, Double> mapField;

  public ArrayList<Integer> getIntListField() {
    return intListField;
  }

  public void setIntListField(ArrayList<Integer> intListField) {
    this.intListField = intListField;
  }

  public ArrayList<SimpleEmbededJavaModel> getCustomListField() {
    return customListField;
  }

  public void setCustomListField(ArrayList<SimpleEmbededJavaModel> customListField) {
    this.customListField = customListField;
  }

  public SimpleEmbededJavaModel getCustomField() {
    return customField;
  }

  public void setCustomField(SimpleEmbededJavaModel customField) {
    this.customField = customField;
  }

  public InnerEmbededJavaModel getCustomInnerField() {
    return customInnerField;
  }

  public void setCustomInnerField(InnerEmbededJavaModel customInnerField) {
    this.customInnerField = customInnerField;
  }

  public SimpleJavaModel getSelfField() {
    return selfField;
  }

  public void setSelfField(SimpleJavaModel selfField) {
    this.selfField = selfField;
  }

  public Date getDateField() {
    return dateField;
  }

  public void setDateField(Date dateField) {
    this.dateField = dateField;
  }

  public int getIntField() {
    return intField;
  }

  public void setIntField(int intField) {
    this.intField = intField;
  }

  public Class<?> getUnknownField() {
    return unknownField;
  }

  public void setUnknownField(Class<?> unknownField) {
    this.unknownField = unknownField;
  }

  public boolean isBooleanField() {
    return booleanField;
  }

  public void setBooleanField(boolean booleanField) {
    this.booleanField = booleanField;
  }

  public Map<String, Double> getMapField() {
    return mapField;
  }

  public void setMapField(Map<String, Double> mapField) {
    this.mapField = mapField;
  }
}
