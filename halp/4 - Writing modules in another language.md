# 4. Writing modules in another language than JS 
_(or just running them as a sub-process to not share memory)_

The module `stdstream.js` (named so because it works on standard input/output) can spawn child processes and use their standard output as command output. Thus, you can write a module in any programming language with support for standard input and output. 

## How it works

The module sends out command queries as lines of standard input terminated by a line feed `\n`. It expects in return a single line of output, or a 'data' chunk for the events. 

When a line of input is read off the process, it is stored as 'last standard output' into the process object. When the command is handled, no delay is expected (bad choice!) and last stdout is used as the return value. 

Some module-side scripting can be done in the .exec block. 

## How to load a program into the module

1. In `stdstream.js`, add a line to the `init` function that will load each module via `this.load(module_shortname, module_relative_path);`
2. Make sure your program lies in that relative path. The program is expected to be executable.
3. The program's input is now accessible via `proc <module_shortname> <input>` from the IRC. 

## What the aforementioned 'process object' looks like

		"hello": {
			process: /* child_process.spawn(this.file); */,
			file: "modules/subproc/hello.exe",
			lastdout: "Last Standard Output message",
			lastderr: "Last Standard Error message"
		}
