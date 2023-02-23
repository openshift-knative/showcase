package com.redhat.openshift.knative.showcase.view;

import com.redhat.openshift.knative.showcase.domain.entity.Hello;
import org.eclipse.microprofile.openapi.annotations.Operation;

import javax.validation.constraints.Pattern;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

public interface HelloEndpoint {
  @GET
  @Operation(
    summary = "Basic hello operation",
    description = "Greeting can be changed by setting environment variable GREET"
  )
  @Path("hello")
  @Produces(MediaType.APPLICATION_JSON)
  Hello hello(
    @QueryParam("who")
    @DefaultValue("Person")
    @Pattern(regexp = "^[A-Z][a-z]+$")
      String who
  );
}
