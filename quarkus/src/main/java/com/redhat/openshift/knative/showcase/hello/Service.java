package com.redhat.openshift.knative.showcase.hello;

import com.redhat.openshift.knative.showcase.config.Config;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

@ApplicationScoped
class Service {
  private static final Logger LOGGER = LoggerFactory.getLogger(Service.class);

  private final Config config;
  private final Notifier notifier;
  private final Counter counter;

  @Inject
  Service(Config config, Notifier notifier, Counter counter) {
    this.config = config;
    this.notifier = notifier;
    this.counter = counter;
  }

  Hello greet(String who) {
    var num = counter.getNumber();
    var hello = new Hello(config.getGreet(), who, num);
    notifier.notifyFor(hello);
    maybeSleep();
    return hello;
  }

  private void maybeSleep() {
    var d = config.getDelay();
    if (d > 0) {
      sleep(d);
    }
  }

  private static void sleep(long delay) {
    try {
      Thread.sleep(delay);
    } catch (InterruptedException ex) {
      LOGGER.warn("Interrupted!", ex);
      // Restore interrupted state...
      Thread.currentThread().interrupt();
    }
  }
}
