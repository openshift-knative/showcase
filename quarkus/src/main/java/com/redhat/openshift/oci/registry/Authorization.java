package com.redhat.openshift.oci.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Authorization {
  public final String token;

  @JsonCreator
  public Authorization(@JsonProperty("token") String token) {
    this.token = token;
  }

  @Override
  public String toString() {
    return "Bearer " + token;
  }
}
