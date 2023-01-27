package com.redhat.openshift.knative.showcase.view;

import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpServerRequest;
import org.jboss.resteasy.core.Headers;
import org.jboss.resteasy.specimpl.ResteasyHttpHeaders;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;

@RequestScoped
class IndexMode {

  private final HttpHeaders headers;

  @Inject
  public IndexMode(HttpServerRequest request) {
    this.headers = new ResteasyHttpHeaders(toMultivaluedMap(request.headers()));
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

  private static MultivaluedMap<String, String> toMultivaluedMap(MultiMap input) {
    var headers = new Headers<String>();
    input.forEach(entry -> headers.add(entry.getKey(), entry.getValue()));
    return headers;
  }
}
