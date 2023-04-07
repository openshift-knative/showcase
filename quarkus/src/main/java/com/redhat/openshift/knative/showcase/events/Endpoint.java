package com.redhat.openshift.knative.showcase.events;

import io.cloudevents.CloudEvent;
import io.cloudevents.jackson.JsonFormat;
import io.smallrye.mutiny.Multi;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.jboss.resteasy.reactive.RestStreamElementType;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

public interface Endpoint {
  /**
   * TODO: Replace byte[] with CloudEvent when
   *       https://github.com/quarkusio/quarkus/issues/31587 is fixed.
   */
  @GET
  @Operation(summary = "Retrieves all registered events as a JSON stream")
  @RestStreamElementType(JsonFormat.CONTENT_TYPE)
  @Path("events")
  Multi<byte[]> events();

  @POST
  @Consumes
  @Operation(summary = "Receives a CloudEvent and stores it")
  @Path("events")
  void receive(CloudEvent event);

  @POST
  @Consumes
  @Operation(summary = "Receives a CloudEvent and stores it")
  @Path("")
  void receiveOnIndex(CloudEvent event);
}
