#!/bin/bash
mkdir -p Test_Data
> Test_Data/basic_credentials.csv
GG_HOST="dev1.gluu.org"
UPSTREAMURL="http://dev2.gluu.org/aa"
END=$1
for i in $(eval echo "{1..$END}")
do
    echo $i
    NAME="basic_name$i"
    PASSWORD="basic_pass$i"
    HOST="basic$i.example.com"
    ID="basic_id$i"
    APINAME="basic_apiname$i"


    curl -X DELETE http://$GG_HOST:8001/apis/$APINAME
    curl -X POST http://$GG_HOST:8001/apis --data "name=$APINAME" --data "hosts=$HOST" --data "upstream_url=$UPSTREAMURL"
    curl -X POST http://$GG_HOST:8001/apis/$APINAME/plugins --data "name=basic-auth"


    curl -X DELETE http://$GG_HOST:8001/consumers/$NAME
    curl -d "username=$NAME&custom_id=$ID" http://$GG_HOST:8001/consumers/
    RESPONSE=`curl -X POST  --data "username=$NAME" --data "password=$PASSWORD" http://$GG_HOST:8001/consumers/$NAME/basic-auth`
    echo $RESPONSE
    echo "$NAME,$PASSWORD,$HOST" >> Test_Data/basic_credentials.csv
    
done 
