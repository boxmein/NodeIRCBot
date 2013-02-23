@echo Minifying the source...
make
@set /p ANS=Run bot? (y/n)
@if /i {%ANS%}=={y} (goto :yay)
@pause
exit
:yay
_run-irc-bot.bat