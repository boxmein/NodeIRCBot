# 1. Modules

## Module basics
Each module consists of a few mandatory functions and some extras, which aren't exactly necessary but may come in handy. 
Modules are imported from commands.js from its `.init()` block, and the init function is passed a property which contains all sorts of references to loaded modules (and utility modules that I've written)  
Throughout this explanation I'll refer a lot to `modules/hello.js` for it is the easiest example.

## Code walkthrough

This chapter will go through modules/hello.js and pretty much just explain what each line does. 

## 1. Module structure

    /*jshint node:true */

This is just a comment for JSHint for those of you that use it. 

    var _ = {}; 

The _ value will be set later, this will contain all references to require()'d modules from irc-bot.js (outputting, HTTP requests, networking, child processes, any Node.js functionality that's loaded in irc-bot.js is here)

    module.exports = { /*...*/ }

The node.js `require()` expects all of the 'public' features of your module to be included in `module.exports`, so the most basic setup has almost every used property stored in there. Event functions and the `enabled` property accessed by the bot will also be in `module.exports`.

    helptext: "hello - Says hello. Test module"

This is where one could store the help text for the command. It isn't necessary to name it this way since it's never directly accessed.   
I do use a few conventions when writing the help text:  

1. First and foremost, the command name. Without a prefix character.  
2. Mandatory arguments go with &lt;argument&gt;   
3. Optional arguments are surrounded like this: [argument]  
4. Next comes a dash and the help text. 
 
So for example it could look like this:  
`hello <name> [othername...] - Say hello to someone`

    getHelp() { return this.helptext; }

This is how the help text gets returned. This is useful for either initiation (which the init function is for actually) or even for returning a generated help text. 

    init (underscore) { _ = underscore; /* ... */ }

The init function is run when a command is loaded (find it in commands.js, in function .load()). Note, the _ variable is also set in this function. Use this to get access to any other bot functionality (such as responding to users, sending raw IRC or outputting log messages).  
You may also return anything aside from 'false' to signify your module's loading has failed. 

    exec (ircdata) { /* ... */}

This is run whenever the command specified by this module is run. The ircdata object contains a lot of what you'll need to properly handle the command. 

`die()`: Run before closing the bot properly (via 'owner quit' or 'quit' into stdin)
`onEnable()`: Run after enabling the command via 'owner enable'.
`onDisable()`: Run after disabling the command via 'owner disable'. 
 


