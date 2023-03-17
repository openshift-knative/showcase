package com.redhat.openshift.oci.registry;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response.Status;
import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

@ApplicationScoped
public class WasmDownloader {

  private static final Logger LOGGER = LoggerFactory.getLogger(WasmDownloader.class);

  public static final String WASM_MEDIA_TYPE = "application/vnd.wasm.content.layer.v1+wasm";
  private final Quay quay;

  @Inject
  WasmDownloader(@RestClient Quay quay) {
    this.quay = quay;
  }

  public Path computeDownloadPath(Repository repository, Target target) {
    return target.path.resolve(
      repository.name.replace('/', '-') + ".wasm");
  }

  public void download(Repository repository, Path target) {
    LOGGER.debug("Downloading quay.io/{} to {}", repository, target);
    Authorization auth = null;
    //noinspection EmptyTryBlock
    try (var ignored = quay.checkVersion()) {
      // noop
    } catch (WebApplicationException e) {
      if (e.getResponse().getStatusInfo().toEnum() == Status.UNAUTHORIZED) {
        auth = quay.authorize(new Scope(repository.name, "pull"));
      } else {
        throw e;
      }
    }
    var token = auth != null ? auth.toString() : null;
    // TODO: remove the split when @Encoded is supported in Quarkus Reactive REST Client
    var repoCoords = repository.name.split("/", 2);
    assert repoCoords.length == 2;
    var manifest = quay.getManifest(repoCoords[0], repoCoords[1], repository.version, token);
    assert manifest.layers.size() == 1;
    var layer = manifest.layers.get(0);
    assert Objects.equals(layer.mediaType, WASM_MEDIA_TYPE);
    HttpClient client = HttpClient.newBuilder()
      .followRedirects(HttpClient.Redirect.ALWAYS)
      .build();

    var req = quay.getDigestContentRequest(repository.name, layer.digest, token)
      .build();
    try {
      Files.createDirectories(target.getParent());
      var res = client.send(req, BodyHandlers.ofFile(target));
      var status = Status.fromStatusCode(res.statusCode());
      if (status.getFamily() != Status.Family.SUCCESSFUL) {
        throw new IllegalStateException("Unexpected status code: " + res.statusCode());
      }
      var actualSize = Files.size(target);
      if (actualSize != layer.size) {
        Files.delete(target);
        throw new IllegalStateException("Unexpected file size: " + actualSize);
      }
      LOGGER.debug("Successfully downloaded quay.io/{}", repository);
    } catch (IOException e) {
      throw new IllegalStateException(e);
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException(e);
    }
  }

  public static final class Repository {
    public final String name;
    public final String version;

    public Repository(String name) {
      this(name, "latest");
    }

    public Repository(String name, String version) {
      this.name = name;
      this.version = version;
    }

    @Override
    public String toString() {
      if (version.startsWith("sha256")) {
        return name + "@" + version;
      }
      return name + ":" + version;
    }
  }

  public static final class Target {
    public final Path path;

    public Target(Path path) {
      this.path = path;
    }
  }
}
