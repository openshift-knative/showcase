# Knative Showcase

The Knative Showcase is a collection of apps designed to showcase the fundamental concepts and features of Knative Serving and Eventing. By using two different frameworks, Quarkus and Express.JS, the Showcase allows developers to see how these concepts can be implemented in different environments. Whether you're a beginner learning the basics or an experienced developer looking to dive deeper into Knative, the Showcase is an excellent resource for exploring the platform's capabilities.

## Features

The Knative Showcase includes a variety of features that serve two primary purposes. First, they demonstrate some of the key capabilities of Knative, such as scaling, traffic shaping, and event sending and receiving. By showcasing these features in action, developers can better understand how Knative works and how it can be used to build powerful, cloud-native applications.

In addition to highlighting Knative's functionality, the Showcase also incorporates several essential features that are critical for most production-ready applications deployed on Kubernetes. These features include support for environmental variables, health checks, and distributed tracing. By integrating these features into the Showcase, the apps closely resemble real-world applications and can serve as a valuable reference for developers looking to build their own Kubernetes-based applications.

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

The /hello endpoint returns a JSON response with a greeting message. Additionally, this endpoint sends a Cloud Event to the `K_SINK` target, allowing other applications to consume the event and take further action.

To add an operational delay to the /hello endpoint, you can use the `DELAY` environmental variable. By setting this variable to a value in milliseconds, you can simulate a delay in the response time, which can be useful for testing how your application responds to slower requests. Overall, the /hello endpoint demonstrates the ability of Knative to handle incoming requests, generate responses, and trigger other actions based on events.

* [x] `/events`
  
  ```bash
  http :8080/events
  ```

One of the features of the Knative implementation in this repository is that it returns a stream of Server-Sent Events (SSE) in response to a GET request to the /events endpoint. Each event in the stream is represented as a CloudEvent in structured JSON format. This stream is designed to continue sending the next event in the sequence as long as it is available.
 
  ```bash
  kn event send --field a.b=true --to-url http://localhost:8080/events
  ```

This feature allows sending events to the application through the POST /events endpoint. These events will be temporarily stored in memory and sent to the clients that are listening to the stream of Server-Sent Events mentioned earlier.

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

This repository contains two backend implementations of the Knative showcase features. The first implementation is built with the Red Hat build of the Quarkus framework and is located in the `quarkus` directory. The second implementation is based on Express.JS, runs on Node.js, and can be found in the `expressjs` directory. Both backends use the same React frontend, which is written in TypeScript.

Using two different frameworks for the backends allows developers to compare and contrast how the same features can be implemented in different environments. By exploring the two implementations side-by-side, developers can gain a deeper understanding of the strengths and weaknesses of each framework and how they might best suit their needs. Additionally, having a shared frontend written in a popular language like TypeScript makes it easier to compare the features of the two backends and focus on what sets them apart.

```
├── quarkus/     # Quarkus backend
├── expressjs/   # Express.JS backend
├── frontend/    # React frontend
└── Makefile     # Main make file
```

The frontend application in this repository builds static web files, which are then packaged as Webjars in the user's Maven repository located at `~/.m2/repository`. This approach enables the Quarkus backend to use the static files directly. On the other hand, the Express.js backend needs to extract the webjar files in order to use them.
