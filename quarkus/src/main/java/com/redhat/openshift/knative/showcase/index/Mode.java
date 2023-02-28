package com.redhat.openshift.knative.showcase.index;

import io.vertx.core.http.HttpServerRequest;
import org.jboss.resteasy.reactive.server.jaxrs.HttpHeadersImpl;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;

@RequestScoped
class Mode {

  private final HttpHeaders headers;

  @Inject
  public Mode(HttpServerRequest request) {
    this.headers = new HttpHeadersImpl(request.headers());
  }

  public boolean isJson() {
    return !isBrowser() || acceptsJsonExplicitly();
  }

  private boolean isBrowser() {
    return headers
      .getHeaderString(HttpHeaders.USER_AGENT)
      .startsWith("Mozilla");
  }

  private boolean acceptsJsonExplicitly() {
    return headers
      .getAcceptableMediaTypes()
      .contains(MediaType.APPLICATION_JSON_TYPE);
  }
}
