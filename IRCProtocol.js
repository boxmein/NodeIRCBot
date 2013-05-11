// IRC utilities

var _ = null;

module.exports.irc = {

  init: function(u) {
    _ = u; 
  },

  // Sends a CTCP request to the channel or user. Used for ACTION and various CTCP requests.

  // @param channel    The user or channel to send a request to
  // @param data       The CTCP data to send. Includes the sub-command.
  //                   Looks like "VERSION" or like "ACTION eats a vegetable"
  ctcp: function(channel, data) {
    return "PRIVMSG {0} :\x01{1}\x01".format(channel, data);
  },
  // Sets a channel mode. Will also work with bans/stuff since mode can contain a name. 

  // @param channel    The channel that will receive the given mode.
  // @param mode       The mode being set. May either be "+o" or even "+b boxmein!*@*"
  mode: function (channel, mode) {
    return "MODE {0} {1}".format(channel, mode);
  },
  // Sends a NAMES request to the given channel to find out all about the users joined there.

  // @param channel    The channel to send NAMES to.
  names: function (channel) {
    return "NAMES " + channel;
  },
  // Sends a CTCP ACTION, the equivalent of /me in IRC clients.

  // @param channel    The channel to send the ACTION to. May also be an username.
  // @param action     The action to send.
  action: function(channel, action) {
    return "\x01ACTION {0}\x01".format(action);
  },
  // Sends a private message (also a channel message!)

  // @param channel    The given channel to send to. May also be an username.
  // @param message    The message that will be sent. 
  // @param hide       Whether or not to hide the sent message. Gets passed on to irc.raw. 
  //                   May be left unset
  privmsg: function(channel, message) { 
    return "PRIVMSG {0} :{1}".format(channel, message);
  },
  // Sends a NOTICE to the channel or user

  // @param channel    The channel or user to send the given message to.
  // @param message    The message being sent. 
  notice: function(channel, message) {
    return "NOTICE {0} :{1}".format(channel, message);
  },
  // Joins a channel. 

  // @param channel    The channel to join to
  join: function(channel) { 
    return "JOIN {0}".format(channel);
  },
  // Removes self from the given channel. No leave messages.

  // @param channel    The channel to leave from
  part: function(channel) { 
    return "PART {0}".format(channel);
  },
  // Quits the IRC. Sends a quit message.
  quit: function() {
    return "QUIT :Sayonara";
  }
};


module.exports.op = {
  op: function(channel, user) {
    // +o's a given user.
    return "MODE {0} +o {1}".format(channel, user);
  },
  deop: function(channel, user) {
    // -o's a given user.
    return "MODE {0} -o {1}".format(channel, user);
  },


  kick: function(channel, user) {
    // removes user from channel forcedly
    return "KICK {0} {1} :Roulette or randomban kick!".format(channel, user);
  },

  ban: function(channel, user) {
    // prevents user from talking and joining
    return "MODE {0} +b {1}".format(channel, user);
  },
  unban: function(channel, user) {
    // unbans user
    return "MODE {0} -b {1}".format(channel, user);
  },
  kban: function(channel, user, time) {
    if (time) 
      setTimeout(function() { this.unban(channel, user); }, time*1000); // Seconds
    // bans user for time, 0 for no unban
    return this.ban(channel, user) + "\r\n" + 
           this.kick(channel, user);
    
  },

  voice: function(channel, user) {
    // Voices the given user. Can talk when channel in moderated mode. 
    return "MODE {0} +v {1}".format(channel, user);
  },
  devoice: function(channel, user) {
    // Removes voice from given user.
    return "MODE {0} -v {1}".format(channel, user);
  }
};

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
          return typeof args[number] != 'undefined' ? 
          args[number] : 
          match;
    });
  };
}