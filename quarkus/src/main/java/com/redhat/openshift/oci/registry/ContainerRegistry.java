package com.redhat.openshift.oci.registry;

import org.eclipse.microprofile.rest.client.annotation.RegisterClientHeaders;

import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.net.URI;
import java.net.http.HttpRequest;
import java.util.Collections;

@RegisterClientHeaders(ContainerRegistry.ClientHeadersFactory.class)
public interface ContainerRegistry {

  String USER_AGENT = "OpenShift-OciRegistry/1.0";
  String API_VERSION = "registry/2.0";

  /**
   * TODO: replace the owner and repository parameters with a single repository
   *       name parameter, when the {@link javax.ws.rs.Encoded} annotation is
   *       supported by Quarkus Reactive REST Client.
   *
   * The currenct workaround is to split the repository name into owner and
   * repository name. This prevents the use of slashes in the repository name,
   * and now supported nested repository names.
   *
   * The parameter should have been annotated as follows:
   * <pre>
   * {@code @Encoded @PathParam("repository") String repository}
   * </pre>
   *
   * And the method call should have been annotated with:
   * <pre>
   * {@code @GET() @Path("/v2/{repository}/manifests/{reference}")}
   * </pre>
   */
  @GET()
  @Path("/v2/{owner}/{repository}/manifests/{reference}")
  Manifest getManifest(
    @PathParam("owner") String owner,
    @PathParam("repository") String repository,
    @PathParam("reference") String reference,
    @HeaderParam("Authorization") String token,
    @HeaderParam("Accept") String accept
  );

  default Manifest getManifest(String owner, String repository, String reference, String token) {
    return getManifest(owner, repository, reference, token,
      "application/vnd.oci.image.manifest.v1+json");
  }

  @GET()
  @Path("/v2/auth")
  Authorization authorize(
    @QueryParam("scope") String scope,
    @QueryParam("service") String service,
    @HeaderParam("Authorization") String token,
    @QueryParam("account") String account
  );

  default Authorization authorize(Scope scope, String service) {
    return authorize(scope.toString(), service, null, null);
  }

  default Authorization authorize(Scope scope) {
    return authorize(scope, service());
  }

  String service();

  @GET()
  @Path("/v2/")
  Response checkVersion(@HeaderParam("Authorization") String token);

  default Response checkVersion() {
    return checkVersion(null);
  }

  default HttpRequest.Builder getDigestContentRequest(
    String repository,
    String digest,
    String token
  ) {
    URI uri = URI.create(String.format(
      "https://%s/v2/%s/blobs/%s",
      service(), repository, digest
    ));
    var req = HttpRequest.newBuilder(uri);
    var chf = new ClientHeadersFactory();
    var outgoingHeaders = new MultivaluedHashMap<>(Collections.singletonMap(
      "Authorization", token
    ));
    var headers = chf.update(new MultivaluedHashMap<>(), outgoingHeaders);
    headers.forEach((k, v) -> v.forEach(h -> req.header(k, h)));
    return req;
  }

  class ClientHeadersFactory implements org.eclipse.microprofile.rest.client.ext.ClientHeadersFactory {
    @Override
    public MultivaluedMap<String, String> update(
      MultivaluedMap<String, String> incomingHeaders,
      MultivaluedMap<String, String> clientOutgoingHeaders
    ) {
      MultivaluedMap<String, String> headers = new MultivaluedHashMap<>();
      headers.putAll(incomingHeaders);
      headers.putAll(clientOutgoingHeaders);
      headers.putSingle("Docker-Distribution-API-Version", API_VERSION);
      headers.putSingle("User-Agent", USER_AGENT);
      return headers;
    }
  }
}
