# ui-oriole-staff

This repo is the front-end of Folio, and contains our Oriole module. The front-end for Folio is based on a framework called Stripes.

Copyright (C) 2018 Johns Hopkins University Libraries

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" 
for more information. 

## Introduction

This module was created with stripes. For documentation of stripes, see [stripes documentation](https://github.com/folio-org/stripes). 

## Prerequisites/ Sandbox Setup 
brew install nvm. 
mkdir ~/.nvm. 
vi ~/.bash_profile 

export NVM_DIR=~/.nvm. 
source $(brew --prefix nvm)/nvm.sh

source ~/.bash_profile  
echo $NVM_DIR

nvm install 12. 
nvm use 12

nvm alias default 12. 
yarn global add --force sharp. 

yarn config set @folio:registry https://repository.folio.org/repository/npm-folio/

yarn global add @folio/stripes-cli

stripes alias add @folio/stripes-core ~/tester/ui-oriole-staff/node_modules/@folio/stripes-core

yarn install. 
yarn start

In order to view and log into the platform being served up, a suitable Okapi backend will need to be running. 
For oriole backend, see these projects: 
* [mod-oriole](https://github.com/jhu-sheridan-libraries/mod-oriole) - The Oriole API
* [oriole-ansible](https://github.com/jhu-sheridan-libraries/oriole-ansible) - Deployment scripts using ansible

## Set up 

Create two files `.stripesclirc` and `stripes.config.js.local`, 

```
#.stripesclirc
{
  "configFile": "stripes.config.js.local",
  "port": 3001,
  "aliases": {
  }  
}
```

`.stripesclirc` tells stripes to look for the config file at a path, and runs on a port. You can change the port to a different one if you prefer. 

The config file, `stripes.config.js.local`(or you may rename it to a different one), tells the app where to look for OKAPI, and using which tenent. It also sets up config params, and define the list of modules to include. See the official documentation for details: https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md

Below is just an example: 

```
#stripes.config.js.local
module.exports = {
  okapi: { 'url':'https://path-to-oriole-api', 'tenant':'diku' },
  config: {
    hasAllPerms: true
  },
  modules: {
    '@folio/tenant-settings': {},
    '@folio/users': {}
  }
};
```

## Run your new app

We use [yarn](https://yarnpkg.com) to manage the packages and run the app. You may also directly use stripes commands.

Before you start, create two files `.stripesclirc` and `stripes.config.js` 
See [.stripesclirc.example](https://github.com/folio-org/stripes-sample-platform/blob/master/.stripesclirc.example) and 
[stripes.config.js](https://github.com/folio-org/stripes-sample-platform/blob/master/stripes.config.js) in the 
[stripes-sample-platform](https://github.com/folio-org/stripes-sample-platform) repository for how the file show look like. 

### With yarn commands

Run the following from the ui-oriole-staff directory to serve your new app using a development server:
```
yarn start
```

#### Run the tests

Run the included UI test `demo` with the following command:
```
yarn test
```

#### Build the package
```
yarn build
```

### With stripes commands

Run the following from the ui-oriole-staff directory to serve your new app using a development server:
```
stripes serve
```

Note: When serving up a newly created app that does not have its own backend permissions established, pass the 
`--hasAllPerms` option to display the app in the UI navigation. For example:
```
stripes serve --hasAllPerms
```

To specify your own tenant ID or to use an Okapi instance other than http://localhost:9130, pass the `--okapi` 
and `--tenant` options.
```
stripes serve --okapi http://my-okapi.example.com:9130 --tenant my-tenant-id
```

#### Run the tests

Run the included UI test `demo` with the following command:
```
stripes test --run demo --show
```

## Deploy

Deploy to the test server is straightforward: 

```
yarn build
```

Then delete the content in oriole-test:/opt/ui_staff, and SCP the content in the `build` directory to oriole-test:/opt/ui_staff.

## What to do next?

Now that your new app is running, search the code for "`stripes-new-app`" to find comments and subbed placeholders 
that may need your attention.

Read the [Stripes Module Developer's Guide](https://github.com/folio-org/stripes-core/blob/master/doc/dev-guide.md).

Update this README with information about your app.

