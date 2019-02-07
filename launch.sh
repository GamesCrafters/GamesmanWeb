#!/bin/bash

# Usage: ./launch.sh [env]

TOMCAT_HOME=/var/lib/tomcat8

if [ $# -eq 0 ]; then

    read -p "Are you sure? (yes/no) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit
    fi

    ant war && (
        systemctl stop tomcat8
        rm -f $TOMCAT_HOME/webapps/gcweb.war
        rm -fR $TOMCAT_HOME/webapps/gcweb
        mv gcweb.war $TOMCAT_HOME/webapps/
        systemctl start tomcat8
    )

else  # Alt environment

    TOMCAT_HOME="$TOMCAT_HOME-$1"
    if [ ! -d $TOMCAT_HOME ]; then
        echo "Environment specified not found: $1"
        exit
    fi

    ant war && (
        $TOMCAT_HOME/bin/shutdown.sh
        rm -f $TOMCAT_HOME/webapps/gcweb.war
        rm -fR $TOMCAT_HOME/webapps/gcweb
        mv gcweb.war $TOMCAT_HOME/webapps/
        $TOMCAT_HOME/bin/startup.sh
    )

fi
