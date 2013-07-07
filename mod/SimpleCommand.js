// Basis for generating commands on the go with single lines. 

var _ = null;

module.exports = function (name, exec, help) {
  return new Command({
    fname: name,
    help: (help || "Simple Command " + name),
    onRun: (typeof exec === "string" ? function() { eval(exec) } : exec)
  });
}

module.exports.init = function(u) {
  _ = u; 
}