default: frontend build

frontend: frontend.build

frontend.clean:
	+$(MAKE) -C ../frontend clean

frontend.build:
	+$(MAKE) -C ../frontend

build:
	./mvnw verify -Pnative

clean: frontend.clean
	./mvnw clean

.PHONY: default build clean \
  frontend frontend.build frontend.clean
