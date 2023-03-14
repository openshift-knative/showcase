default: expressjs quarkus

frontend:
	+$(MAKE) -C frontend

frontend.clean:
	+$(MAKE) -C frontend clean

expressjs:
	+$(MAKE) -C expressjs

expressjs.clean:
	+$(MAKE) -C expressjs clean

quarkus:
	+$(MAKE) -C quarkus

quarkus.clean:
	+$(MAKE) -C quarkus clean

clean: frontend.clean expressjs.clean quarkus.clean

.PHONY: default frontend expressjs quarkus clean frontend.clean expressjs.clean quarkus.clean
