package com.redhat.openshift.knative.showcase.index;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redhat.openshift.knative.showcase.config.Config;
import com.redhat.openshift.knative.showcase.config.Project;

import javax.validation.constraints.NotEmpty;

public class Index {
  @JsonProperty
  @NotEmpty
  public String artifact;
  @JsonProperty
  public String greeting;

  public static Index from(Project project, Config config) {
    var p = new Index();
    p.artifact = project.artifact();
    p.greeting = config.getGreet();
    return p;
  }

}
