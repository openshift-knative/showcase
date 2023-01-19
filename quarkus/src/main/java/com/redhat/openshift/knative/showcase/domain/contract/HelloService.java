package com.redhat.openshift.knative.showcase.domain.contract;

import com.redhat.openshift.knative.showcase.domain.entity.Hello;

public interface HelloService {
  Hello greet(String who);
}
