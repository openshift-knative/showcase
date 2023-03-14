# Knative Showcase

The apps in this repository are used to showcase basics of Knative Serving 
and Eventing. The same features are implemented both in Quarkus and 
Express.JS frameworks.

## Features

The features below are there for two basic reasons. First reason is to showcase
some of the features of the Knative (like scaling, traffic shaping, or event
sending and receiving). The other group is to showcase some basic features
almost every production ready application deployed on Kubernetes should have.
The non-functional features were added, so the apps be close to the real world 
apps, and could serve as a reference for developers.

### Knative related features

* [x] Supports the `PORT` env

  ```bash
  PORT=3456
  # start the app... 
  http :$PORT
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
  events if they come.

  ```bash
  kn event send --field a.b=true --to-url http://localhost:8080/events
  ```
  You can send events to the app, by `POST /events` endpoint. Those events will
  be stored in ephemeral im-memory storage and send to the listening clients.

### Openshift Serverless related features

* [x] `/` home page ready for Web, and CLI

  ```bash
  http :8080 user-agent:Mozilla/5.0
  # returns a React app when called from Browser,
  # together with browser for captured CloudEvents

  http :8080
  # returns a JSON with app's coordinates when called from command line
  ```  

### Supporting features

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

We've prepared two backend implementations of the above feature. First one is 
implemented in Red Hat build of Quarkus framework and live in the `quarkus`
directory. The second backend has been implemented in Express.JS, runs on Node,
and lives in `expressjs` directory. Both of those backend are using single 
frontend, written in React framework, in Typescript.

```
├── quarkus/     # Quarkus backend
├── expressjs/   # Express.JS backend
├── frontend/    # React frontend
└── Makefile     # Main make file
```

The frontend application builds static Web files. They are packaged as
[Webjar](https://www.webjars.org/documentation) in the user's Maven repository
(`~/.m2/repository`). Thanks to that the Quarkus application is able to use
those static files directly. The express backend needs to extract those webjar
files.
