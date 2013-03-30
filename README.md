# NodeIRCBot 
A functional IRC bot written in node.js

## Features: 

1. Commands are loaded in modules
2. Not loading a single module will not stop the bot
3. Errors encountered in initialization and command execution can be `throw`n into the main handler
4. Every other module is loaded in the main script file and can be used via the _ variable.

## Quick start: 

1. Write your own config.js following the format of config.js.default
2. Acquire the node modules [xmldom][domp] and [Sandbox][sand]
3. Run the IRC bot script with `node irc-bot.js`

## Additionally: 

1. Compile all the source files with `make` or `make minify`  
   (requires the Closure Compiler and sed)


[domp]: https://github.com/jindw/xmldom
[sand]: https://github.com/gf3/sandbox