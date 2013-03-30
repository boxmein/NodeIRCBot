
var config = {
  // For prefix, see commands
  silent: false, // Hides log and channel messages, leaves errors
  loud:  false,  // Used by modular to output errors into the IRC
  prefix: "",    // The bot's command prefix character (if more than one there's a number you need change)
  textlogging: true, // Does the <nick/channel> logging thing
  rawlogging: false, // Logs everything
  partmsg: "",   // Message to send when leaving channel
  quitmsg: "",   // Message to send when quitting
  nickname: "",  // Bot nickname
  pass: "",      // NickServ password
  realname: "",  // Reported real name
  channels: "",  // Channels separated by comma. Example: #chat,#freenode,#a,#b,#oneliners
  owner: ""      // Use a part of the hostmask
  server: "irc.freenode.net" // IRC server to connect to (irc.freenode.net)
  ownerEmail: "", // Owner of the bot, for user-agents in requests. 
  lastFM: {
    apiKey: "",   // Last.fm API key for commands.lastfm
    secretKey: "" // Last.fm secret key
  }
};
module.exports = config;