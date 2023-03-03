package com.redhat.openshift.knative.showcase.index;


import com.redhat.openshift.knative.showcase.support.Testing.Constants;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

@RegisterRestClient(baseUri = Constants.DEFAULT_TEST_URL)
interface Client extends Endpoint {
}
