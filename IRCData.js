// Raw data might be split by spaces or not. 


var IRCData = function (rawr) {
  var spacesplit; 

  if (rawr instanceof Array) 
    spacesplit = rawr, rawr = rawr.join(' ');  

  // << [:xsBot!~xsBot@unaffiliated/mniip/bot/xsbot, PRIVMSG, ###xsbot, :+<Sg_Voltage>, you, can, only, ...]
  var colonsplit = rawr.split(':');

  this.raw = rawr;
  this.message.fullmsg = colonsplit[2];
  this.sender.hostmask = spacesplit[0]; 
  this.sender.nick = this.sender.hostmask.substring(1, this.sender.hostmask.indexOf('!'));
  this.channel = spacesplit[2];
  this.message.words = this.message.fullmsg.split(' '); 

};


IRCData.prototype = {
  sender: {
    nick: "",
    hostmask: "", 
    isOwner: false,
    isAdmin: false, 
    adminLevel: 0
  },
  message: {
    words: [],
    fullmsg: "",
    commandless: "" //Not set in the constructor.
  },
  command: "", 
  raw: "",
  channel: "" //Not set in the constructor.
};

module.exports.IRCData = IRCData;