
var config = {
	verify: function() { return true},
  // For prefix, see commands
  silent: false, // Hides log and channel messages, leaves errors
  partmsg: "",
  quitmsg: "", 
  nickname: "",
  pass: "",
  realname: "",
  channels: "",
  owner: "" // Use a part of the hostmask
};
module.exports = config;