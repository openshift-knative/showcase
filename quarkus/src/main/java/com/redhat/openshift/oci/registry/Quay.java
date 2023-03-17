package com.redhat.openshift.oci.registry;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(baseUri = "https://quay.io")
public interface Quay extends ContainerRegistry {

  default String service() {
    return "quay.io";
  }
}
