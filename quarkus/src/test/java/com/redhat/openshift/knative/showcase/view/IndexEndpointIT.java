package com.redhat.openshift.knative.showcase.view;

import io.quarkus.test.junit.QuarkusIntegrationTest;

import java.net.URI;

@QuarkusIntegrationTest
class IndexEndpointIT extends IndexEndpointTest {
  public IndexEndpointIT() {
    // Execute the same tests but in native mode.
    super(Testing.buildRestClient(IndexClient.class));
    rootUri = URI.create(Testing.Constants.DEFAULT_TEST_URL);
  }
}
