/*!
 * command module for development server
 * @autor pfleidi
 */


exports.description = 'Command to run the Development server';

exports.name = 'server';

exports.examples = [
  '--port 8080 --manifest',
  '-m --p 2342 --config config.json'
];

exports.options = {

  manifest: {
    'description': 'Start the server in manifest mode. Enable generation of cache.manifest',
    'default': false
  },

  config: {
    'description': 'Specify a custom config',
    'hasargument': true
  },

  directory: {
    'description': 'Specify a custom project directory',
    'default': '$PWD',
    'hasargument': true
  },

  port: {
    'description': 'Specify a custom port',
    'default': 8000,
    'hasargument': true
  }

};

exports.run = function run(params) {
  var Server = require('../server').Server;
  var server = new Server(params);

  server.run();
};
