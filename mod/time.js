var _ = null;

module.exports = {
  // List of channels the command is disabled in.
  disables: [],
  fname: "time",
  help: "Gives you my local time as an UTC string",
  params: [],  
  onInit: function(under) {
    _ = under;
  },
  onRun: function() {
    return new Date().toUTCString(); 
  },
  onEnable: function (channel) {},
  onDisable: function (channel) {}
};