package com.redhat.openshift.knative.showcase.view;

import io.quarkus.test.junit.QuarkusTest;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;
import javax.ws.rs.core.MediaType;

import static org.assertj.core.api.Assertions.assertThat;

@QuarkusTest
class IndexResourceTest {

  private final IndexResourceTestClient resource;

  @Inject
  IndexResourceTest(@RestClient IndexResourceTestClient resource) {
    this.resource = resource;
  }

  @Test
  void index() {
    try (var response = resource.index()) {
      assertThat(response.getMediaType())
        .isEqualTo(MediaType.TEXT_HTML_TYPE.withCharset("UTF-8"));
      assertThat(response.readEntity(String.class))
        .contains(
          "<code>com.redhat.openshift</code>",
          "<code>knative-showcase</code>"
        );
    }
  }

  @Test
  void project() {
    var project = resource.project();

    assertThat(project)
      .extracting(p -> p.group, p -> p.artifact)
      .containsExactly("com.redhat.openshift", "knative-showcase");
  }

}
