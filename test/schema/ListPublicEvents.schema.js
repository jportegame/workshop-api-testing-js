const listPublicEventsSchema = {
  title: 'list public events schema v1',
  type: 'object',
  required: [],
  properties: {
    status: {
      type: 'number'
    },
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          type: {
            type: 'string'
          },
          actor: {
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              login: {
                type: 'string'
              },
              display_login: {
                type: 'string'
              },
              gravatar_id: {
                type: 'string'
              },
              url: {
                type: 'string'
              },
              avatar_url: {
                type: 'string'
              }
            }
          },
          repo: {
            type: 'object',
            properties: {
              id: {
                type: 'integer'
              },
              name: {
                type: 'string'
              },
              url: {
                type: 'string'
              }
            }
          },
          payload: {
            type: 'object',
            properties: {
              push_id: {
                type: 'integer'
              },
              size: {
                type: 'integer'
              },
              distinct_size: {
                type: 'integer'
              },
              ref: {
                type: ['null', 'string']
              },
              head: {
                type: ['null', 'string']
              },
              before: {
                type: ['null', 'string']
              },
              commits: {
                type: 'array'
              }
            }
          },
          public: {
            type: 'boolean'
          },
          created_at: {
            type: 'string'
          }
        }
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
