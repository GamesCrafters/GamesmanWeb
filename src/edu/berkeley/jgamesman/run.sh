#!/bin/bash

#-Djava.library.path=$PWD 

cd ../../..
# use -verbose:class -verbose:jni

java edu.berkeley.jgamesman.Gamesman "$1"

