package com.redhat.openshift.knative.showcase.hello;

import com.redhat.openshift.knative.showcase.config.Config;
import io.cloudevents.CloudEvent;
import io.cloudevents.http.restful.ws.CloudEventsProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.helpers.MessageFormatter;
import pl.wavesoftware.eid.exceptions.EidIllegalStateException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Response;
import java.net.URI;

import static pl.wavesoftware.eid.DefaultEid.eid;

@ApplicationScoped
class JaxrsEventSender implements EventSender {
  private static final Logger LOGGER =
    LoggerFactory.getLogger(JaxrsEventSender.class);

  private final Config config;

  @Inject
  JaxrsEventSender(Config config) {
    this.config = config;
  }

  @Override
  public void send(CloudEvent ce) {
    var sink = config.getSink();
    var target = webTarget(sink);
    var res = target
      .request()
      .buildPost(Entity.entity(ce, CloudEventsProvider.CLOUDEVENT_TYPE))
      .invoke();
    handleResponse(ce, sink, res);
  }

  private WebTarget webTarget(URI sink) {
    return ClientBuilder.newClient()
      .target(sink);
  }

  private void handleResponse(CloudEvent ce, URI sink, Response res) {
    if (isSuccessful(res)) {
      LOGGER.info("Event {} sent to {}", ce.getId(), sink);
    } else {
      throw new EidIllegalStateException(
        eid("20200928:182242"),
        MessageFormatter.format(
          "unexpected return code {} for event {}",
          res.getStatusInfo(), ce.getId()
        ).getMessage()
      );
    }
  }

  private boolean isSuccessful(Response response) {
    return response.getStatus() >= Response.Status.OK.getStatusCode()
      && response.getStatus() < Response.Status.BAD_REQUEST.getStatusCode();
  }
}
