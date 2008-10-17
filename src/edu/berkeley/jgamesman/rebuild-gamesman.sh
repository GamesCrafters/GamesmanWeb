#!/bin/bash
pushd ../../../../../Gamesman+-/ 
find . \( -name '*.o' -o -name '*.a' \) -exec rm -v {} \;
make -j4 all
popd

