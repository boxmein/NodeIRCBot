
/*jshint node: true*/
var _ = {};
module.exports = {
  helptext: "stm <text> - sends text to mniip's xsbot", 
  enable: 1,
  getHelp: function() { return this.helptext; },
  // Return anything but false when something went wrong
  init: function(underscore) { 
    _ = underscore; 
    console.log("Initialised sendtoxsbot.js");
  },
  exec: function(ircdata) {
    _.output.log("commands:sendtoxsbot", "Starting HTTP request");
    var message = ircdata.args.join(" ") || false;
    if (!message) 
      throw "No message input";
    _.http.request({
      hostname: "mniip.com", 
      path: "/lua/bot.lua?msg=" + encodeURIComponent(message), 
      headers: {
        "User-Agent": "boxnode@" + ircdata.channel,
        "X-Powered-By": "lolcats"
      }
    }, function(response) {
      _.output.log("commands:sendtoxsbot", "Response status: " + response.statusCode);
      response.on("error", function(evt) {
        _.output.err("commands.sendtomniip", evt.message);
      });
    }).end();
    _.output.log("commands.sendtomniip", "Ending function body");
  }
};