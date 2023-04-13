package com.redhat.openshift.knative.showcase.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.quarkus.arc.ClientProxy;
import io.quarkus.runtime.StartupEvent;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import pl.wavesoftware.eid.utils.EidExecutions;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.net.URI;
import java.net.URL;

@ApplicationScoped
public class Config {

  public static final String GREETING_PROPERTY = "greet";
  public static final String DEFAULT_GREETING = "Welcome";
  private static final String SINK_PROPERTY = "k.sink";
  private static final String DEFAULT_SINK = "http://localhost:31111";

  private final URL sink;
  private final String greet;
  private final Long delay;

  @Inject
  Config(
    @ConfigProperty(name = SINK_PROPERTY, defaultValue = DEFAULT_SINK)
    URL sink,
    @ConfigProperty(name = GREETING_PROPERTY, defaultValue = DEFAULT_GREETING)
    String greet,
    @ConfigProperty(name = "delay", defaultValue = "0")
    Long delay
  ) {
    this.sink = sink;
    this.greet = greet;
    this.delay = delay;
  }

  @NotNull
  @JsonProperty
  public URI getSink() {
    return EidExecutions.tryToExecute(sink::toURI, "20230228:140112");
  }

  @Pattern(regexp = "[A-Z][a-z]+")
  @JsonProperty
  public String getGreet() {
    return greet;
  }

  @Min(0)
  @JsonProperty
  public Long getDelay() {
    return delay;
  }

  public static Config from(Config other) {
    if (other instanceof ClientProxy) {
      other = ClientProxy.unwrap(other);
    }
    return new Config(other.sink, other.greet, other.delay);
  }

  void startup(@Observes StartupEvent ignoredEvent, Validator validator) {
    var violations = validator.validate(this);
    if (!violations.isEmpty()) {
      throw new ConstraintViolationException(violations);
    }
  }

}
