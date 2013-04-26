
/*jshint node: true*/
var _ = {};
module.exports = {
  helptext: "down <url> - gets if the given _domain_ is currently down. Checks for / ", 
  enable: 0,
  getHelp: function() { return this.helptext; },
  // Return anything but false when something went wrong
  init: function(underscore) { 
    _ = underscore; 
    console.log("Initialised hello.js");
  },
  exec: function(ircdata) {
    // Get the domain
    var domain = ircdata.args.shift()
      .replace(/^http:\/\//i,"")
      .split("/") || false;
    console.log("received domain: " + domain.join('/'));
    if (!domain[0]) 
      return "No domain specified ;_;";
    try {
      return _.http.request({
        host: domain.shift(), 
        path: (domain.join("/") || "/") 
      }, 
      function(response) {
        console.log("request fulfilled: status=" + response.statusCode);
        if (response.statusCode == 200)
          _.commands.respond(ircdata,"Seems up (200)");
        else
          _.commands.respond(ircdata, "{0}: something happened ):)".format(response.statusCode));
      }).end();
    }
    catch (err) {
      throw "Even worse: " + err;
    }
  }
};