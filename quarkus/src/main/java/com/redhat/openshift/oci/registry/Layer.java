package com.redhat.openshift.oci.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.HashMap;
import java.util.Map;

public class Layer {
  public final String digest;
  public final Long size;
  public final String mediaType;
  public final Map<String, String> annotations;

  @JsonCreator
  public Layer(
    @JsonProperty("digest") String digest,
    @JsonProperty("size") Long size,
    @JsonProperty("mediaType") String mediaType,
    @JsonProperty("annotations") Map<String, String> annotations
  ) {
    this.digest = digest;
    this.size = size;
    this.mediaType = mediaType;
    this.annotations = new HashMap<>(annotations);
  }
}
