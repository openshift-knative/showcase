package com.redhat.openshift.knative.showcase.index;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redhat.openshift.knative.showcase.config.Config;
import com.redhat.openshift.knative.showcase.config.Project;
import io.quarkus.qute.Location;
import io.quarkus.qute.Template;
import pl.wavesoftware.eid.utils.EidExecutions;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@ApplicationScoped
class Presenter {
  private final Template index;
  private final Project project;
  private final Config config;
  private final ObjectMapper jackson;

  @Inject
  Presenter(
    @Location("index.html") Template index,
    Project project,
    Config config,
    ObjectMapper jackson
  ) {
    this.index = index;
    this.project = project;
    this.config = config;
    this.jackson = jackson;
  }

  Response.ResponseBuilder asJson() {
    return withHeaders(Response
      .ok(project, MediaType.APPLICATION_JSON_TYPE)
      .entity(index()));
  }

  Response.ResponseBuilder asHtml() {
    var body = index
      .data("project", project)
      .data("config", config)
      .render();
    return withHeaders(Response.ok(body, MediaType.TEXT_HTML_TYPE));
  }

  Index index() {
    return Index.from(project, config);
  }

  private Response.ResponseBuilder withHeaders(Response.ResponseBuilder builder) {
    return builder
      .header("Server", project.platform())
      .header("X-Version", project.version())
      .header("X-Config", configAsJson());
  }

  private String configAsJson() {
    return EidExecutions.tryToExecute(this::configAsJsonUnsafe, "20230228:144911");
  }

  private String configAsJsonUnsafe() throws JsonProcessingException {
    return jackson.writeValueAsString(Config.from(config));
  }
}
