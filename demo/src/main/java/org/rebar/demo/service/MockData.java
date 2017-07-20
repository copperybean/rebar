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
package org.rebar.demo.service;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.rebar.demo.model.schedule.HiveJob;
import org.rebar.demo.model.schedule.JobInstance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
public class MockData {
  private static final Logger LOG = LoggerFactory.getLogger(MockData.class);

  @Value(value = "classpath:mock/hive.log")
  private Resource mockHiveLogRes;

  @Value(value = "classpath:mock/hql")
  private Resource mockHqlRes;

  private static int nextJobInsId = 0;

  private Map<String, HiveJob> nameJobMap = new HashMap<String, HiveJob>();
  private Map<String, List<JobInstance>> nameJobInsMap = new HashMap<String, List<JobInstance>>();
  private Map<Integer, JobInstance> idJobInsMap = new HashMap<Integer, JobInstance>();
  private List<JobInstance> runningJobIns = new ArrayList<JobInstance>();
  private List<JobInstance> allJobIns = new ArrayList<JobInstance>();
  private String mockHiveLog = "";
  private String mockHql = "";

  @PostConstruct
  private void init() throws ParseException {
    try {
      mockHiveLog = readResource(mockHiveLogRes);
    } catch (IOException e) {
      LOG.warn("read mock hive log failed: ", e);
    }
    try {
      mockHql = readResource(mockHqlRes);
    } catch (IOException e) {
      LOG.warn("read mock hql failed: ", e);
    }
    int hourSec = 60 * 60;
    int daySec = 24 * hourSec;

    HiveJob job = new HiveJob();
    job.setName("europe_forest_monitor");
    job.setCronExpression("0 7 * * *");
    job.setBasetimeCorrectionSec(-7 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 7 * hourSec);

    job = new HiveJob();
    job.setName("asia_forest_monitor");
    job.setCronExpression("0 0 * * *");
    job.setBasetimeCorrectionSec(-hourSec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 20 * hourSec);

    job = new HiveJob();
    job.setName("north_america_forest_monitor");
    job.setCronExpression("0 12 * * *");
    job.setBasetimeCorrectionSec(-12 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 15 * hourSec);

    job = new HiveJob();
    job.setName("south_america_forest_monitor");
    job.setCronExpression("0 11 * * *");
    job.setBasetimeCorrectionSec(-11 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 18 * hourSec);

    job = new HiveJob();
    job.setName("africa_forest_monitor");
    job.setCronExpression("0 6 * * *");
    job.setBasetimeCorrectionSec(-6 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 19 * hourSec);

    job = new HiveJob();
    job.setName("oceanica_forest_monitor");
    job.setCronExpression("0 21 * * *");
    job.setBasetimeCorrectionSec(3 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 5 * hourSec);

    job = new HiveJob();
    job.setName("pacific_ocean_typhoon_monitor");
    job.setCronExpression("0 22 * * *");
    job.setBasetimeCorrectionSec(2 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 4 * hourSec);

    job = new HiveJob();
    job.setName("indian_ocean_typhoon_monitor");
    job.setCronExpression("30 2 * * *");
    job.setBasetimeCorrectionSec((int) (-2.5 * hourSec) - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 2 * hourSec);

    job = new HiveJob();
    job.setName("atlantic_ocean_typhoon_monitor");
    job.setCronExpression("0 11 * * *");
    job.setBasetimeCorrectionSec(-11 * hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, 3 * hourSec);

    job = new HiveJob();
    job.setName("arctic_ocean_typhoon_monitor");
    job.setCronExpression("0 23 * * *");
    job.setBasetimeCorrectionSec(hourSec - daySec);
    job.setHql(mockHql);
    addJob(job);
    addJobInstances(job, hourSec);
  }

  public List<JobInstance> getRunningJobInstanceList() {
    return runningJobIns;
  }

  public List<JobInstance> getJobInstanceList(String jobName) {
    if (null == jobName) {
      return allJobIns;
    } else if (nameJobInsMap.containsKey(jobName)) {
      return nameJobInsMap.get(jobName);
    }
    return null;
  }

  public JobInstance getJobInstance(Integer id) {
    return idJobInsMap.get(id);
  }

  public String getHiveJobLog() {
    return mockHiveLog;
  }

  public List<HiveJob> getHiveJobList() {
    return new ArrayList<HiveJob>(nameJobMap.values());
  }

  public HiveJob getHiveJob(String jobName) {
    return nameJobMap.get(jobName);
  }

  public String saveHiveJob(HiveJob job) {
    if (nameJobMap.containsKey(job.getName())) {
      return "duplicate job name";
    }
    nameJobMap.put(job.getName(), job);
    return null;
  }

  public String modifyHiveJob(HiveJob job) {
    if (!nameJobMap.containsKey(job.getName())) {
      return "job name not exist";
    }
    nameJobMap.put(job.getName(), job);
    return null;
  }

  private void addJob(HiveJob job) {
    nameJobMap.put(job.getName(), job);
    nameJobInsMap.put(job.getName(), new ArrayList<JobInstance>());
  }

  private void addJobInstances(HiveJob job, int estimateDurationSec) throws ParseException {
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    long dayMilliSec = 1000L * 60 * 60 * 24;

    Calendar calendar = Calendar.getInstance(Locale.CHINA);
    long curMilliSec = calendar.getTimeInMillis();
    calendar.add(Calendar.SECOND, job.getBasetimeCorrectionSec());
    String baseDay = String.format("%d-%d-%d", calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1,
        calendar.get(Calendar.DAY_OF_MONTH));
    long baseDayMilliSec = dateFormat.parse(baseDay).getTime();

    for (int i = 0; i < 10 + 5 * Math.random(); ++i) {
      JobInstance ji = new JobInstance();
      synchronized (MockData.class) {
        ji.setId(++nextJobInsId);
      }
      ji.setJobName(job.getName());
      long startTime = baseDayMilliSec - job.getBasetimeCorrectionSec() * 1000;
      ji.setStartTime(new Date(startTime));
      int duration = (int) (estimateDurationSec + .1 * estimateDurationSec * (Math.random() - .5)) * 1000;
      if (startTime + duration < curMilliSec) {
        ji.setEndTime(new Date(startTime + duration));
      }
      addJobInstance(ji);
      baseDayMilliSec -= dayMilliSec;
    }
  }

  private void addJobInstance(JobInstance ji) {
    nameJobInsMap.get(ji.getJobName()).add(ji);
    idJobInsMap.put(ji.getId(), ji);
    if (ji.getEndTime() == null) {
      runningJobIns.add(ji);
    }
    allJobIns.add(ji);
  }

  private String readResource(Resource res) throws IOException {
    InputStream stream = res.getInputStream();
    long len = res.contentLength();
    byte[] b = new byte[(int) (len)];
    stream.read(b);
    String ret = new String(b);
    stream.close();
    return ret;
  }
}
