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
package org.rebar.demo.model.schedule;

import java.util.Date;

public class JobInstance {
  private Integer id;
  private String jobName;
  private Date startTime;
  private Date endTime;
  private String log;

  public JobInstance() {
  }

  public JobInstance(JobInstance another) {
    id = another.id;
    jobName = another.jobName;
    startTime = another.startTime;
    endTime = another.endTime;
    log = another.log;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getJobName() {
    return jobName;
  }

  public void setJobName(String jobName) {
    this.jobName = jobName;
  }

  public Date getStartTime() {
    return startTime;
  }

  public void setStartTime(Date startTime) {
    this.startTime = startTime;
  }

  public Date getEndTime() {
    return endTime;
  }

  public void setEndTime(Date endTime) {
    this.endTime = endTime;
  }

  public String getLog() {
    return log;
  }

  public void setLog(String log) {
    this.log = log;
  }
}
