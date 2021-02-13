install:
	sudo npm install

build:
	sudo npm run build

publish:
	sudo npm publish --dry-run
lint:
	npx eslint .
test:
	npm test
coverage:
	npx jest --coverage