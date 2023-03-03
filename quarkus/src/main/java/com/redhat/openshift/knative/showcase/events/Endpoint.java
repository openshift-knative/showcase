package com.redhat.openshift.knative.showcase.events;

import io.cloudevents.CloudEvent;
import io.cloudevents.jackson.JsonFormat;
import io.smallrye.mutiny.Multi;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.jboss.resteasy.reactive.RestStreamElementType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

@Path("events")
@ApplicationScoped
class Endpoint {

  private static final Logger LOGGER = LoggerFactory.getLogger(Endpoint.class);
  private final List<CloudEvent> events = new ArrayList<>();

  @GET
  @Operation(summary = "Retrieves all registered events as a JSON stream")
  @RestStreamElementType(JsonFormat.CONTENT_TYPE)
  public Multi<Event> events() {
    return Multi.createFrom()
      .iterable(events)
      .map(this::workaroundQuarkus31587);
  }

  @POST
  @Consumes({MediaType.APPLICATION_JSON, JsonFormat.CONTENT_TYPE})
  @Operation(summary = "Receives a CloudEvent and stores it")
  public void receive(CloudEvent event) {
    events.add(event);
    LOGGER.debug("Received event: {}", event);
  }

  /**
   * A workaround for
   * <a href="https://github.com/quarkusio/quarkus/issues/31587">quarkusio/quarkus#31587</a>
   * and <a href="https://github.com/cloudevents/sdk-java/issues/533">cloudevents/sdk-java#533</a>.
   *
   * TODO: Remove this method once the above issues is fixed.
   */
  private Event workaroundQuarkus31587(CloudEvent event) {
    return Event.from(event, om);
  }
  }
}
