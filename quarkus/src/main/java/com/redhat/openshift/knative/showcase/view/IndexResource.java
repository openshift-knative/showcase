package com.redhat.openshift.knative.showcase.view;

import com.redhat.openshift.knative.showcase.domain.entity.Project;
import org.eclipse.microprofile.openapi.annotations.Operation;

import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("")
public interface IndexResource {
    @GET
    @Produces({MediaType.TEXT_HTML, MediaType.APPLICATION_JSON})
    @Operation(summary = "Displays a index HTML page, or the project info in " +
      "JSON format if the Accept header is set to application/json or called " +
      "not from a browser")
    Response index();

    @OPTIONS
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
      summary = "Retrives info about project",
      description = "Information about project like maven coordinates and versions"
    )
    Project project();
}
