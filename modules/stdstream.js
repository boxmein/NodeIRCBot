/*jshint node: true*/
var _ = {};
var processtest = {
	procs: {},
	/*
	procs: {
		"hello": {
			process: Process,
			file: "modules/subproc/hello.exe",
			lastdout: "Last Standard Output message",
			lastderr: "Last Standard Error message"
		}
	}
	*/
	helptext: "proc <cmd> [arguments] - Run a subprocess-based command", 
	enable: 1,
	getHelp: function() { return this.helptext; },
	// Return anything but false when something went wrong
	init: function(underscore) {
		_ = underscore; 
		this.load('hello', 'modules/subproc/hello.exe');
		
		console.log("Initialised processtest.js");
	},
	exec: function(ircdata) {
		var name = ircdata.arg.shift() || false; 
		if (!name) 
			throw "No sub-command argument specified";
		if (!this.procs.hasOwnProperty(name))
			throw "Sub-command is not a process :/"; 
		var str = ircdata.args.join(' ') || "";
		this.procs[name].stdin.write(str+'\n');
		_.output.log("stdstream:exec:"+arg, this.procs[name].lastdout);
		_.commands.respond(this.procs[name].lastdout);
		
	},
	die: function () {
		_.output.log("processtest:die", "Dying: closing the processes"); 
		for (var k in this.procs) {
			this.procs[k].process.kill(); 
		}
	},
	load: function (name, file) {
		this.procs[name] = {};
		this.procs[name].file = file;
		this.procs[name].process = _.cp.spawn(file);
		this.procs[name].process.stdout.on('data', function (chunk) {
			_.output.log(file, chunk);
			processtest.procs[name].lastdout = chunk;
		});
		this.procs[name].process.stderr.on('data', function (chunk) {
			_.output.err(file, chunk);
			processtest.procs[name].lastderr = chunk;
		});
		this.procs[name].process.on('close', function (exitcode) {
			_.output.log(name, "exited with code: " + exitcode);
		});
	}
};

module.exports = processtest;