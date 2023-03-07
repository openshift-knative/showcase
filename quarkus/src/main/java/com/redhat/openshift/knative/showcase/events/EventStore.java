package com.redhat.openshift.knative.showcase.events;

import io.cloudevents.CloudEvent;
import io.smallrye.mutiny.Multi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

class EventStore {
  private static final Logger LOGGER =
    LoggerFactory.getLogger(EventStore.class);
  private final List<CloudEvent> events = new ArrayList<>();
  private final ExecutorService executorService =
    Executors.newFixedThreadPool(6);

  Multi<CloudEvent> stream() {
    var p = new EventsPuller();
    return Multi.createBy()
      .repeating()
      .supplier(p::pull)
      .indefinitely()
      .runSubscriptionOn(executorService);
  }

  void add(CloudEvent event) {
    events.add(event);
  }

  private final class EventsPuller {
    private int index = 0;
    CloudEvent pull() {
      while (index >= events.size()) {
        block();
      }
      var e = events.get(index);
      LOGGER.trace("Pulling({}): {}", index, e.getId());
      index++;
      return e;
    }

    private void block() {
      try {
        Thread.sleep(25);
      } catch (InterruptedException e) {
        LOGGER.warn("Interrupted!", e);
        Thread.currentThread().interrupt();
      }
    }
  }
}
