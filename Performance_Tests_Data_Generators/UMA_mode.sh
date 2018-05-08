#!/bin/bash
    > UMAcredentials.csv
    > Cus_credentials.csv
for i in {1..50}
do
    echo $i
    NAME="UMAname$i"
    APINAME="UMAapiname$i"
    HOST="wp.pl"
    UPSTREAMURL="http://mockbin.com"
    API_PATH="/docs$i"

    curl -X POST http://dev2.gluu.org:8001/apis --data "name=$APINAME" --data "hosts=$HOST" --data "upstream_url=$UPSTREAMURL"
sleep 3
    curl -X POST http://dev2.gluu.org:8001/apis/$APINAME/plugins --data "name=gluu-oauth2-client-auth" --data "config.op_server=https://ce-dev6.gluu.org" --data "config.oxd_http_url=https://localhost:8443"
sleep 3

    UMA_RESPONSE=`curl -X POST --url http://dev2.gluu.org:8001/apis/$APINAME/plugins/ --data "name=gluu-oauth2-rs" --data "config.oxd_host=https://localhost:8443" --data "config.uma_server_host=https://ce-dev6.gluu.org" --data "config.protection_document=[ { \"path\":\"$API_PATH\", \"conditions\":[ { \"httpMethods\":[\"GET\"], \"scopes\":[ \"http://photoz.example.com/dev/actions/view\" ] } ] } ]"`

    echo $UMA_RESPONSE
    UOXD_ID=`echo $UMA_RESPONSE | jq -r ".config | .oxd_id"`
    UCLIENT_ID=`echo $UMA_RESPONSE | jq -r ".config | .client_id"`
    UCLIENT_SECRET=`echo $UMA_RESPONSE | jq -r ".config | .client_secret"`
    echo "$UOXD_ID,$UCLIENT_ID,$UCLIENT_SECRET,$API_PATH" >> UMAcredentials.csv

sleep 3
    CusNAME="name$i"
    CusAPINAME="apiname$i"
    curl -X POST http://dev2.gluu.org:8001/consumers/ --data "username=$NAME"
    RESPONSE=`curl -X POST http://dev2.gluu.org:8001/consumers/$NAME/gluu-oauth2-client-auth/ -d name="$CusAPINAME" -d op_host="ce-dev6.gluu.org" -d oxd_http_url="https://localhost:8443" -d uma_mode=true`
    echo $RESPONSE
    OXD_ID=`echo $RESPONSE | jq -r ".oxd_id"`
    CLIENT_ID=`echo $RESPONSE | jq -r ".client_id"`
    CLIENT_SECRET=`echo $RESPONSE | jq -r ".client_secret"`
    echo "$OXD_ID,$CLIENT_ID,$CLIENT_SECRET" >> Cus_credentials.csv
    
done 
