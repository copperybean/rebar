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
package org.rebar.demo.model;

import java.util.ArrayList;
import java.util.List;

public class RestResponse<DataT> {
  public static final int CODE_SUCCESSFUL = 0;
  public static final int CODE_FAILED = 1;

  private List<DataT> dataList = new ArrayList<DataT>();
  private int code = CODE_FAILED;
  private String message;

  public List<DataT> getDataList() {
    return dataList;
  }

  public void setDataList(List<DataT> dataList) {
    this.dataList = dataList;
  }

  public int getCode() {
    return code;
  }

  public void setCode(int code) {
    this.code = code;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
