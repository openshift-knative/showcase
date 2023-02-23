package com.redhat.openshift.knative.showcase.view;

import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class HelloEndpointIT extends HelloEndpointTest {
  public HelloEndpointIT() {
    // Execute the same tests but in native mode.
    super(Testing.buildRestClient(HelloClient.class));
    invalidHelloMessage = "Unknown error, status code 400";
  }
}
