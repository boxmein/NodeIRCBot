_ = {};
// Output module
// Performs various console output/logging features
// * Colours
// * Logging types
// * Check if some logging is allowed
var output = {
  
  
  init: function(underscore) {
    _ = underscore;
    _.output.log("", "Initialized output.js");
  },

  // General log messages
  log: function(sender, message) {
    if (typeof message !== "string") 
      message = ""+message;


    if(_.config.loglevel & l.LOGGING) 
      console.log(
        "\033[0;1m" + 
        "[LL] " + sender + ": " + 
        message.trim() + 
        "\033[0m");
  },

  // Errors. Close to fatal.
  err: function(sender, message) {
    if (typeof message !== "string") 
      message = ""+message;

    if (_.config.loglevel & l.ERRORS)
      console.log("\033[31;1m" + 
        "[EE] " + sender + ": " + 
        message.trim() + 
        "\033[0m");
  },

  // General output, used by sent raw data
  out: function(sender, message) {
    if (typeof message !== "string") 
      message = ""+message;


    if(_.config.loglevel & l.RAW_DATA) 
      console.log("\033[0;1m" + 
        "[>>] " + sender + ": " + 
        message.trim() + "\033[0m");
  },

  // General input, used by receive message
  inn: function(message) {
    if (typeof message !== "string") 
      message = ""+message;


    if(_.config.loglevel & l.RAW_DATA) 
      console.log("[<<] " + message.trim() + 
        "\033[0m");
  },

  // I dunno lol. Bypasses all logging messages. Use with caution.
  announce: function(message) {
    if (typeof message !== "string") 
      message = ""+message; 


    console.log("[--] --- " + message.trim() + " ---");
  },

  // Text logging format
  chanmsg: function(ircdata) {
    if (_.config.loglevel & l.TEXT_LOGS) 
      console.log("\033[37;1m" + 
        "[##]<{0}/{1}> {2}".format(
          ircdata.sender, 
          ircdata.channel, 
          ircdata.message) + 
        "\033[0m");
  },

  // General alert. Non-fatal or effectless errors such as wrong command syntax.
  alert: function (message) {
    if (_.config.loglevel & l.ALERTS) // Suppresses alerts
      console.log("\033[33;1m" + 
        "[!!] " + message + 
        "\033[0m");
  }
};

module.exports = output;



// Log levels!
var l = {
  RAW_DATA: 1,        // Raw IRC      [<<]
  TEXT_LOGS: 2,       // Text logging [##] <nickname/#channel> text
  ALERTS: 4,          // Alerts       [!!]
  LOGS: 8,            // Logging      [LL]
  ERRORS: 16          // Errors       [EE]
};