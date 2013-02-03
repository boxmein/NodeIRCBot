# NodeIRCBot 
A functional IRC bot written in node.js

## Features: 

1. Owner detection via pieces of hostmask (useful in Freenode with cloaks)
2. Standard input commands (see `help`)
3. All features of the bot can be rewritten temporarily with the `js` command 
   (Make sure to set the owner value in config.js!!)
4. Logging with "log types". 
   ( `[EE]` = error, `[LL]` = command, `[>>]` = sending out ...)
5. Quiet mode (only errors are printed!)

## Quick start: 

1. Write your own config.js following the format of config.js.default
2. Run the IRC bot script with `node irc-bot.js`

## Additionally: 

1. Compile all the source files with `make` or `make minify`  
   (requires the Closure Compiler and sed)
2. Compile it all into one source file with `make monolith` (experimental!) 
