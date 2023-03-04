# install dependencies
install:
	npm ci

# run dev server for main site and admin
serve:
	hugo serve

# clean up and build
build:
	rm -rf public
	hugo --minify

deploy-dry-run:
	/Users/eduardo/projects/hugo/hugo deploy --log --verbose --verboseLog --debug --maxDeletes 0 --dryRun

