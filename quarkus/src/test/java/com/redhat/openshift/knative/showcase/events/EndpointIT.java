package com.redhat.openshift.knative.showcase.events;

import com.redhat.openshift.knative.showcase.support.Testing;
import io.quarkus.test.junit.QuarkusIntegrationTest;
import org.junit.jupiter.api.Disabled;

/**
 * TODO: Enable this test once the native mode is working.
 *       See: https://github.com/cloudevents/sdk-java/issues/546
 */
@Disabled("not yet working in native mode")
@QuarkusIntegrationTest
class EndpointIT extends EndpointTest {
  EndpointIT() {
    super(Testing.buildRestClient(Client.class));
  }
}
