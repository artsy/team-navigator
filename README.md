[![Build Status](https://semaphoreci.com/api/v1/projects/94083eb0-a44a-4b7a-a4be-56ddc5758ac4/560485/badge.svg)](https://semaphoreci.com/artsy-it/team-navigator)

# Team Navigator

### Meta
* __State:__ production
* __Production:__ [team.artsy.net](https://team.artsy.net/)
* __CI:__ [Semaphore](https://semaphoreci.com/artsy-it/team-navigator)
* __Point People:__ [@craigspaeth](https://github.com/craigspaeth), [@orta](https://github.com/orta)

### Set-Up

- Fork Team Navigator to your Github account in the Github UI.
- Clone your repo locally (substitute your Github username).
```
git clone git@github.com:your-github-username/team-navigator.git
```
- Install MongoDB
```
brew install mongodb
```
- Install [NVM](https://github.com/creationix/nvm), [Node](https://nodejs.org/en/), and npm modules.
```
brew install nvm
nvm install 6
npm install
```
- Copy over a .env file and replace all sensitive config, e.g. `SHEETS_URL=REPLACE`,
with staging config.
```
cp .env.example .env
heroku config --app=team-navigator-staging
```
- Start Team Navigator and Mongo
```
npm run dev
```
- Team Navigator should now be running at http://localhost:3000/

- Then you need to sync data, open the [GraphiQL](http://localhost:3000/api?query=mutation%20%7B%0A%20%20sync%0A%7D)


### Testing

We use [standard](https://github.com/feross/standard) for linting. For the best experience it's recommended that you install an inline linter in your text editor, such as [Sublime Linter Standard](https://github.com/Flet/SublimeLinter-contrib-standard), to surface linting issues immediately.

We use [mocha](https://mochajs.org/) for testing. For the best experience writing tests it's recommended you target the suite you're working on in watch mode `npm run mocha -- --watch test/your/tests.js`.

To run the full test suite and linter use `npm test`.

### Scripts

Want to send out workaversary slack notifications? Schedule `scripts/daily_notifications.js` to run every day.
