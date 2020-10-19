const serverStatus = require('express-server-status-minus-git')

module.exports = (app) => {
  app.use('/status', serverStatus(app))
}
