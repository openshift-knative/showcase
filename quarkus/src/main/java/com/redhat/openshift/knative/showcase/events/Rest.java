package com.redhat.openshift.knative.showcase.events;

import io.cloudevents.CloudEvent;
import io.cloudevents.jackson.JsonFormat;
import io.smallrye.mutiny.Multi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.Path;

@Path("")
@ApplicationScoped
class Rest implements Endpoint {

  private static final Logger LOGGER = LoggerFactory.getLogger(Rest.class);
  private final EventStore events = new EventStore();

  @Override
  public Multi<byte[]> events() {
    return events.stream()
      .map(Rest::workaroundQuarkus31587);
  }

  @Override
  public void receive(CloudEvent event) {
    events.add(event);
    LOGGER.debug("Received event: {}", event);
  }

  @Override
  public void receiveOnIndex(CloudEvent event) {
    receive(event);
  }

  /**
   * A workaround for
   * <a href="https://github.com/quarkusio/quarkus/issues/31587">quarkusio/quarkus#31587</a>
   * and <a href="https://github.com/cloudevents/sdk-java/issues/533">cloudevents/sdk-java#533</a>.
   *
   * TODO: Remove this method once the above issues is fixed.
   */
  private static byte[] workaroundQuarkus31587(CloudEvent event) {
    var serializer = new JsonFormat();
    return serializer.serialize(event);
  }
}
