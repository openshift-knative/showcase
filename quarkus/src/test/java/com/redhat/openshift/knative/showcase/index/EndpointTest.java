package com.redhat.openshift.knative.showcase.index;

import com.redhat.openshift.knative.showcase.support.Testing;
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

import static org.assertj.core.api.Assertions.assertThat;

@QuarkusTest
class EndpointTest {

  private static final String FEDORA_FIREFOX_UA =
    "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:109.0) " +
      "Gecko/20100101 Firefox/109.0";

  private final Client client;
  @TestHTTPResource("/")
  protected URI rootUri;

  @Inject
  EndpointTest(@RestClient Client client) {
    this.client = client;
  }

  @Test
  void home() {
    try (var response = client.home()) {
      assertThat(response.getMediaType())
        .isEqualTo(MediaType.APPLICATION_JSON_TYPE);
      var index = response.readEntity(Index.class);
      assertIndex(index);
      assertThat(response.getHeaderString("Server"))
        .matches("^Quarkus/.* Java/.*$");
      assertThat(response.getHeaderString("X-Version"))
        .isNotBlank();
      assertThat(response.getHeaderString("X-Config"))
        .isNotBlank();
    }
  }

  @Test
  void homeAsBrowser() throws IOException, InterruptedException {
    var cl = HttpClient.newHttpClient();
    var request = HttpRequest.newBuilder()
      .uri(rootUri)
      .header(HttpHeaders.USER_AGENT, FEDORA_FIREFOX_UA)
      .GET()
      .build();
    var response = cl.send(request, HttpResponse.BodyHandlers.ofString());
    assertThat(response.statusCode()).isEqualTo(200);
    assertThat(response.headers().firstValue(HttpHeaders.CONTENT_TYPE).orElseThrow())
      .isEqualTo(MediaType.TEXT_HTML);
    assertThat(response.body()).contains(
      "<title>OpenShift Knative Showcase</title>",
      "<div id=\"root\"></div>"
    );
  }

  private void assertIndex(Index index) {
    assertThat(index)
      .extracting(p -> p.artifact)
      .isEqualTo("knative-showcase");
    assertThat(index)
      .extracting(p -> p.greeting)
      .isEqualTo(Testing.greeting());
  }

}
