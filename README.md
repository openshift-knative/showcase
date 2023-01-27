# Knative Showcase

The apps in this repository are used to showcase basics of Knative Serving 
and Eventing. The same features are implemented both in Quarkus and 
Express.JS frameworks.

## Features

* [x] Supports the `PORT` env

  ```bash
  PORT=3456
  # start the app... 
  http :$PORT
  ```

* [x] `/`

  ```bash
  http :21111 user-agent:Mozilla/5.0
  # returns a nice hello page when called from Browser

  http :21111
  # returns a JSON with app's coordinates when called from command line

  http options :21111
  # returns a JSON with app's coordinates
  ```  

* [x] `/hello`

  ```bash
  http :21111/hello
  ```

  Returns a hello JSON (sequenced), and sends Cloud Event to `K_SINK` target. A
  operational delay can be enforced by using `DELAY` (in msec) environmental
  variable.

* [x] K8s readyness and liveness probes

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
* [ ] Distributed Tracing
