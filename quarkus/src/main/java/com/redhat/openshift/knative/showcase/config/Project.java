package com.redhat.openshift.knative.showcase.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.smallrye.config.ConfigMapping;

@ConfigMapping(
  prefix = "project",
  namingStrategy = ConfigMapping.NamingStrategy.KEBAB_CASE
)
public interface Project {
  @JsonProperty
  String group();
  @JsonProperty
  String artifact();
  @JsonProperty
  String version();
  @JsonProperty
  String platform();
}
