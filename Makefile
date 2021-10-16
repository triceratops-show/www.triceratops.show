# TODO: exclude docs dir
#docs: $(wildcard **/*) $(wildcard *)
.PHONY: docs
docs:
	hugo
	find docs ! -name 'CNAME' ! -name "docs" -exec rm -Rf {} +
	mv public/* docs/

# install dependencies
install:
	npm ci

# run dev server
serve:
	hugo serve
