#!/bin/bash

# if email is not set exit
if [ -z "$EMAIL" ]; then
    echo "Error: EMAIL is not set"
    exit 1
fi

bash generate_config.sh nginx.conf /etc/nginx/nginx.conf
if [ $? -ne 0 ]; then
    echo "Error: failed to generate nginx.conf"
    exit 1
fi

if [ -f "/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem" ]; then
    echo "Certificate already exists"
else
    echo $EMAIL
    certbot certonly --standalone \
    --agree-tos \
    --email $EMAIL \
    --no-eff-email \
    --expand \
    --domains $DOMAIN_NAME \
    --rsa-key-size 4096 \
    --keep-until-expiring \
    --non-interactive
    if [ $? -ne 0 ]; then
        echo "Error: failed to generate certificate"
        cat /var/log/letsencrypt/letsencrypt.log
        exit 1
    fi
fi

nginx -g "daemon off;"
if [ $? -ne 0 ]; then
    echo "Error: failed to start nginx"
    cat /etc/nginx/nginx.conf
    exit 1
fi
