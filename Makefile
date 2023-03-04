# install dependencies
install:
	npm ci

# run dev server for main site and admin
serve:
	npm run dev&
	hugo serve --bind=0.0.0.0

# clean up and build
build:
	rm -rf public
	hugo --minify
