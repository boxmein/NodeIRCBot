@echo Setting up NodeIRCBot..
npm install xmldom
npm install sandbox
@cd modules
@mkdir data
@cd data
@type {"person1":{"level":"2"},"person2":{"level":"3"}} >> admins.json
@cd ..\..\
@echo Ready.
@pause
node irc-bot.js
