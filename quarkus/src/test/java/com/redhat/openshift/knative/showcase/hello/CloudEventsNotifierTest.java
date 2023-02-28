package com.redhat.openshift.knative.showcase.hello;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.cloudevents.CloudEvent;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class CloudEventsNotifierTest {

  @Test
  void notifyFor() {
    // given
    var hello = new Hello("Hi", "Chris", 43);
    var objectMapper = new ObjectMapper();
    var sent = new AtomicReference<CloudEvent>();
    EventSender eventSender = sent::set;
    var notify = new CloudEventsNotifier(eventSender, objectMapper);
    var now = OffsetDateTime.now();

    // when
    notify.notifyFor(hello);

    // then
    var ce = sent.get();
    assertThat(ce).isNotNull();
    assertThat(ce.getType()).isEqualTo(Hello.class.getName());
    assertThat(ce.getTime()).isAfterOrEqualTo(now);
  }
}
