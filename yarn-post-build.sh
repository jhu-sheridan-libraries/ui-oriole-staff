#!/bin/bash

#ui hacks to remove circulation from users modules
cp node_modules_hacks/Users.js node_modules/@folio/users/src
cp node_modules_hacks/ViewUser.js node_modules/@folio/users/src
cp node_modules_hacks/withServicePoints.js node_modules/@folio/users/src
cp node_modules_hacks/EditUserInfo.js node_modules/@folio/users/src/components/EditSections/EditUserInfo

#ui hacks to customize sso login and admin login
cp node_modules_hacks/RootWithIntl.js node_modules/@folio/stripes-core/src
cp node_modules_hacks/index.js node_modules/@folio/stripes-core/src/components
cp node_modules_hacks/Login.js node_modules/@folio/stripes-core/src/components/Login
cp -R node_modules_hacks/LoginAdmin node_modules/@folio/stripes-core/src/components