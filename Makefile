DEVNAME = app-dev
DEVBLD = sudo docker build -t $(DEVNAME) .
DEVRUN = sudo docker run --rm -p 4200:4200 -v $(shell pwd):/app $(DEVNAME)

dev-build:
	$(DEVBLD)
dev-run:
	$(DEVRUN)
dev:
	sudo systemctl restart docker
	sudo fuser -k 4200/tcp || true
	$(DEVBLD)
	$(DEVRUN)
