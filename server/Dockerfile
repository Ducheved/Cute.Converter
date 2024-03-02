FROM node:current-slim
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

RUN apt-get update && \
    apt-get install -y openssl
ARG SRVNAME
ENV SRVNAME=$SRVNAME ADDRESS=0.0.0.0 PORT=33250 UNIT=1 TYPE=1 PROTOCOL=HTTP

RUN if [ "$PROTOCOL" = "HTTPS" ] ; then \
    printf "[dn]\nCN=$SRVNAME\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:$SRVNAME\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth" > extfile.cnf && \
    openssl req -x509 -out $SRVNAME.crt -keyout $SRVNAME.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN='$SRVNAME -extensions EXT -config extfile.cnf ; \
    fi

CMD ["npm", "start"]