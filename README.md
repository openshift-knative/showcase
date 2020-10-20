# Knative Serving Showcase for JS

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

* [ ] `DELAY` parameter (in msec) for `/hello`

### Nice to have

* [x] readyness and liveness probes

  ```bash
  http :21111/health/ready
  http :21111/health/live
  ```

* [x] metrics

  ```bash
  http :21111/metrics
  http :21111/status
  ```

* [ ] OpenAPI & Swagger UI
* [ ] opentracing & opentelemetry
* [ ] Input validation
