#!/usr/bin/env bash

set -Eeuxo pipefail

GITHUB_EVENT_NAME="${GITHUB_EVENT_NAME:?Missing event name}"

PLATFORMS=linux/amd64,linux/ppc64le,linux/s390x
VERSION=noop
if [ "${GITHUB_EVENT_NAME}" = "schedule" ]; then
  VERSION=nightly
elif [[ "$GITHUB_REF" == refs/tags/* ]]; then
  VERSION="${GITHUB_REF#refs/tags/}"
elif [[ "$GITHUB_REF" == refs/heads/* ]]; then
  VERSION="$(echo "${GITHUB_REF#refs/heads/}" | sed -r 's#/+#-#g')"
elif [[ "$GITHUB_REF" == refs/pull/* ]]; then
  VERSION="pr-${GITHUB_REF#refs/pull/}"
  VERSION="${VERSION%/*}"
fi
TAGS="${VERSION}"
if [ "${VERSION}" = 'master' ] || [ "${VERSION}" = 'main' ]; then
  TAGS="${TAGS} latest"
fi

{
  echo "version=${VERSION}"
  echo "tags=${TAGS}"
  echo "created=$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
  echo "platforms=${PLATFORMS}"
} >> "$GITHUB_OUTPUT"
