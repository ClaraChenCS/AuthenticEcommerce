#!/bin/bash
# Set up postgres db for local debugging.

#echo Setup file to Install PostgreSQL on Mac locally...
#echo
#echo Update Homebrew...
#echo

brew update

#echo
#echo Install PostgreSQL...
#echo

brew install postgres

#echo
#echo Configure PostgreSQL to start automatically
#echo

mkdir -p ~/Library/LaunchAgents
ln -sfv /usr/local/opt/postgresql/*.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/homebrew.mxcl.postgresql.plist

#echo
#echo To Start the Postgres Server Manually execute this next line and open another terminal window to keep working:
#echo postgres -D /usr/local/var/postgres
#echo

# Extract variables from the .pgpass file
# stackoverflow.com/a/5257398
echo
echo Extracting Variables from .pgpass...
echo

PGPASS=`cat .pgpass`
TOKS=(${PGPASS//:/ })
PG_HOST=${TOKS[0]}
PG_PORT=${TOKS[1]}
PG_DB=${TOKS[2]}
PG_USER=${TOKS[3]}
PG_PASS=${TOKS[4]}

# Set up the Users and Database
echo
echo Setup User and Database
echo

echo -e "\n\nINPUT THE FOLLOWING PASSWORD TWICE BELOW: "${PG_PASS} ${PG_USER} ${PG_DB}
createuser -E -P -s $PG_USER
createdb -O $PG_USER $PG_DB


