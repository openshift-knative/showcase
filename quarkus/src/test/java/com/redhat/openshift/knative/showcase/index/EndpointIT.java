package com.redhat.openshift.knative.showcase.index;

import com.redhat.openshift.knative.showcase.support.Testing;
import io.quarkus.test.junit.QuarkusIntegrationTest;

import java.net.URI;

@QuarkusIntegrationTest
class EndpointIT extends EndpointTest {
  public EndpointIT() {
    // Execute the same tests but in native mode.
    super(Testing.buildRestClient(Client.class));
    rootUri = URI.create(Testing.Constants.DEFAULT_TEST_URL);
  }
}
