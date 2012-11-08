var fs = require("fs");
var logger = require("./logger");

var config = {};
config["bindAddr"] = "127.0.0.1";
config["localPort"] = 53;
config["remotePort"] = 53;
config["remoteAddr"] = "130.39.177.1";
config["debug"] = false;

var content, settings;

try {
   content = fs.readFileSync("settings.json", "UTF-8");
   settings = JSON.parse(content);
} catch (err) {
  logger.error(err);
}

if (settings) {
  for (var p in config) {
    if (settings[p] != null) {
      config[p] = settings[p];
    }
  }
}

module.exports = config;