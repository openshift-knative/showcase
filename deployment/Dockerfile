FROM registry.access.redhat.com/ubi8/nodejs-12

ADD ./ /opt/app-root/src
WORKDIR /opt/app-root/src
RUN npm ci --only=production
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
