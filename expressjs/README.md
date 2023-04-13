# Knative Showcase for JS

This project uses Express.JS framework to showcase the Knative features.

## Prerequisites

This application requires the React frontend application webjar to be built and 
deployed to a local maven repository. To do it, run the following command from
the root of the project:

```shell
make frontend
```

Also, as for every *npm* module you should install deps, before starting or
testing the app:

```shell
npm install
```

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell
npm start
```

## Testing

To run tests, in watch mode, run:

```shell
npm test
```

## Packaging and running the application

The application can be build with:

```shell
npm run build
```

and can be packaged as OCI image using:

```shell
npm run build:image
```

## Learning

If you want to learn more about Express.JS, please visit its website: https://expressjs.com/.
