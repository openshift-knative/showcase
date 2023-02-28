package com.redhat.openshift.knative.showcase.hello;

interface Notifier {
  void notifyFor(Hello hello);
}
