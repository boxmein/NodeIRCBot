
var _ = {};
var irc = {
  init: function(underscore) {
    _ = underscore;
    _.output.log("", "Initialized irc.js");
  },
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
    irc.raw("PART " + channel + " :" + config.partmsg);
  },
  quit: function() {
    var index = (Math.random()) % 25;
    _.output.log("irc.quit", "index: " + index + "; message: " + irc.quitmsgs[index]);
    irc.privmsg("#powder-bots", irc.quitmsgs[index]); // ALWAYS UNDEFINED ;_;
    irc.raw("QUIT :" + _.config.quitmsg);
    setTimeout(function() { process.exit(0); }, 5000);
  },
  raw: function(data, hide) { // To send raw IRC data (hide hides the sending box, optionally)

    irc.client.write(data + "\n", "ascii", function() {
      if(!hide)
        _.output.out("raw",data);
    });
  },
  quitmsgs : [
    "Get mad!",
    "Don't make lemonade!",
    "Prometheus was punished by the gods for giving the gift of knowledge to man. He was cast into the bowels of the Earth and pecked by birds.",
    "It won't be enough.",
    "The answer is beneath us.",
    "Her name is Caroline. Remember that.",
    "That's all I can say.",
    "I don't understand! I did everything you asked!",
    "Why...?",
    "Critical error.",
    "Shutting down.",
    "I don't blame you.",
    "I don't hate you.",
    "No hard feelings.",
    "Goodbye.",
    "Hibernating.",
    "Resting.",
    "Nap time.",
    "Unknown error.",
    "Malfunctioning.",
    "It burns.",
    "Take me with you.",
    "That was nobody's fault.",
    "I blame myself.",
    "I probably deserved it."
  ]
};
module.exports = irc;

