package com.redhat.openshift.knative.showcase.events;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cloudevents.CloudEvent;

import javax.annotation.Nullable;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.Map;

/**
 * A workaround for
 * <a href="https://github.com/quarkusio/quarkus/issues/31587">quarkusio/quarkus#31587</a>
 * and <a href="https://github.com/cloudevents/sdk-java/issues/533">cloudevents/sdk-java#533</a>.
 *
 * TODO: Remove this class once the above issues is fixed.
 */
class Event {
  @JsonProperty
  String id;
  @JsonProperty
  String source;
  @JsonProperty
  String type;
  @JsonProperty("specversion")
  String specVersion;
  @JsonProperty("datacontenttype")
  String dataContentType;
  @JsonProperty
  Map<String, Object> data;

  static Event from(CloudEvent event, ObjectMapper om) {
    var e = new Event();
    e.id = event.getId();
    e.source = event.getSource().toString();
    e.type = event.getType();
    e.specVersion = event.getSpecVersion().toString();
    e.dataContentType = event.getDataContentType();
    e.data = dataToMap(event, om);
    return e;
  }

  @Nullable
  private static Map<String, Object> dataToMap(CloudEvent event, ObjectMapper om) {
    var data = event.getData();
    if (data == null) {
      return null;
    }
    var mt = MediaType.valueOf(event.getDataContentType());
    if (mt.isCompatible(MediaType.APPLICATION_JSON_TYPE)) {
      try {
        return om.readValue(data.toBytes(), Map.class);
      } catch (IOException e) {
        throw new IllegalArgumentException(e);
      }
    }
    throw new IllegalArgumentException("Unsupported media type: " + mt);
  }

}
