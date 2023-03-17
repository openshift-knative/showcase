package com.redhat.openshift.wasm.c;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

public class CString {
  private final byte[] bytes;

  public CString(byte[] bytes) {
    this.bytes = bytes;
  }

  public CString(String string) {
    this.bytes = string.getBytes(StandardCharsets.UTF_8);
  }

  public static CString from(ByteBuffer buffer, int offset) {
    var bb = ByteBuffer.allocate(1024);
    buffer.position(offset);
    byte b;
    while ((b = buffer.get(offset)) != 0) {
      bb.put(b);
      offset++;
    }
    return new CString(bb.array());
  }

  public void writeOn(ByteBuffer buffer, int offset) {
    buffer.position(offset);
    buffer.put(bytes);
    buffer.put((byte) 0);
  }

  @Override
  public String toString() {
    return new String(bytes, StandardCharsets.UTF_8);
  }
}
