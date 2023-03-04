# install dependencies
install:
	npm ci

# run dev server for main site and admin
serve:
	npm run dev&
	hugo serve

# clean up and build
build:
	rm -rf public
	hugo --minify
