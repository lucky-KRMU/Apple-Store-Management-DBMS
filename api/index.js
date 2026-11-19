const app = require('../backend/server.js');

module.exports = (req, res) => {
  // Normalize req.url so that any route without /api prefix still hits the Express /api router
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};

