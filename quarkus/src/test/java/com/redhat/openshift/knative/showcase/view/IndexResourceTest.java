package com.redhat.openshift.knative.showcase.view;

import com.redhat.openshift.knative.showcase.domain.entity.Project;
import io.quarkus.test.common.http.TestHTTPResource;
import io.quarkus.test.junit.QuarkusTest;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

@QuarkusTest
class IndexResourceTest {

  private static final String FEDORA_FIREFOX_UA =
    "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:109.0) " +
      "Gecko/20100101 Firefox/109.0";

  private final IndexResourceTestClient resource;
  @TestHTTPResource("/")
  protected URI rootUri;

  @Inject
  IndexResourceTest(@RestClient IndexResourceTestClient resource) {
    this.resource = resource;
  }

  @Test
  void index() {
    try (var response = resource.index()) {
      assertThat(response.getMediaType())
        .isEqualTo(MediaType.APPLICATION_JSON_TYPE);
      var project = response.readEntity(Project.class);
      assertProject(project);
    }
  }

  @Test
  void indexAsBrowser() throws IOException, InterruptedException {
    var cl = HttpClient.newHttpClient();
    var request = HttpRequest.newBuilder()
      .uri(rootUri)
      .header(HttpHeaders.USER_AGENT, FEDORA_FIREFOX_UA)
      .GET()
      .build();
    var response = cl.send(request, HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(200);
    var mt = MediaType.TEXT_HTML_TYPE.withCharset(StandardCharsets.UTF_8.toString()).toString();
    assertThat(response.headers().firstValue(HttpHeaders.CONTENT_TYPE).orElseThrow())
      .isEqualTo(mt);
    assertThat(response.body()).contains(
      "Group: <code>com.redhat.openshift</code>",
      "Artifact: <code>knative-showcase</code>"
    );
  }

  @Test
  void project() {
    var project = resource.project();

    assertProject(project);
  }

  private void assertProject(Project project) {
    assertThat(project)
      .extracting(p -> p.group, p -> p.artifact)
      .containsExactly("com.redhat.openshift", "knative-showcase");
  }

}
