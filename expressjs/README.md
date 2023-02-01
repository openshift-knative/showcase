# Knative Showcase for JS

## TODO

### Required

* [x] `/`

  ```bash
  http :8080
  http options :8080
  http :8080 user-agent:Mozilla/5.0
  ```

* [x] `/hello`

  ```bash
  http :8080/hello
  ```

* [x] cloudevents

  ```bash
  http :8080/hello
  ```

* [x] `DELAY` parameter (in msec) for `/hello`
* [x] Containerfile to build as Knative app

### Nice to have

* [x] readyness and liveness probes

  ```bash
  http :8080/health/ready
  http :8080/health/live
  ```

* [x] Prometeus metrics

  ```bash
  http :8080/metrics
  ```

* [x] OpenAPI & Swagger UI

  ```bash
  http :8080/openapi.json
  http :8080/swagger-ui
  ```
* [x] Input validation (validation by OpenAPI schema)
* [ ] OpenTracing & OpenTelemetry & Distributed Tracing
