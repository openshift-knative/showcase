package com.redhat.openshift.oci.registry;

public class Scope {
  public final String repository;
  public final String action;

  public Scope(String repository) {
    this(repository, "pull");
  }

  public Scope(String repository, String action) {
    this.repository = repository;
    this.action = action;
  }

  @Override
  public String toString() {
    return "repository:" + repository + ":" + action;
  }
}
