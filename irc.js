
var _ = {};
var irc = {
  init: function(underscore) {
    _ = underscore;
    console.log("Initialized irc.js");
  },
  setClient: function(client) {
    irc.client = client;
  },
  // IRC protocol wrappers
  ctcp: function(channel, data) { // to send CTCP data which must end in \x01
    irc.raw("PRIVMSG " + channel + " :\x01" + data + "\x01");
  },
  mode: function (channel, mode) {
    irc.raw("MODE " + channel + " " + mode);
  },
  action: function(channel, action) { // to send a /me action
    irc.ctcp(channel, "ACTION "+ action);
  },
  privmsg: function(channel, message, hide) { // To send a regular message to #chan or user
    irc.raw("PRIVMSG " + channel + " :" + message, hide);
  },
  notice: function(channel, message) {
    irc.raw("NOTICE " + channel + " :" + message);
  },
  join: function(channel) { // To join a channel
    irc.raw("JOIN " + channel);
  },
  part: function(channel) { // To leave a channel
    irc.raw("PART " + channel);
  },
  quit: function(quitmsg, nosendquit) {
    for (var k in _.commands.cmds) 
    {
      var each = _.commands.cmds[k];
      if (each.die)
        each.die();
    }
    if (!quitmsg) 
      quitmsg = "D:";
    //irc.privmsg("#powder-bots", this.quitmsgs[index]);
    if (!nosendquit)
      irc.raw("QUIT :" + quitmsg);
    setTimeout(function() { 
      process.exit(0); 
    }, 5000);
  },
  raw: function(data, hide) { 
  // To send raw IRC data (hide hides the sending box, optionally)
    irc.client.write(data + "\n", "ascii", function() {
      if(!hide)
        _.output.out("raw",data);
    });
  }
};
module.exports = irc;

