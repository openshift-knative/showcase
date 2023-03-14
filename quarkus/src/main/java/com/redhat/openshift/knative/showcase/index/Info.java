package com.redhat.openshift.knative.showcase.index;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redhat.openshift.knative.showcase.config.Config;
import com.redhat.openshift.knative.showcase.config.Project;

import javax.validation.Valid;

public class Info {
  @Valid
  @JsonProperty
  public Project project;
  @Valid
  @JsonProperty
  public Config config;
}
