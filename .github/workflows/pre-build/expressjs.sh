#!/usr/bin/env bash

set -Eeuxo pipefail

npm install
npm run build:prepare
npm cache clean --force
rm -rf node_modules
