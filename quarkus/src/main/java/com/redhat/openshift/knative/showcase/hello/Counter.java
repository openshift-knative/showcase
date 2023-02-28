package com.redhat.openshift.knative.showcase.hello;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
class Counter {

  private int number = 0;

  synchronized int getNumber() {
    number++;
    return number;
  }
}
