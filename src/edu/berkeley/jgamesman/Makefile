#!/usr/bin/make -f

GMDIR=../../../../../Gamesman+-
GAME=ttt

JAVACBIN=$(shell which javac)
ifdef JAVA_HOME
	JDKDIR=$(JAVA_HOME)
else
	JDKDIR=$(shell dirname $(JAVACBIN))/..
endif

#JDKDIR=/usr/local/jdk1.7.0
#JDKDIR=/usr/lib/java//java-jdk-1.6.0

CFLAGS=-I$(JDKDIR)/include/linux/ -I$(JDKDIR)/include/
LDFLAGS=-lgamesman -lcutil -lmath -lm -lpthread -pthread -fPIC
JFLAGS=-classpath ../../..

# Target info 
JNILIBNAME=GamesmanJNI
JNILIBEXT=.jnilib
JNILIB=$(JNILIBNAME)$(JNILIBEXT)
JAVACLASS=Gamesman.class
SHAREDOPT=-dynamiclib -shared

all: Gamesman+- $(JNILIB) $(JAVACLASS)

Gamesman+-: $(GMDIR)/lib/libgamesman.a

$(GMDIR)/lib/libgamesman.a $(GMDIR)/src/Games/$(GAME).o:
	make -C $(GMDIR)

$(JNILIB): Gamesman+- JavaInterface.c $(GMDIR)/src/Games/$(GAME).o
	gcc -g -Wall -L$(GMDIR)/lib -I$(GMDIR)/src $(SHAREDOPT) -o $(JNILIB) \
		$(GMDIR)/src/Games/$(GAME).c JavaInterface.c $(CFLAGS) $(LDFLAGS)

.java.class: $<
	$(JAVACBIN) $(JFLAGS) $<

clean:
	rm -vf $(JNILIB) $(JAVACLASS)

.SUFFIXES: .class .java
.PHONY: Gamesman+- all clean

