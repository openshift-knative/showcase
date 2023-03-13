ARG UBI_VERSION=8
ARG MANDREL_VERSION=22
ARG CONTEXT_DIR=./
ARG APP_VERSION=latest

FROM localhost/openshift-knative/frontend:${APP_VERSION} as frontend

FROM registry.access.redhat.com/quarkus/mandrel-${MANDREL_VERSION}-rhel${UBI_VERSION} as builder
ARG CONTEXT_DIR=./

ENV HOME=/home/quarkus

COPY --from=frontend \
  --chown=quarkus \
  /opt/app-root/.m2/repository/com/redhat/openshift/knative/showcase \
  $HOME/.m2/repository/com/redhat/openshift/knative/showcase
ADD --chown=quarkus $CONTEXT_DIR $HOME/project/quarkus
ADD --chown=quarkus $CONTEXT_DIR/../.git $HOME/project/.git
WORKDIR $HOME/project/quarkus
ENV FORCE_COLOR=true

RUN ./mvnw -V -B --no-transfer-progress -Dstyle.color=always -Dmaven.artifact.threads=50 clean dependency:go-offline
RUN ./mvnw -V -B --no-transfer-progress -Dstyle.color=always -DskipTests package
