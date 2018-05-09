#!/bin/bash
for i in {1..10}
do
    echo $i
    NAME="name$i"
    curl -X DELETE http://dev2.gluu.org:8001/consumers/$NAME
done 
