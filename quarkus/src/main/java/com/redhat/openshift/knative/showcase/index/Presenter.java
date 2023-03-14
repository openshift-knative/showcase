package com.redhat.openshift.knative.showcase.index;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redhat.openshift.knative.showcase.config.Config;
import com.redhat.openshift.knative.showcase.config.Project;
import pl.wavesoftware.eid.utils.EidExecutions;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Objects;

@ApplicationScoped
class Presenter {
  public static final String HOME_HTML = "/META-INF/resources/home.html";
  private final Project project;
  private final Config config;
  private final ObjectMapper jackson;

  @Inject
  Presenter(
    Project project,
    Config config,
    ObjectMapper jackson
  ) {
    this.project = project;
    this.config = config;
    this.jackson = jackson;
  }

  Response.ResponseBuilder asJson() {
    return withHeaders(
      Response.ok()
        .type(MediaType.APPLICATION_JSON_TYPE)
        .entity(index())
    );
  }

  Response.ResponseBuilder asHtml() {
    var html = Objects.requireNonNull(
      getClass().getResourceAsStream(HOME_HTML)
    );
    return withHeaders(
      Response.ok()
        .type(MediaType.TEXT_HTML_TYPE)
        .entity(html)
    );
  }

  Info info() {
    var i = new Info();
    i.project = project;
    i.config = config;
    return i;
  }

  private Index index() {
    return Index.from(project, Config.from(config));
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
