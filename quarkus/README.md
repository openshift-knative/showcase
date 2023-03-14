# Knative Showcase written in Quarkus

This project uses Quarkus, the Supersonic Subatomic Java Framework to showcase
the Knative features.

## Prerequisites

This application requires the React frontend application webjar to be built and 
deployed to a local maven repository. To do it, run the following command from
the root of the project:

```shell
make frontend
```

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```
./mvnw quarkus:dev
```

## Packaging and running the application

The application is packageable using `./mvnw package`.
It produces the executable `showcase-*-runner.jar` file in `/target` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/lib` directory.

The application is now runnable using `java -jar target/showcase-*-runner.jar`.

## Creating a native executable

You can create a native executable using: `./mvnw package -Pnative`.

You can then execute your binary: `./target/showcase-*-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/building-native-image-guide .

## Learning

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/.
