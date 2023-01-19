# Knative Showcase for JS

## TODO

### Required

* [x] `/`

  ```bash
  http :21111
  http options :21111
  ```

* [x] `/hello`

  ```bash
  http :21111/hello
  ```

* [x] cloudevents

  ```bash
  http :21111/hello
  ```

* [x] `DELAY` parameter (in msec) for `/hello`
* [x] Containerfile to build as Knative app

### Nice to have

* [x] readyness and liveness probes

  ```bash
  http :21111/health/ready
  http :21111/health/live
  ```

* [x] Prometeus metrics

  ```bash
  http :21111/metrics
  ```

* [x] OpenAPI & Swagger UI

  ```bash
  http :21111/openapi.json
  http :21111/swagger-ui
  ```
* [x] Input validation (validation by OpenAPI schema)
* [ ] OpenTracing & OpenTelemetry & Distributed Tracing
