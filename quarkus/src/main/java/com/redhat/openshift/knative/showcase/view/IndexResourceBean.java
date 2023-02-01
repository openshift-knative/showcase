package com.redhat.openshift.knative.showcase.view;

import com.redhat.openshift.knative.showcase.config.EventsConfiguration;
import com.redhat.openshift.knative.showcase.config.ProjectInfo;
import com.redhat.openshift.knative.showcase.domain.entity.Project;
import io.quarkus.qute.Location;
import io.quarkus.qute.Template;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@ApplicationScoped
@Path("")
public class IndexResourceBean implements IndexResource {
  private final Template index;
  private final ProjectInfo projectInfo;
  private final EventsConfiguration eventsConfiguration;
  private final IndexMode indexMode;

  @Inject
  IndexResourceBean(
    @Location("index.html") Template index,
    ProjectInfo projectInfo,
    EventsConfiguration eventsConfiguration,
    IndexMode indexMode
  ) {
    this.index = index;
    this.projectInfo = projectInfo;
    this.indexMode = indexMode;
    this.eventsConfiguration = eventsConfiguration;
  }

  @Override
  public Response index() {
    if (indexMode.isJson()) {
      return Response
        .ok(projectInfo, MediaType.APPLICATION_JSON_TYPE)
        .entity(project())
        .build();
    }
    var body = index
      .data("project", Project.from(projectInfo))
      .data("config", eventsConfiguration)
      .render();
    return Response.ok(body, MediaType.TEXT_HTML_TYPE).build();
  }

  @Override
  public Project project() {
    return Project.from(projectInfo);
  }

}
