package com.redhat.openshift.knative.showcase.hello;

import io.cloudevents.CloudEvent;

interface EventSender {
  void send(CloudEvent ce);
}
