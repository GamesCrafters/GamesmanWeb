#!/bin/bash

TOMCAT_HOME=/opt/apache-tomcat
ant war && (
$TOMCAT_HOME/bin/shutdown.sh
rm -f $TOMCAT_HOME/webapps/gcweb.war
rm -fR $TOMCAT_HOME/webapps/gcweb
mv gcweb.war $TOMCAT_HOME/webapps/
$TOMCAT_HOME/bin/startup.sh
)
