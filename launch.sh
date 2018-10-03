#!/bin/bash

TOMCAT_HOME=/var/lib/tomcat8

ant war && (
systemctl stop tomcat8
rm -f $TOMCAT_HOME/webapps/gcweb.war
rm -fR $TOMCAT_HOME/webapps/gcweb
mv gcweb.war $TOMCAT_HOME/webapps/
systemctl start tomcat8
)
