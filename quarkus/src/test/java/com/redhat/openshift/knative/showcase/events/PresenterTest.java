package com.redhat.openshift.knative.showcase.events;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.cloudevents.core.builder.CloudEventBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import static org.junit.jupiter.api.Assertions.*;

class PresenterTest {
  private Presenter presenter;

  @BeforeEach
  void setup() {
    presenter = new Presenter(new ObjectMapper());
  }

  @Test
  void testAsHumanReadableWithNullTypeAndJson() {
    // Arrange
    String id = "123";
    String type = null;
    String data = "{\"msg\":\"Hello World!\"}";
    var ce = CloudEventBuilder.v1()
      .withId(id)
      .withSource(URI.create("http://localhost"))
      .withType("test")
      .withData(type, data.getBytes(StandardCharsets.UTF_8))
      .build();

    String expected = """
      ☁️  cloudevents.Event
      Validation: valid
      Context Attributes,
        specversion: 1.0
        id: 123
        source: http://localhost
        type: test
      Data,
        {"msg":"Hello World!"}
        
      """;
    // Act
    CharSequence actual = presenter.asHumanReadable(ce).toString();
    // Assert
    assertEquals(expected, actual);
  }

  @Test
  void testAsHumanReadableWithNullTypeAndBinary() {
    // Arrange
    String id = "123";
    String type = null;
    byte[] data={0xa, 0x2, (byte) 0xff};
    var ce = CloudEventBuilder.v1()
      .withId(id)
      .withSource(URI.create("http://localhost"))
      .withType("test")
      .withData(type, data)
      .build();

    byte[] expected = new byte[] {-30, -104, -127, -17, -72, -113, 32, 32, 99, 108, 111, 117, 100, 101, 118, 101, 110, 116, 115, 46, 69, 118, 101, 110, 116, 10, 86, 97, 108, 105, 100, 97, 116, 105, 111, 110, 58, 32, 118, 97, 108, 105, 100, 10, 67, 111, 110, 116, 101, 120, 116, 32, 65, 116, 116, 114, 105, 98, 117, 116, 101, 115, 44, 10, 32, 32, 115, 112, 101, 99, 118, 101, 114, 115, 105, 111, 110, 58, 32, 49, 46, 48, 10, 32, 32, 105, 100, 58, 32, 49, 50, 51, 10, 32, 32, 115, 111, 117, 114, 99, 101, 58, 32, 104, 116, 116, 112, 58, 47, 47, 108, 111, 99, 97, 108, 104, 111, 115, 116, 10, 32, 32, 116, 121, 112, 101, 58, 32, 116, 101, 115, 116, 10, 68, 97, 116, 97, 44, 10, 32, 32, 10, 32, 32, 2, -17, -65, -67, 10, 10};
    // Act
    byte[] actual = presenter.asHumanReadable(ce).toString().getBytes();
    // Assert
    assertArrayEquals(expected, actual);
  }
}
