# I have a global closure.bat that calls java --jar closure.jar $ARGS
# You might want to rewrite this to suit your own needs. :) 
# This is what it looks like: 
# @java -jar C:\Users\###\closure-compiler\compiler.jar %*
JSC := closure
# I do this because *.js would match each file twice. (minified + regular!)
JSFILES=$(wildcard *.js modules/*.js) 
# Note that require()'s in my code use .js so I can't use .min.js. 
MINJS = $(JSFILES) 
MINDIR := minified/


all: 
	touch $(MINDIR)$(JSFILES)
	minify
minify: $(JSFILES)
# Minify & replace dependencies with minified variants
%.js: $(MINDIR)%.js
	$(JSC) --js $@ --js_output_file $< --language_in=ECMASCRIPT5
clean: 
	rmdir $(MINDIR)
