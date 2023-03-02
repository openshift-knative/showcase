package com.redhat.openshift.knative.showcase.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cloudevents.CloudEvent;
import io.cloudevents.core.builder.CloudEventBuilder;
import io.cloudevents.http.restful.ws.StructuredEncoding;
import io.cloudevents.jackson.JsonFormat;
import io.quarkus.runtime.StartupEvent;
import io.smallrye.mutiny.Multi;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.jboss.resteasy.reactive.RestStreamElementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.random.RandomGenerator;

@Path("events")
@ApplicationScoped
class Endpoint {

  private static final Logger LOGGER = LoggerFactory.getLogger(Endpoint.class);
  private final List<CloudEvent> events = new ArrayList<>();

  void init(@Observes StartupEvent ignored, ObjectMapper om)
    throws JsonProcessingException {
    var rg = RandomGenerator.getDefault();
    for (int i = 0; i < 3; i++) {
      var s = Score.random(rg);
      events.add(CloudEventBuilder.v1()
        .withId(String.valueOf(i))
        .withSource(URI.create("//localhost/dev"))
        .withType(Endpoint.class.getName())
        .withData(MediaType.APPLICATION_JSON, om.writeValueAsBytes(s))
        .build());
    }
  }

  @GET
  @Operation(summary = "Retrieves all registered events as a JSON stream")
  @RestStreamElementType(MediaType.APPLICATION_JSON)
  @StructuredEncoding(JsonFormat.CONTENT_TYPE)
  public Multi<CloudEvent> events() {
    return Multi.createFrom().iterable(events);
  }

  @GET
  @Path("last")
  @Produces(MediaType.APPLICATION_JSON)
  @StructuredEncoding(JsonFormat.CONTENT_TYPE)
  public CloudEvent last() {
    return events.get(events.size() - 1);
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Operation(summary = "Receives a CloudEvent and stores it")
  public void receive(CloudEvent event) {
    events.add(event);
    LOGGER.info("Received event: {}", event);
  }

  private static final class Score {
    @JsonProperty
    Play play;
    @JsonProperty
    int score;

    static Score random(RandomGenerator rg) {
      var s = new Score();
      s.score = rg.nextInt(1_000);
      s.play = new Play();
      s.play.id = new UUID(rg.nextLong(), rg.nextLong()).toString();
      s.play.game = rg.nextInt(300);
      return s;
    }
  }

  private static class Play {
    @JsonProperty
    String id;
    @JsonProperty
    Integer game;
  }
}
