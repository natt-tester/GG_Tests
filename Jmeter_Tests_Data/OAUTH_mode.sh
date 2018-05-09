#!/bin/bash
mkdir -p Test_Data
    > Test_Data/OAUTH_credentials.csv
END=$1
for i in $(eval echo "{1..$END}")
do
    echo $i
    NAME="OAUTH_name$i"
    APINAME="OAUTH_apiname$i"
    HOST="oauth$i.example.com"
    UPSTREAMURL="http://mockbin.com"
    curl -X POST http://dev2.gluu.org:8001/consumers/ --data "username=$NAME"
    curl -X POST http://dev2.gluu.org:8001/apis --data "name=$APINAME" --data "hosts=$HOST" --data "upstream_url=$UPSTREAMURL"
    curl -X POST http://dev2.gluu.org:8001/apis/$APINAME/plugins --data "name=gluu-oauth2-client-auth" --data "config.op_server=https://ce-dev6.gluu.org" --data "config.oxd_http_url=https://localhost:8443"
    sleep 3
done
for i in $(eval echo "{1..$END}")
do
    echo $i
    NAME="OAUTH_name$i"
    HOST="oauth$i.example.com"
    APINAME="OAUTH_apiname$i"
    RESPONSE=`curl -X POST http://dev2.gluu.org:8001/consumers/$NAME/gluu-oauth2-client-auth/ -d name="$APINAME" -d op_host="ce-dev6.gluu.org" -d oxd_http_url="https://localhost:8443" -d oauth_mode=true`
    sleep 3
    echo $RESPONSE
    OXD_ID=`echo $RESPONSE | jq -r ".oxd_id"`
    CLIENT_ID=`echo $RESPONSE | jq -r ".client_id"`
    CLIENT_SECRET=`echo $RESPONSE | jq -r ".client_secret"`
    echo "$OXD_ID,$CLIENT_ID,$CLIENT_SECRET,$HOST" >> Test_Data/OAUTH_credentials.csv
done
