package com.redhat.openshift.knative.showcase.view;

import com.github.tomakehurst.wiremock.WireMockServer;

public interface HasWiremockServer {
  void setWireMockServer(WireMockServer wireMockServer);
}
