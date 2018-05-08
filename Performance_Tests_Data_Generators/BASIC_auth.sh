#!/bin/bash
> basic_credentials.csv
for i in {1..10}
do
    echo $i
    NAME="basic_name$i"
    PASSWORD="basic_pass$i"
    ID="basic_id$i"
    APINAME="basic_apiname$i"

    curl -d "username=$NAME&custom_id=$ID" http://dev2.gluu.org:8001/consumers/
    RESPONSE=`curl -X POST  --data "username=$NAME" --data "password=$PASSWORD" http://dev2.gluu.org:8001/consumers/$NAME/basic-auth`
    echo $RESPONSE
    echo "$NAME,$PASSWORD" >> basic_credentials.csv
    
done 
