#!/bin/bash

# Usage: ./launch.sh [env]

TOMCAT_HOME=/var/lib/tomcat8

if [ $# -gt 0 ]; then # environment provided
    TOMCAT_HOME="$TOMCAT_HOME-$1"
    if [ ! -d $TOMCAT_HOME ]; then
        echo "Environment specified not found: $1"
        exit
    fi
else 
    read -p "Are you sure? (yes/no) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit
    fi
fi

ant war && (
systemctl stop tomcat8
rm -f $TOMCAT_HOME/webapps/gcweb.war
rm -fR $TOMCAT_HOME/webapps/gcweb
mv gcweb.war $TOMCAT_HOME/webapps/
systemctl start tomcat8
)
