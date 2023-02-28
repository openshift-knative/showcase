package com.redhat.openshift.knative.showcase.hello;

import com.redhat.openshift.knative.showcase.support.Testing;
import io.quarkus.test.junit.QuarkusIntegrationTest;

@QuarkusIntegrationTest
class EndpointIT extends EndpointTest {
  public EndpointIT() {
    // Execute the same tests but in native mode.
    super(Testing.buildRestClient(Client.class));
    invalidHelloMessage = "Unknown error, status code 400";
  }
}
