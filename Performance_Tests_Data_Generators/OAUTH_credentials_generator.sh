#!/bin/bash
    > OAUTH_credentials.csv
#for i in {1..100}
#do
#    echo $i
#    NAME="OAUTH2_name$i"
#    APINAME="OAUTH2_apiname$i"
#    curl -X POST http://dev2.gluu.org:8001/consumers/ --data "username=$NAME"
#done
for i in {1..100}
do
    echo $i
    NAME="OAUTH2_name$i"
    APINAME="OAUTH2_apiname$i"
    RESPONSE=`curl -X POST http://dev2.gluu.org:8001/consumers/$NAME/gluu-oauth2-client-auth/ -d name="$APINAME" -d op_host="ce-dev6.gluu.org" -d oxd_http_url="https://localhost:8443" -d oauth_mode=true`

    echo $RESPONSE
    OXD_ID=`echo $RESPONSE | jq -r ".oxd_id"`
    CLIENT_ID=`echo $RESPONSE | jq -r ".client_id"`
    CLIENT_SECRET=`echo $RESPONSE | jq -r ".client_secret"`
    echo "$OXD_ID,$CLIENT_ID,$CLIENT_SECRET" >> OAUTH_credentials.csv
done
