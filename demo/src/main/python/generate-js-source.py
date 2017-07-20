#!/usr/bin/env python
#
# Copyright (c) 2017, Baidu Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
A tool used to generate js source files. For the closure template files,
it will be compiled by the closure template compiler. For the css files,
a js namespace will be mapped to this file, and the css file will be
processed by css compiler, default is lessc. In debug mode, the compiled
css file will be generated in target folder, and a js file with the
corresponding namespace will be generated, which will insert a css loading
html tag. In release mode, a js file will be genrated to install the compiled
css text.
"""

import argparse
import json
import logging
import os
import re
import subprocess
import sys

class _Compiler(object):
  """ The compiler which will compile a single file """

  def __init__(self, file_path, target_directory):
    self._source_file_path = file_path
    self._source_directory, self._source_file_name = os.path.split(self._source_file_path)
    self._source_file_name_root, self._source_file_name_ext = os.path.splitext(
        self._source_file_name)
    self._target_directory = target_directory

    self.__target_file_paths = None

  def ShouldUpdate(self):
    """ If the compiler is called twice continously, then the compile
        action should not run if the source file is not changed
    """
    for path in self.GetTargetFilePaths():
      if self._ShouldUpdate(path):
        return True
    return False

  def GetTargetFilePaths(self):
    """ Get target file path list
    """
    if self.__target_file_paths is None:
      self.__target_file_paths = [os.path.join(self._target_directory, name)
              for name in self._GetTargetFileNames()]
    return self.__target_file_paths

  def Compile(self):
    """ Compile the source file to target path
    """
    for path in self.GetTargetFilePaths():
      try:
        os.symlink(self._source_file_path, path)
      except Exception, e:
        logging.warn('symlink %s to %s failed' % (self._source_file_path, path))
        raise e

  def _ShouldUpdate(self, target_path):
      if os.path.islink(target_path):
        if not os.path.samefile(self._source_file_path, os.readlink(target_path)):
          return True
      elif (not os.path.exists(target_path) or
          os.path.getmtime(self._source_file_path) > os.path.getmtime(target_path)):
        return True

  def _GetTargetFileNames(self):
    """ To get the target file path
    """
    return [self._source_file_name]

class _CSSCompiler(_Compiler):
  """ The css file compiler """

  def __init__(self, file_path, target_directory, compiler, namespace):
    super(_CSSCompiler, self).__init__(file_path, target_directory)

    self._compiler = compiler
    self._namespace = namespace + '.' + self._source_file_name.replace('.', '')

  def _CompileCSSContent(self):
    """ Compile the source css file to target path
    """
    args = self._compiler.split() + [self._source_file_path]
    proc = subprocess.Popen(args, stdout=subprocess.PIPE)
    (stdoutdata, stderrdata) = proc.communicate()
    if proc.returncode != 0:
      raise Exception('compile css failed')
    return stdoutdata

class _ReleaseModeCSSCompiler(_CSSCompiler):
  """ The release mode css file compiler """

  def __init__(self, file_path, target_directory, compiler, namespace):
    super(_ReleaseModeCSSCompiler, self).__init__(file_path, target_directory, compiler, namespace)

  def Compile(self):
    """ Compile the css file to target path
    """
    f = open(self.GetTargetFilePaths()[0], 'w')
    f.write('goog.provide(\'%s\');\n\n' % self._namespace)
    f.write('goog.require(\'goog.html.SafeStyleSheet\');\n\n');
    f.write('goog.require(\'goog.string.Const\');\n\n');
    f.write('goog.require(\'goog.style\');\n\n');
    f.write('(function() {\n')
    f.write('  var css = %s;\n' % json.dumps(self._CompileCSSContent()))
    f.write('  var ss = goog.html.SafeStyleSheet.fromConstant(goog.string.Const.from(css))\n')
    f.write('  goog.style.installSafeStyleSheet(ss);\n')
    f.write('})();')
    f.close()

  def _GetTargetFileNames(self):
    """ To get the target file path
    """
    return [self._source_file_name + '.js']

class _DebugModeCSSCompiler(_CSSCompiler):
  """ The debug mode css file compiler """

  def __init__(self, file_path, target_directory, compiler, namespace, web_server_path):
    super(_DebugModeCSSCompiler, self).__init__(file_path, target_directory, compiler, namespace)

    self.__web_server_path = web_server_path

  def Compile(self):
    target_css_path = self.GetTargetFilePaths()[1]
    target_js_path = self.GetTargetFilePaths()[0]
    if self._source_file_name_ext != '.css':
      f = open(target_css_path, 'w')
      f.write(self._CompileCSSContent())
      f.close()
    elif self._ShouldUpdate(target_css_path):
      try:
        os.symlink(self._source_file_path, target_css_path)
      except Exception, e:
        logging.warn('symlink %s to %s failed' % (self._source_file_path, target_css_path))
        raise e

    f = open(target_js_path, 'w')
    f.write('goog.provide(\'%s\');\n\n' % self._namespace)
    f.write('(function() {\n')
    f.write('  var head = document.getElementsByTagName(\'HEAD\').item(0);\n')
    f.write('  var style = document.createElement(\'link\');\n')
    f.write('  style.href = \'%s\';\n' % (
        os.path.join(self.__web_server_path, self._source_file_name)))
    f.write('  style.rel = \'stylesheet\';\n')
    f.write('  style.type = \'text/css\';\n')
    f.write('  head.appendChild(style);\n')
    f.write('})();\n')
    f.close()

  def _GetTargetFileNames(self):
    """ To get the target file path
    """
    return [self._source_file_name + '.js', self._source_file_name_root + '.css']

class _SoyCompiler(_Compiler):
  """ The closure template compiler """

  def __init__(self, file_path, target_directory, compiler_jar_path):
    super(_SoyCompiler, self).__init__(file_path, target_directory)

    self._compiler_jar_path = compiler_jar_path

  def Compile(self):
    """ Compile the soy file to target path
    """
    args = ['java', '-jar', self._compiler_jar_path]
    args += ['--shouldGenerateJsdoc', '--shouldProvideRequireSoyNamespaces', '--outputPathFormat']
    args += [self.GetTargetFilePaths()[0], self._source_file_path]
    proc = subprocess.Popen(args, stderr=subprocess.PIPE)
    (stdoutdata, stderrdata) = proc.communicate()
    if proc.returncode != 0:
      raise Exception(stderrdata)

  def _GetTargetFileNames(self):
    """ override the base
    """
    return [self._source_file_name + '.js']

def _IndependentlyCompile(args):
  """ compile the files according to the args independently
  """
  css_extensions = args.css_surfixes.split(',')
  template_extensions = ['soy']

  source_last_mtime = None
  for source_idx, source_dir in enumerate(args.source_dirs):
    count = 0
    middle_target_dir = args.middle_target_dirs[-1]
    if len(args.middle_target_dirs) >= source_idx:
      middle_target_dir = args.middle_target_dirs[source_idx]
    target_dir = os.path.join(args.target_dir, middle_target_dir)
    ns_prefix = (args.ns_prefixes[-1] if len(args.ns_prefixes) < source_idx
        else args.ns_prefixes[source_idx])
    for (directory, subdirs, filenames) in os.walk(source_dir):
      sub_path = os.path.relpath(directory, source_dir)
      web_server_path = os.path.join(
          args.web_server_path, middle_target_dir, sub_path)
      namespace = ns_prefix + ('.' + sub_path.replace(os.sep, '.')).rstrip('.')
      file_target_dir = os.path.join(target_dir, sub_path)
      if not os.path.exists(file_target_dir):
        os.makedirs(file_target_dir)

      for one_name in filenames:
        file_path = os.path.join(directory, one_name)
        shortname, extension = os.path.splitext(one_name)
        extension_name = extension[1:]
        file_mtime = os.path.getmtime(file_path)
        source_last_mtime = file_mtime if file_mtime > source_last_mtime else source_last_mtime

        if extension_name in css_extensions and args.css_compiler:
          if args.for_debug:
            compiler = _DebugModeCSSCompiler(
                file_path,
                file_target_dir,
                args.css_compiler,
                namespace,
                web_server_path)
          else:
            compiler = _ReleaseModeCSSCompiler(
                file_path,
                file_target_dir,
                args.css_compiler,
                namespace)
        elif extension_name in template_extensions:
          compiler = _SoyCompiler(file_path, file_target_dir, args.soy_compiler_jar)
        else:
          compiler = _Compiler(file_path, file_target_dir)

        if not compiler.ShouldUpdate():
          continue
        target_files = compiler.GetTargetFilePaths()
        logging.debug('will compile %s to %s' % (file_path,
            target_files[0] if len(target_files) == 1 else target_files))
        compiler.Compile()
        count += 1

    if count > 0:
      logging.info('%s source files in %s compiled' % (count, source_dir))

  deps_path = os.path.join(args.target_dir, 'deps.js')
  if args.caldeps and (
      not os.path.exists(deps_path) or os.path.getmtime(deps_path) < source_last_mtime):
    logging.info('will generate deps file')
    cmd_items = ['python', args.caldeps, '-o', 'deps',
        '--output_file', deps_path, '-p', args.target_dir]
    proc = subprocess.Popen(cmd_items, stderr=subprocess.PIPE)
    (stdoutdata, stderrdata) = proc.communicate()
    if proc.returncode != 0:
      raise Exception(stderrdata)

def main():
  """The entrypoint for this script."""

  parser = argparse.ArgumentParser()
  parser.add_argument('-v',
                      '--verbose',
                      dest='verbose',
                      action='store_true',
                      default=False,
                      help='Whether show verbos message')
  parser.add_argument('-d',
                      '--fordebug',
                      dest='for_debug',
                      action='store_true',
                      default=False,
                      help='Whether generate for debug mode, default is release mode')
  parser.add_argument('-t',
                      '--targetdir',
                      dest='target_dir',
                      action='store',
                      required=True,
                      help='The compile target directory')
  parser.add_argument('-s',
                      '--sourcedirs',
                      dest='source_dirs',
                      action='append',
                      required=True,
                      help='The compile source directory')
  parser.add_argument('-m',
                      '--midtargetdirs',
                      dest='middle_target_dirs',
                      action='append',
                      required=True,
                      help='The middle directory of target path for each source')
  parser.add_argument('--nsprefix',
                      dest='ns_prefixes',
                      action='append',
                      default=[],
                      help='The prefix for namespace generated for non-js file, such as css')
  parser.add_argument('--webserverpath',
                      dest='web_server_path',
                      action='store',
                      default='/',
                      help='The last components in target directory works as web server path')
  parser.add_argument('--csssurfix',
                      dest='css_surfixes',
                      action='store',
                      default='css,less',
                      help='The file with these surfixes will be compiled as css')
  parser.add_argument('--soycompilerjar',
                      dest='soy_compiler_jar',
                      action='store',
                      help='The closure template compiler jar path')
  parser.add_argument('--csscompiler',
                      dest='css_compiler',
                      action='store',
                      default='lessc',
                      help='The css compiler')
  parser.add_argument('--caldeps',
                      dest='caldeps',
                      action='store',
                      help='The path for caldeps python file')

  args = parser.parse_args()

  level = logging.DEBUG if args.verbose else logging.INFO
  logging.basicConfig(
          format='%(asctime)s %(levelname)s %(filename)s:%(lineno)s - %(message)s',
          level=level)
  _IndependentlyCompile(args)

if __name__ == '__main__':
  main()
