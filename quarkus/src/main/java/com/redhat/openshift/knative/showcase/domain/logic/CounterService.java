package com.redhat.openshift.knative.showcase.domain.logic;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
class CounterService {

  private int number = 0;

  synchronized int getNumber() {
    number++;
    return number;
  }
}
