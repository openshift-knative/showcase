package com.redhat.openshift.knative.showcase.hello;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.cloudevents.core.builder.CloudEventBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pl.wavesoftware.eid.utils.EidExecutions;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.time.OffsetDateTime;
import java.util.UUID;

@ApplicationScoped
class CloudEventsNotifier implements Notifier {

  private static final Logger LOGGER =
    LoggerFactory.getLogger(CloudEventsNotifier.class);
  public static final String SOURCE_URI = "//events/showcase";
  public static final URI SOURCE = EidExecutions.tryToExecute(
    () -> new URI(SOURCE_URI), "20200302:154748"
  );

  private final EventSender eventSender;
  private final ObjectMapper objectMapper;

  @Inject
  CloudEventsNotifier(EventSender eventSender, ObjectMapper objectMapper) {
    this.eventSender = eventSender;
    this.objectMapper = objectMapper;
  }

  @Override
  public void notifyFor(Hello hello) {
    var data = EidExecutions.tryToExecute(
      () -> objectMapper.writeValueAsBytes(hello), "20200923:113901"
    );
    var event = CloudEventBuilder.v1()
      .withTime(OffsetDateTime.now())
      .withType(Hello.class.getName())
      .withId(UUID.randomUUID().toString())
      .withSource(SOURCE)
      .withData(MediaType.APPLICATION_JSON, data)
      .build();
    try {
      eventSender.send(event);
    } catch (RuntimeException ex) {
      LOGGER.error("Can't send hello event: {}", event);
      LOGGER.error("Exception", ex);
    }
  }

}
