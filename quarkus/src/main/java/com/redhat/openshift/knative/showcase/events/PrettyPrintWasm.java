package com.redhat.openshift.knative.showcase.events;

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
import java.util.Objects;

class PrettyPrintWasm implements AutoCloseable {
  public static final String MODULE_NAME = "wasm";
  private final WasiCtx wasi;
  private final Store<Void> store;
  private final Linker linker;
  private final Engine engine;
  private final Path stderr;
  private Module module;

  PrettyPrintWasm() {
    this.stderr = Path.of(System.getProperty("java.io.tmpdir"),
      "cloudevents-pretty-print.stderr");
    this.wasi = new WasiCtxBuilder()
      .stderr(stderr)
      .build();
    this.store = Store.withoutData(wasi);
    this.engine = store.engine();
    this.linker = new Linker(this.engine);
    WasiCtx.addToLinker(linker);
  }

  CString execute(CString input) {
    loadWasmModule();
    try(var mem = linker.get(store, MODULE_NAME, "memory").orElseThrow().memory()) {
      return executeUsingSharedMemory(input, mem);
    }
  }

  private synchronized void loadWasmModule() {
    if (module != null) {
      return;
    }
    byte[] wasm = loadWasmBinary();
    module = Module.fromBinary(engine, wasm);
    if (!linker.modules(store).contains(MODULE_NAME)) {
      linker.module(store, MODULE_NAME, module);
    }
  }

  private byte[] loadWasmBinary() {
    try (var steam = PrettyPrintWasm.class.getResourceAsStream(
      "/META-INF/cloudevents-pretty-print.wasm")) {
      Objects.requireNonNull(steam,
        "cloudevents-pretty-print.wasm not found");
      return steam.readAllBytes();
    } catch (Exception ex) {
      throw new IllegalStateException(
        "Failed to load cloudevents-pretty-print.wasm", ex);
    }
  }

  private synchronized CString executeUsingSharedMemory(CString input, Memory mem) {
    var buf = mem.buffer(store);
    var offset = 0;
    input.writeOn(buf, offset);
    try (Func ppPrint = linker.get(store, MODULE_NAME, "pp_print").orElseThrow().func()) {
      var inputPtr = Val.fromI32(offset);
      var results = ppPrint.call(store, inputPtr);
      assert results.length == 1;
      var result = results[0].i32();
      if (result != 0) {
        String err = readStderr();
        throw new IllegalArgumentException(String.format(
          "pp_print(%d): %s%nce: %s", result, err, input
        ));
      }
      return CString.from(buf, offset);
    }
  }

  private String readStderr() {
    try {
      String err = Files.readString(stderr);
      Files.delete(stderr);
      return err;
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to read WASI stderr", ex);
    }
  }

  @Override
  public void close() {
    if (module != null) {
      module.close();
    }
    linker.close();
    engine.close();
    store.close();
    wasi.close();
  }
}
