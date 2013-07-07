
/*jshint node: true*/
var _ = {};
module.exports = {
  disables: [],
  fname: "list",
  help: "Sends a message to xsbot via CGI",
  params: ["<text>"],

  onInit: function(underscore) { 
    _ = underscore; 
  },
  onRun: function(ircdata) {
    _.output.log(0, "sendtoxsbot: Starting HTTP request");
    var message = ircdata.message.words.join(" ") || false;
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
      _.output.log(0, "Response status: " + response.statusCode);
      response.on("error", function(evt) {
        _.output.err(0, "sendtoxsbot: "+ evt.message);
      });
    }).end();
  }
};