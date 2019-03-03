install-deps:	
	npm install

start:
	npx babel-node -- index.js

publish:
	npm publish

lint:
	npx eslint .

build:
	rm -rf dist
	npm run build

coverage:
	rm -rf coverage
	npm run coverage

test:
	npm test

debug-test:
	DEBUG=page-loader:* npm test

.PHONY: test coverage debug-test
