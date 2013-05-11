var C = {
  reply: {
    withNotices: false,                   // Reply with notices, keeping the channel cleaner.
    concisely: false                      // Reply concisely, making strings shorter and parseable.
  },

  logging: {
    logThreshold: -1,                     // Log messages are filtered by importance. 
    errToChannel: false,                  // Send errors to the channel?              
    errToOwner: false,                    // Send errors to owner? 
    toDisk: false,                        // Log to disk?
    vividLogs: true,                      // Logging is colourful
    timestamp: true,                      // Logs are timestamped. 
    datestamp: true,                      // Logs are datestamped.
    levelstamp: true                      // Logs get a 'log level' stamp according to their importance.
  },

  behaviour: {
    // Can't think of much to put here...
    stdinListen: true,                    // Listen on Standard Input for some commands
    startupMessages: true,                // Startup CWD/Timestamp/Hostmask messages. 
    commandFilter: /[^A-z0-9]+/           // Filter used on commands to remove bad characters. All that match this will be replaced with empty string.

  },

  irc: {
    prefix: "\\",                         // Commands are prefixed with that.
    nickname: "boxnode",                  // Nickname on the IRC
    realname: "NodeIRCBot v3",            // The bot's 'real name'

    joinDelay: 7,                         // Delay before sending JOIN message, in seconds
    useSasl: false,                       // If to use SASL authentication
    useNickserv: true,                    // If to use NickServ authentication
    autoRejoin: true,                     // Automatically rejoin when kicked.
    autoRejoinDelay: 1,                   // Automatic rejoin delay, if autorejoin.

    nickserv: {
      user: "",                           // The bot's NickServ user. Used on identification. Can be left blank.
      password: "5nortpred"               // The bot's password
      
    },

    sasl: {
      password: "",                       // SASL password (NickServ password)
      nick: ""                            // NickServ password
    },

    connection: {
      server: "irc.freenode.net",         // IRC network to connect to, the bot is written for Freenode. 
      port: 6667,                         // Port to connect to. SSL is sadly not supported :C
      channels: "##boxmein"               // Channels separated by only commas.
    },

    owner: {
      nick: 'boxmein', 
      hostmatch: 'unaffiliated/boxmein'
    },

    admin: {

    }
  },

  commands: {
    // Keep command configs here, if you want to. 
    "hello": {
      message: "Hello! :D" 
    }
  }
};

C.irc.nickserv.user = C.irc.nickserv.user || C.irc.nickname; 
C.irc.sasl.nick = C.irc.sasl.nick || C.irc.nickname; 
C.irc.sasl.pasword = C.irc.sasl.password || C.irc.nickserv.password; 

module.exports = C; 