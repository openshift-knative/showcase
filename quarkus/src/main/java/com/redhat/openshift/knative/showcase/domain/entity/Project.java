package com.redhat.openshift.knative.showcase.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redhat.openshift.knative.showcase.config.ProjectInfo;
import pl.wavesoftware.utils.stringify.Stringify;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

public class Project {
  @JsonProperty
  @NotEmpty
  public String group;
  @JsonProperty
  @NotEmpty
  public String artifact;
  @JsonProperty
  @NotEmpty
  public String version;
  @JsonProperty
  @Valid
  public Platform platform;

  public static Project from(ProjectInfo info) {
    var p = new Project();
    p.group = info.group();
    p.artifact = info.artifact();
    p.version = info.version();
    p.platform = new Platform();
    p.platform.quarkus = info.platform();
    p.platform.java = System.getProperty("java.version");
    return p;
  }

  @Override
  public String toString() {
    return Stringify.of(this).toString();
  }

}
