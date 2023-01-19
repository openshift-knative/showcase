package com.redhat.openshift.knative.showcase.config;

import java.util.Optional;

public interface DelayConfiguration {
  Optional<Long> delayInMillis();
}
