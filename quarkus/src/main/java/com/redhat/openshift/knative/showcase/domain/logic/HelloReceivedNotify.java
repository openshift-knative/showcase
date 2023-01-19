package com.redhat.openshift.knative.showcase.domain.logic;

import com.redhat.openshift.knative.showcase.domain.entity.Hello;

interface HelloReceivedNotify {
  void notifyFor(Hello hello);
}
