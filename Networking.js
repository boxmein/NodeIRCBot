var _ = null;
var Networking = {
  connect: function (un, ondata, onclose, onerr) {
    _ = un; 
    var sock = new _.net.Socket();
    _.output.log(0, "Connecting..."); 

    sock.setEncoding('utf8');
    sock.setNoDelay(); 

    sock.connect(
      _.config.irc.connection.port, 
      _.config.irc.connection.server, 
      Networking.onConnect);

    sock.on('data', ondata);
    sock.on('close', onclose); 
    sock.on('error', onerr); 

    if (_.config.irc.useSasl) {
      _.output.log(0, "Preparing for SASL authentication...\nUnimplemented!"); 
    }

    else {
      // Delayed identification/channel joining stuff go here.
      setTimeout(function() {
        _.output.log(0, "Setting up initialness.."); 
        sock.write("NICK " + _.config.irc.nickname + "\r\n"); 
        sock.write("USER {0} 8 * :{1}\r\n".format(
              _.config.irc.nickserv.user, 
              _.config.irc.realname));
        

        if (_.config.irc.useNickserv) {
          _.output.log(0, "Identifying for NickServ...");
          sock.write("PRIVMSG NickServ :IDENTIFY " + 
             (_.config.irc.nickserv.username || '') +
              _.config.irc.nickserv.password + "\r\n"); 
        }


        sock.write("JOIN " + _.config.irc.connection.channels + "\r\n"); 

      }, 1000 * _.config.irc.joinDelay);

    }
    return sock; 
  },
  onConnect: function (data) {
    _.output.log(10, "Successful connection!"); 
  }
};

module.exports = Networking;