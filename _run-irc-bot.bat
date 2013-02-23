@echo off
:a 
cls
node irc-bot.js
type last.log >NUL
pause
goto a