default: frontend deps test build

deps:
	npm install

build:
	npm run build

test:
	npm run test:ci

clean: frontend.clean
	rm -rfv build
	rm -rf node_modules

frontend: frontend.build

frontend.clean:
	+$(MAKE) -C ../frontend clean

frontend.build:
	+$(MAKE) -C ../frontend

.PHONY: default deps build clean test \
  frontend frontend.build frontend.clean
