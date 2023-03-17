package com.redhat.openshift.knative.showcase.events;

import com.redhat.openshift.oci.registry.ContainerRegistry;
import com.redhat.openshift.oci.registry.WasmDownloader;
import com.redhat.openshift.wasm.c.CString;
import io.github.kawamuray.wasmtime.Engine;
import io.github.kawamuray.wasmtime.Func;
import io.github.kawamuray.wasmtime.Linker;
import io.github.kawamuray.wasmtime.Memory;
import io.github.kawamuray.wasmtime.Module;
import io.github.kawamuray.wasmtime.Store;
import io.github.kawamuray.wasmtime.Val;
import io.github.kawamuray.wasmtime.wasi.WasiCtx;
import io.github.kawamuray.wasmtime.wasi.WasiCtxBuilder;

import java.nio.file.Files;
import java.nio.file.Path;

class PrettyPrintWasm implements AutoCloseable {
  public static final String MODULE_NAME = "wasm";
  private final WasiCtx wasi;
  private final Store<Void> store;
  private final Linker linker;
  private final Engine engine;
  private final WasmDownloader downloader;

  PrettyPrintWasm(WasmDownloader downloader) {
    this.downloader = downloader;
    this.wasi = new WasiCtxBuilder()
      .inheritStdout()
      .inheritStderr()
      .inheritEnv()
      .build();
    this.store = Store.withoutData(wasi);
    this.engine = store.engine();
    this.linker = new Linker(this.engine);
    WasiCtx.addToLinker(linker);
  }

  CString execute(CString input) {
    Path wasm = ensureWasmModuleIsDownloaded();
    try (var module = Module.fromFile(engine, wasm.toString())) {
      if (!linker.modules(store).contains(MODULE_NAME)) {
        linker.module(store, MODULE_NAME, module);
      }
      try(var mem = linker.get(store, MODULE_NAME, "memory").orElseThrow().memory()) {
        return executeOnSharedMemory(input, mem);
      }
    }
  }

  private CString executeOnSharedMemory(CString input, Memory mem) {
    var buf = mem.buffer(store);
    var offset = 0;
    input.writeOn(buf, offset);
    try (Func ppPrint = linker.get(store, MODULE_NAME, "pp_print").orElseThrow().func()) {
      var inputPtr = Val.fromI32(offset);
      var results = ppPrint.call(store, inputPtr);
      assert results.length == 1;
      var result = results[0].i32();
      if (result != 0) {
        throw new IllegalArgumentException("pp_print returned " + result);
      }
      return CString.from(buf, offset);
    }
  }

  private Path ensureWasmModuleIsDownloaded() {
    var repo = new WasmDownloader.Repository("cardil/cloudevents-pretty-print");
    var target = new WasmDownloader.Target(Path.of(
      System.getProperty("java.io.tmpdir"), ContainerRegistry.USER_AGENT
    ));
    var wasm = downloader.computeDownloadPath(repo, target);
    if (!Files.exists(wasm)) {
      downloader.download(repo, wasm);
    }
    return wasm;
  }

  @Override
  public void close() {
    linker.close();
    engine.close();
    store.close();
    wasi.close();
  }
}
