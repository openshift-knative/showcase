package com.redhat.openshift.knative.showcase.domain.logic;

import io.cloudevents.CloudEvent;

interface EventSender {
  void send(CloudEvent ce);
}
