package com.redhat.openshift.knative.showcase.events;

import io.cloudevents.core.builder.CloudEventBuilder;
import io.cloudevents.jackson.JsonFormat;
import io.quarkus.test.junit.QuarkusTest;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.junit.jupiter.api.Test;

import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import static org.assertj.core.api.Assertions.assertThat;

@QuarkusTest
class EndpointTest {

  private final Client client;

  @Inject
  EndpointTest(@RestClient Client client) {
    this.client = client;
  }

  @Test
  void events() throws ExecutionException, InterruptedException {
    var id = UUID.randomUUID();
    sendEvent(id.toString());
    var serializer = new JsonFormat();
    var collected = client.events()
      .map(serializer::deserialize)
      .capDemandsTo(1)
      .collect()
      .first()
      .subscribe()
      .asCompletionStage()
      .get();

    assertThat(collected).isNotNull();
    assertThat(collected.getId())
      .isEqualTo(id.toString());
  }

  @Test
  void receive() {
    sendEvent("123456");
  }

  @Test
  void receiveOnIndex() {
    sendEvent("654321");
  }

  private void sendEvent(String id) {
    var ce = CloudEventBuilder.v1()
      .withId(id)
      .withSource(URI.create("http://localhost"))
      .withType("test")
      .withData(MediaType.TEXT_PLAIN,
        "Hello, World!".getBytes(StandardCharsets.UTF_8))
      .build();

    client.receive(ce);
  }
}
