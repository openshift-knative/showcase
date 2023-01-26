package com.redhat.openshift.knative.showcase.domain.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import pl.wavesoftware.utils.stringify.Stringify;

import javax.validation.constraints.NotEmpty;

public class Platform {
  @JsonProperty
  @NotEmpty
  public String quarkus;
  @JsonProperty
  @NotEmpty
  public String java;

  @Override
  public String toString() {
    return Stringify.of(this).toString();
  }
}
