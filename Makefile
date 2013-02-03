# I have a global closure.bat that calls java --jar closure.jar $ARGS
SHELL=C:/Windows/System32/cmd.exe
JSC := closure
# I do this because *.js would match each file twice. (minified + regular!)
JSMINFILES = $(wildcard *.min.js)
JSFILES=$(JSMINFILES:.min.js=.js)


all: minify
minify: $(JSFILES)
# Minify & replace dependencies with minified variants
%.js: %.min.js
	$(JSC) --js $@ --js_output_file $< --language_in=ECMASCRIPT5
	sed -e "s/.js/.min.js/g" $< > $<.tmp
	mv $(TMPDIR)$<.tmp $(MINDIR)$<
clean: 
	rm $(JSFILES:.js=.min.js)
# Careful with compiling with this! 
# Occasionally generates 800+ MB files
monolith: 
	cat $(JSFILES) > monolith.js
	sed -e "/module.exports/ d" -e "/require(/ d" monolith.js > monolith.js.tmp
	mv monolith.js.tmp monolith.js
	$(JSC) --js monolith.js --js_output_file monolith.min.js --language_in=ECMASCRIPT5