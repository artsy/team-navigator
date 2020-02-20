[![Build Status](https://semaphoreci.com/api/v1/projects/94083eb0-a44a-4b7a-a4be-56ddc5758ac4/560485/badge.svg)](https://semaphoreci.com/artsy-it/team-navigator)

# Team Navigator

### Meta
* __State:__ production
* __Production:__ [team.artsy.net](https://team.artsy.net/)
* __Point People:__ [@orta](https://github.com/orta), [@zephraph](https://github.com/zephraph)

### What is this?

We have a pretty complicated set of businesses inside Artsy. Now that we're above 150+ staff members, our organizational structure can get tricky to understand. This is a web-app for showing our team setup.

Here's a censored overview. It has search, filter by locations, teams and an A-Z of all staff.

![./screenshots/overview.png](./screenshots/overview.png)

And individual people pages have all sorts of useful info

![./screenshots/member.png](./screenshots/member.png)

### Set-Up

- Fork Team Navigator to your GitHub account in the GitHub UI.
- Clone your repo locally (substitute your GitHub username).
```
git clone git@github.com:your-github-username/team-navigator.git
```
- Install MongoDB (or use the MongoDB app)
```
brew install mongodb
```
- Install [NVM](https://github.com/creationix/nvm), [Node](https://nodejs.org/en/), and npm modules.
```
brew install nvm
nvm install 8
yarn install
```
- Copy over a .env file and replace all sensitive config, e.g. `SHEETS_URL=REPLACE`,
with staging config.
```
cp .env.example .env
# Artsy staff can see our production env vars with
heroku config --app=artsy-team-navigator
```
- Start Team Navigator and Mongo
```
yarn dev
```
- Team Navigator should now be running at http://localhost:3000/

- Then you need to sync data, open the [GraphiQL](http://localhost:3000/api?query=mutation%20%7B%0A%20%20sync%0A%7D) and run the mutation:

```
mutation {
  sync
}
```

### V3

There is some initial work on a V3 inside the app, v3 is a create-react-app using TypeScript that is deployed into team nav.

It is accessible in `/v3/` in the routing schema. To work on it use `yarn v3`, or `yarn dev` will load the CRA dev server in port 3001.

In v2 the koa app uses assets created by running `yarn build`.

### Spreadsheet format

We use a pretty liberal parser for syncing. You can see an example of what our [spreadsheet looks like here](https://docs.google.com/spreadsheets/d/1tF5p0e_Nevgb6kZywnDQaQCQ1CW8XY233b-llt2L5sY/edit?usp=sharing) with just Orta's data in.

If the example is out of date, that's fine, go look at the member model and convert the values to snake_case. Some of the values are generated by the sync, or via daily tasks too.

## Optional ENV vars

`EXCEPTION_USER_IDS` - lets you add non-artsy users to the app, by adding their user IDs to the environment
`NO_SYNCING` - skips the syncing of data on startup

### Testing

We use [standard](https://github.com/feross/standard) for linting. For the best experience it's recommended that you install an inline linter in your text editor, such as [Sublime Linter Standard](https://github.com/Flet/SublimeLinter-contrib-standard), to surface linting issues immediately.

We use [mocha](https://mochajs.org/) for testing. For the best experience writing tests it's recommended you target the suite you're working on in watch mode `yarn mocha -- --watch test/your/tests.js`.

To run the full test suite and linter use `yarn test`.

### Scripts

We have some daily scripts that happen automatically:

* `scripts/daily_notifications.js` sends a slack DM to a manager that their reportee's work-aversary is next week.

* `scripts/daily_github_history_for_member.js` pulls GitHub repos for anyone with a GitHub handle inside your org.

* `scripts/daily_articles_for_member.js` will find any articles someone has contributed to.


### Maintainer notes

* To get an individual's `writerAuthorId` load the [Artsy Editorial](https://writer.artsy.net/settings/channels/5759e3efb5989e6f98f77993/edit) channel in writer then inspect the elements for their IDs.

* To change profile fields, go to your [team profile settings](https://artsy.slack.com/customize/profile) - this will support the big social networks (that are the defaults in Slack), I'd love to make this a bit more generic. 
