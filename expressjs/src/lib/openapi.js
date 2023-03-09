const openapi = require('@unleash/express-openapi')

const oapi = openapi({
  openapi: '3.0.0',
  info: {
    description: 'Knative Showcase for JS',
  },
  components: {
    schemas: {
      CloudEvent: {
        type: 'object',
        properties: {
          specVersion: {
            $ref: '#/components/schemas/SpecVersion'
          },
          id: {
            type: 'string'
          },
          type: {
            type: 'string'
          },
          source: {
            format: 'uri',
            type: 'string'
          },
          dataContentType: {
            type: 'string',
            example: 'application/json'
          },
          dataSchema: {
            format: 'uri',
            type: 'string'
          },
          subject: {
            type: 'string'
          },
          time: {
            $ref: '#/components/schemas/OffsetDateTime'
          },
          attributeNames: {
            uniqueItems: true,
            type: 'array',
            items: {
              type: 'string'
            }
          },
          extensionNames: {
            uniqueItems: true,
            type: 'array',
            items: {
              type: 'string'
            }
          },
          data: {
            type: 'object'
          }
        }
      },
      Hello: {
        type: 'object',
        properties: {
          greeting: {
            pattern: '^[A-Z][a-z]+$',
            type: 'string'
          },
          who: {
            pattern: '^[A-Z][a-z]+$',
            type: 'string'
          },
          number: {
            format: 'int32',
            minimum: 1,
            type: 'integer'
          }
        }
      },
      OffsetDateTime: {
        format: 'date-time',
        type: 'string',
        example: '2022-03-10T16:15:50.000Z'
      },
      SpecVersion: {
        enum: [
          '1.0',
          '0.3'
        ],
        type: 'string'
      }
    }
  }
})

module.exports = oapi
