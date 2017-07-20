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

import java.util.ArrayList;
import java.util.List;

public class HiveJob {
  private String name;
  private String cronExpression;
  private Integer basetimeCorrectionSec;
  private String hql;
  private List<JobInstance> instances;

  public HiveJob() {
  }

  public HiveJob(HiveJob another) {
    name = another.name;
    cronExpression = another.cronExpression;
    basetimeCorrectionSec = another.basetimeCorrectionSec;
    hql = another.hql;
    if (null == another.instances) {
      instances = null;
    } else {
      instances = new ArrayList<JobInstance>(instances);
    }
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCronExpression() {
    return cronExpression;
  }

  public void setCronExpression(String cronExpression) {
    this.cronExpression = cronExpression;
  }

  public Integer getBasetimeCorrectionSec() {
    return basetimeCorrectionSec;
  }

  public void setBasetimeCorrectionSec(Integer basetimeCorrectionSec) {
    this.basetimeCorrectionSec = basetimeCorrectionSec;
  }

  public String getHql() {
    return hql;
  }

  public void setHql(String hql) {
    this.hql = hql;
  }

  public List<JobInstance> getInstances() {
    return instances;
  }

  public void setInstances(List<JobInstance> instances) {
    this.instances = instances;
  }
}
