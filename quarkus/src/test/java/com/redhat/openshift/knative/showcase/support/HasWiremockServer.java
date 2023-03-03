package com.redhat.openshift.knative.showcase.support;

import com.github.tomakehurst.wiremock.WireMockServer;

public interface HasWiremockServer {
  void setWireMockServer(WireMockServer wireMockServer);
}
