FROM ghcr.io/graalvm/native-image:ol9-java17

RUN mkdir -p /project && chown 1001:1001 /project
USER 1001
WORKDIR /project
# tag as quay.io/cardil/quarkus/graalvm/native-image:ol9-java17
