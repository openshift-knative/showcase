package com.redhat.openshift.knative.showcase.hello;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Path;

@ApplicationScoped
@Path("")
class Rest implements Endpoint {
  private static final Logger LOGGER = LoggerFactory.getLogger(Rest.class);

  private final Service service;

  @Inject
  Rest(Service service) {
    this.service = service;
  }

  @Override
  @Valid
  public Hello hello(String who) {
    try {
      var hello = service.greet(who);
      LOGGER.info("Received hello({}) for {}", hello.getNumber(), who);
      LOGGER.debug("Responding with: {}", hello);
      return hello;
    } catch (RuntimeException ex) {
      LOGGER.info("Received hello for: {}", who);
      throw ex;
    }
  }
}
