package com.redhat.openshift.oci.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Config {
  public final String digest;
  public final Long size;
  public final String mediaType;

  @JsonCreator
  public Config(
    @JsonProperty("digest") String digest,
    @JsonProperty("size") Long size,
    @JsonProperty("mediaType") String mediaType
  ) {
    this.digest = digest;
    this.size = size;
    this.mediaType = mediaType;
  }
}
