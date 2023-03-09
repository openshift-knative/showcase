default: deps test build webjar

deps:
	npm install

test:
	npm test -- --colors --watchAll=false

build:
	npm run build

webjar:
	npm run webjar

clean:
	rm -rfv build
	rm -rf node_modules

.PHONY: default test build clean deps
