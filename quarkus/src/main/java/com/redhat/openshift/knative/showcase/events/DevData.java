package com.redhat.openshift.knative.showcase.events;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redhat.openshift.knative.showcase.config.Config;
import com.redhat.openshift.knative.showcase.hello.Hello;
import io.cloudevents.core.builder.CloudEventBuilder;
import io.quarkus.arc.profile.IfBuildProfile;
import io.quarkus.runtime.StartupEvent;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import java.net.URI;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.UUID;
import java.util.random.RandomGenerator;
import java.util.random.RandomGeneratorFactory;

@IfBuildProfile("dev")
@ApplicationScoped
class DevData {
  private final Config config;

  @Inject
  DevData(Config config) {
    this.config = config;
  }

  void init(@Observes StartupEvent ignored, ObjectMapper om, Endpoint endpoint)
    throws JsonProcessingException {
    var rg = RandomGeneratorFactory.all()
      .findFirst()
      .orElseGet(RandomGeneratorFactory::getDefault)
      .create(DevData.class.hashCode());

    for (int i = 1; i <= 2; i++) {
      var h = random(rg);
      endpoint.receive(CloudEventBuilder.v1()
        .withId(new UUID(rg.nextLong(), rg.nextLong()).toString())
        .withSource(URI.create("//devdata"))
        .withType(Hello.class.getName())
        .withTime(OffsetDateTime.ofInstant(
          Instant.ofEpochSecond(rg.nextLong(1_672_527_600, 1_677_883_620)),
          ZoneId.systemDefault()))
        .withData(MediaType.APPLICATION_JSON, om.writeValueAsBytes(h))
        .build());
    }
  }

  private Hello random(RandomGenerator rg) {
    return new Hello(
      config.getGreet(),
      "Developer" + rg.nextInt(1, 100),
      rg.nextInt(1, 100)
    );
  }
}
