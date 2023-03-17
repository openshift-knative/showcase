package com.redhat.openshift.oci.registry;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

public class Manifest {
  public final Integer schemaVersion;
  public final List<Layer> layers;
  public final Config config;

  @JsonCreator
  public Manifest(
    @JsonProperty("schemaVersion") Integer schemaVersion,
    @JsonProperty("layers") List<Layer> layers,
    @JsonProperty("config") Config config
  ) {
    this.schemaVersion = schemaVersion;
    this.layers = new ArrayList<>(layers);
    this.config = config;
  }
}
