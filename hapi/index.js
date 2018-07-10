'use strict';

const Hapi=require('hapi');

// Create a server with a host and port
const server = Hapi.server({
  cache: {
    engine: require('catbox-memory'),
    name: 'memory'
  },
  host:'localhost',
  port:8000
});

// Add the route
server.route({
  method:'GET',
  path: '/',
  handler: async (request, h) => {
    return 'hello world';
  }
});

server.route({
  method:'GET',
  path: '/test',
  config: {
    plugins: {
      'hapi-rate-limit': {
        pathLimit: 2,
        pathCache: {
          expiresIn: 60 * 1000 // 1 min
        }
      }
    },
    handler: async (request, h) => {
      return 'Testing page';
    }
  }
});

// Start the server
const init = async () => {
  await server.register({
    plugin: require('hapi-rate-limit'),
    options: {}
  });
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
