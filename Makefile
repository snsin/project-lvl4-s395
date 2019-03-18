install-deps:	
	npm install

start:
	npm run start

develop:
	DEBUG="task-manager:*" npx nodemon --watch .  --ext '.js' --exec npx gulp server

publish:
	npm publish

lint:
	npx eslint .

build:
	rm -rf public
	npm run build

coverage:
	rm -rf coverage
	npm run coverage

test:
	npm test

debug-test:
	DEBUG=page-loader:* npm test

.PHONY: test coverage debug-test
