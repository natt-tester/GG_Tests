#!/bin/bash
mkdir -p Test_Data
    > Test_Data/UMAcredentials.csv
    > Test_Data/Cus_credentials.csv
GG_HOST="dev1.gluu.org"
START=$1
END=$2
for i in $(eval echo "{$START..$END}")
do
    echo $i
    NAME="UMA_name$i"
    APINAME="UMA_apiname$i"
    HOST="uma$i.example.com"
    UPSTREAMURL="http://dev2.gluu.org"
    API_PATH="/test$i"

    curl -X DELETE http://$GG_HOST:8001/apis/$APINAME
    curl -X POST http://$GG_HOST:8001/apis --data "name=$APINAME" --data "hosts=$HOST" --data "upstream_url=$UPSTREAMURL"
    curl -X POST http://$GG_HOST:8001/apis/$APINAME/plugins --data "name=gluu-oauth2-client-auth" --data "config.op_server=https://ce-dev6.gluu.org" --data "config.oxd_http_url=https://localhost:8443"

#--------------CUSTOMER-------------------
    CusNAME="UMA$i"
    CusAPINAME="UMACred$i"
    curl -X DELETE http://$GG_HOST:8001/consumers/$NAME
    curl -X POST http://$GG_HOST:8001/consumers/ --data "username=$NAME"
    RESPONSE=`curl -X POST http://$GG_HOST:8001/consumers/$NAME/gluu-oauth2-client-auth/ -d name="$CusAPINAME" -d op_host="ce-dev6.gluu.org" -d oxd_http_url="https://localhost:8443" -d uma_mode=true`
    echo $RESPONSE
    OXD_ID=`echo $RESPONSE | jq -r ".oxd_id"`
    CLIENT_ID=`echo $RESPONSE | jq -r ".client_id"`
    CLIENT_SECRET=`echo $RESPONSE | jq -r ".client_secret"`
    echo "$OXD_ID,$CLIENT_ID,$CLIENT_SECRET" >> Test_Data/Cus_credentials.csv

#-------------- UMA Resource------------------
    UMA_RESPONSE=`curl -X POST --url http://$GG_HOST:8001/apis/$APINAME/plugins/ --data "name=gluu-oauth2-rs" --data "config.oxd_host=https://localhost:8443" --data "config.uma_server_host=https://ce-dev6.gluu.org" --data "config.protection_document=[ { \"path\": \"$API_PATH\", \"conditions\": [ { \"httpMethods\": [ \"GET\" ], \"scope_expression\": { \"rule\": { \"and\": [ { \"var\": 0 } ] }, \"data\": [ \"http://photoz.example.com/dev/actions/view\" ] } } ] } ]"`

    echo $UMA_RESPONSE
    UOXD_ID=`echo $UMA_RESPONSE | jq -r ".config | .oxd_id"`
    UCLIENT_ID=`echo $UMA_RESPONSE | jq -r ".config | .client_id"`
    UCLIENT_SECRET=`echo $UMA_RESPONSE | jq -r ".config | .client_secret"`
    echo "$UOXD_ID,$UCLIENT_ID,$UCLIENT_SECRET,$HOST,$API_PATH" >> Test_Data/UMAcredentials.csv
done 

