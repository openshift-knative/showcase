package com.redhat.openshift.knative.showcase.events;

import com.redhat.openshift.oci.registry.WasmDownloader;
import com.redhat.openshift.wasm.c.CString;
import io.cloudevents.CloudEvent;
import io.cloudevents.jackson.JsonFormat;
import io.quarkus.runtime.ShutdownEvent;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

@ApplicationScoped
class Presenter {

  private final PrettyPrintWasm wasm;

  @Inject
  Presenter(WasmDownloader downloader) {
    this.wasm = new PrettyPrintWasm(downloader);
  }

  void onStop(@Observes ShutdownEvent ignored) {
    wasm.close();
  }

  byte[] toJson(CloudEvent ce) {
    var serializer = new JsonFormat();
    return serializer.serialize(ce);
  }

  String present(CloudEvent ce) {
    var json = toJson(ce);
    var input = new CString(json);
    var output = wasm.execute(input);
    return output.toString();
  }
}
