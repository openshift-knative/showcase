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
  http :8080 user-agent:Mozilla/5.0
  # returns a React app when called from Browser,
  # together with browser for captured CloudEvents

  http :8080
  # returns a JSON with app's coordinates when called from command line
  ```  

* [x] `/hello`

  ```bash
  http :8080/hello
  ```

  Returns a hello JSON (sequenced), and sends Cloud Event to `K_SINK` target. A
  operational delay can be enforced by using `DELAY` (in msec) environmental
  variable.

* [x] `/events`
  
  ```bash
  http :8080/events
  ```
  Returns a stream of Server-Sent Events, where each event is a CloudEvent 
  represented in structured JSON format. This stream will continue to send next
  events if they came.

  ```bash
  kn event send --field a.b=true --to-url http://localhost:8080/events
  ```
  You can send events to the app, by `POST /events` endpoint. Those events will
  be stored in ephemeral im-memory storage and send to the listening clients.

* [x] K8s readyness and liveness probes

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
* [ ] Distributed Tracing

## Architecture

We've prepared two backend implementations 
