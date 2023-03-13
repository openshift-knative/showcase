ARG UBI_VERSION=8
ARG NODEJS_VERSION=16
ARG CONTEXT_DIR=./
ARG APP_VERSION=latest

FROM localhost/openshift-knative/frontend:${APP_VERSION} as frontend

FROM registry.access.redhat.com/ubi${UBI_VERSION}/nodejs-${NODEJS_VERSION} as builder
ARG CONTEXT_DIR=./

ENV HOME=/opt/app-root \
  APP_ROOT=/opt/app-root/src \
  FORCE_COLOR=true
ENV NPM_CONFIG_PREFIX=$HOME/.npm-global \
  PATH=$HOME/node_modules/.bin/:$HOME/.npm-global/bin/:$PATH

COPY --from=frontend \
  /opt/app-root/.m2/repository/com/redhat/openshift/knative/showcase \
  /opt/app-root/.m2/repository/com/redhat/openshift/knative/showcase
COPY --chown=1001 $CONTEXT_DIR $APP_ROOT/expressjs
COPY --chown=1001 $CONTEXT_DIR/../.git $APP_ROOT/.git
WORKDIR $APP_ROOT/expressjs
RUN npm clean-install
RUN npm run build:prepare
