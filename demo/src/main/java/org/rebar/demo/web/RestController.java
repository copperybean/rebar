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
package org.rebar.demo.web;

import java.util.Arrays;

import org.rebar.demo.model.RestResponse;
import org.rebar.demo.model.schedule.HiveJob;
import org.rebar.demo.model.schedule.JobInstance;
import org.rebar.demo.service.MockData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/rest")
public class RestController {
  private static final Logger LOG = LoggerFactory.getLogger(RestController.class);

  @Autowired
  private MockData mockData;

  @RequestMapping(value = "/getJobInstances", method = RequestMethod.GET)
  @ResponseBody
  public RestResponse<JobInstance> getJobInstances(@RequestParam(value = "insid", required = false) Integer instanceId,
      @RequestParam(value = "onlyrunning", required = false) Boolean onlyRunning) {
    RestResponse<JobInstance> ret = new RestResponse<JobInstance>();
    if (instanceId != null) {
      ret.setDataList(Arrays.asList(mockData.getJobInstance(instanceId)));
    } else if (null != onlyRunning && onlyRunning == true) {
      ret.setDataList(mockData.getRunningJobInstanceList());
    } else {
      ret.setDataList(mockData.getJobInstanceList(null));
    }
    ret.setCode(RestResponse.CODE_SUCCESSFUL);
    return ret;
  }

  @RequestMapping(value = "/getHiveJobLog", method = RequestMethod.GET)
  @ResponseBody
  public RestResponse<String> getHiveJobLog(@RequestParam(value = "insid", required = false) Integer instanceId) {
    RestResponse<String> ret = new RestResponse<String>();
    ret.getDataList().add(mockData.getHiveJobLog());
    ret.setCode(RestResponse.CODE_SUCCESSFUL);
    return ret;
  }

  @RequestMapping(value = "/getJobs", method = RequestMethod.GET)
  @ResponseBody
  public RestResponse<HiveJob> getJobs(@RequestParam(value = "jobname", required = false) String jobName) {
    RestResponse<HiveJob> ret = new RestResponse<HiveJob>();
    if (jobName == null) {
      ret.getDataList().addAll(mockData.getHiveJobList());
    } else {
      ret.setDataList(Arrays.asList(mockData.getHiveJob(jobName)));
    }
    ret.setCode(RestResponse.CODE_SUCCESSFUL);
    return ret;
  }

  @RequestMapping(value = "/getJobInfo", method = RequestMethod.GET)
  @ResponseBody
  public RestResponse<HiveJob> getJobInfo(@RequestParam(value = "jobname", required = true) String jobName) {
    HiveJob job = mockData.getHiveJob(jobName);
    RestResponse<HiveJob> ret = new RestResponse<HiveJob>();
    if (null == job) {
      return ret;
    }
    job.setInstances(mockData.getJobInstanceList(jobName));
    ret.setDataList(Arrays.asList(job));
    ret.setCode(RestResponse.CODE_SUCCESSFUL);
    return ret;
  }

  @RequestMapping(value = "/saveJob", method = RequestMethod.POST)
  @ResponseBody
  public RestResponse<Integer> saveJob(@RequestParam(value = "jobname", required = false) String jobName,
      @RequestBody(required = true) HiveJob job) {
    RestResponse<Integer> ret = new RestResponse<Integer>();
    if (StringUtils.isEmpty(jobName)) {
      ret.setMessage(mockData.saveHiveJob(job));
    } else if (jobName.equals(job.getName())) {
      ret.setMessage(mockData.modifyHiveJob(job));
    } else {
      ret.setMessage("can not modify job name");
    }
    if (ret.getMessage() == null) {
      ret.setCode(RestResponse.CODE_SUCCESSFUL);
    } else {
      LOG.warn("save job failed with message: {}", ret.getMessage());
    }
    return ret;
  }
}
