

var _ = null;

module.exports = {
  disables: [],
  fname: "eat",
  help: "eats a given user",
  params: ["<user>"],  
  onInit: function(under) {
    _ = under;
  },
  onRun: function(ircdata) {
    _.output.log(0, ircdata.message.words); 
    var toeat = ircdata.message.words[1] || ircdata.sender;
    _.sendRaw("PRIVMSG " + ircdata.channel + " :\x01ACTION eats " + toeat + "\x01"); 
  },
  onEnable: function (channel) {},
  onDisable: function (channel) {}
};