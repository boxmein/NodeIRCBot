
var output = require("./output.js");
var config = require("./config.js");
var irc = {
  verify: function() {return true},
  setClient: function(client) {
    irc.client = client;
  },
  // IRC protocol wrappers
  ctcp: function(channel, data) { // to send CTCP data which must end in \x01
    irc.raw("PRIVMSG " + channel + " :\x01" + data + "\x01");
  },
  action: function(channel, action) { // to send a /me action
    irc.ctcp(channel, "ACTION "+ action);
  },
  privmsg: function(channel, message) { // To send a regular message to #chan or user
    irc.raw("PRIVMSG " + channel + " :" + message);
  },
  notice: function(channel, message) {
    irc.raw("NOTICE " + channel + " :" + message);
  },
  join: function(channel) { // To join a channel
    irc.raw("JOIN " + channel);
  },
  part: function(channel) { // To leave a channel
    irc.raw("PART " + channel + " :" + config.partmsg);
  },
  quit: function() {
    irc.raw("QUIT :"+config.quitmsg);
    process.exit(0);
  },
  raw: function(data, hide) { // To send raw IRC data (hide hides the sending box, optionally)

    irc.client.write(data + "\n", "ascii", function() {
      if(!hide)
        output.out("raw",data);
    });
  }
};
module.exports = irc;