package com.redhat.openshift.knative.showcase.config;

import io.smallrye.config.ConfigMapping;

@ConfigMapping(
  prefix = "project",
  namingStrategy = ConfigMapping.NamingStrategy.KEBAB_CASE
)
public interface Project {
  String group();
  String artifact();
  String version();
  String platform();
}
