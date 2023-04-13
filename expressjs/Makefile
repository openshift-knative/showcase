default: frontend deps build

deps:
	npm install

build:
	npm run build

clean: frontend.clean
	rm -rfv build
	rm -rf node_modules

frontend: frontend.build

frontend.clean:
	+$(MAKE) -C ../frontend clean

frontend.build:
	+$(MAKE) -C ../frontend

.PHONY: default deps build clean \
  frontend frontend.build frontend.clean
