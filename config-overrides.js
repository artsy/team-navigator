const {
  rewireWebpack: rewireTypescript,
  rewireJest: rewireTypescriptJest,
} = require("react-app-rewire-typescript-babel-preset")
console.log("OK")
module.exports = {
  webpack: function(config, env) {
    return rewireTypescript(config)
  },
  jest: function(config) {
    return rewireTypescriptJest(config)
  },
}
