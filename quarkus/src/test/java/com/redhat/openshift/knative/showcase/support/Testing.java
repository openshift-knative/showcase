package com.redhat.openshift.knative.showcase.support;

import com.redhat.openshift.knative.showcase.config.Config;
import org.eclipse.microprofile.rest.client.RestClientBuilder;

import java.net.URI;
import java.util.Optional;

public final class Testing {

  public static <T> T buildRestClient(Class<T> clazz) {
    return RestClientBuilder
        .newBuilder()
        .baseUri(URI.create(Constants.DEFAULT_TEST_URL))
        .build(clazz);
  }

  public static String greeting() {
    return Optional.ofNullable(System.getenv(
      Config.GREETING_PROPERTY.toUpperCase()
    )).orElse(Config.DEFAULT_GREETING);
  }

  public static class Constants {
    public static final String DEFAULT_TEST_URL = "http://localhost:8081";

    private Constants() {
      // not reachable
    }
  }
}
