package com.redhat.openshift.knative.showcase.view;

import org.jboss.resteasy.microprofile.client.RestClientBuilderImpl;

import java.net.URI;

final class Testing {

  static <T> T buildRestClient(Class<T> clazz) {
    var br = new RestClientBuilderImpl();
    return br
      .baseUri(URI.create(Constants.DEFAULT_TEST_URL))
      .build(clazz);
  }

  class Constants {
    public static final String DEFAULT_TEST_URL = "http://localhost:8081";

    private Constants() {
      // not reachable
    }
  }
}
