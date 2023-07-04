package com.redhat.openshift.knative.showcase.events;

import com.fasterxml.jackson.core.util.DefaultPrettyPrinter;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cloudevents.CloudEvent;
import io.cloudevents.jackson.JsonFormat;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.io.Serializable;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@ApplicationScoped
class Presenter {

  private static final int INDENT_SIZE = 2;
  private final ObjectMapper mapper;

  @Inject
  Presenter(ObjectMapper mapper) {
    this.mapper = mapper;
  }

  byte[] asJson(CloudEvent ce) {
    var serializer = new JsonFormat();
    return serializer.serialize(ce);
  }

  CharSequence asHumanReadable(CloudEvent ce) {
    try {
      var buf = new StringBuilder("☁️  cloudevents.Event\n");
      buf.append("Validation: valid\n");
      buf.append(printAttr(attributes(ce)));
      buf.append(printExts(ce));
      buf.append(printData(ce));
      return buf;
    } catch (IOException e) {
      throw new UncheckedIOException(e);
    }
  }

  private Map<String, Serializable> attributes(CloudEvent ce) {
    return ce.getAttributeNames()
      .stream()
      .map(name -> Map.entry(name, (Serializable) Objects.requireNonNull(ce.getAttribute(name))))
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private CharSequence printAttr(Map<String, Serializable> attr) {
    var buf = new StringBuilder();
    if (!attr.isEmpty()) {
      buf.append("Context Attributes,\n");
      attr.forEach((key, value) ->
        buf.append(String.format("  %s: %s%n", key, value)));
    }
    return buf;
  }

  private CharSequence printExts(CloudEvent ce) {
    var buf = new StringBuilder();
    var exts = extensions(ce);
    if (!exts.isEmpty()) {
      buf.append("Extensions,\n");
      exts.forEach((key, value) ->
        buf.append(String.format("  %s: %s%n", key, value)));
    }
    return buf;
  }

  private Map<String, Serializable> extensions(CloudEvent ce) {
    return ce.getExtensionNames()
      .stream()
      .map(name -> Map.entry(name, (Serializable) Objects.requireNonNull(ce.getExtension(name))))
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private CharSequence printData(CloudEvent ce) throws IOException {
    var buf = new StringBuilder();
    var data = ce.getData();
    if (data != null) {
      buf.append("Data,\n");
      var contentType = ce.getDataContentType();

      if ("application/json".equals(contentType)) {
        var json = mapper.readValue(data.toBytes(), Object.class);
        var writer = mapper.writer(new DefaultPrettyPrinter());
        var repr = writer.writeValueAsString(json)
          .indent(INDENT_SIZE)
          .replace("\" : ", "\": ");
        buf.append(repr).append("\n");
        return buf;
      }
      var repr = data.toString();
      var types = List.of("text", "xml", "html", "csv", "json", "yaml");
      if (contentType == null || types.stream().anyMatch(contentType::contains)) {
        repr = new String(data.toBytes(), StandardCharsets.UTF_8);
      }
      buf.append(repr.indent(INDENT_SIZE)).append("\n");
      return buf;
    }
    return buf;
  }
}
