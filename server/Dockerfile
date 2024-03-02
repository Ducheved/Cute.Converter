FROM node:current-slim
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

RUN apt-get update && \
    apt-get install -y openssl

ENV ADDRESS=0.0.0.0 PORT=33250
ENV UNIT=1 TYPE=1

RUN printf "[dn]\nCN=srv.loc\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:srv.loc\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth" > extfile.cnf && \
    openssl req -x509 -out srv.loc.crt -keyout srv.loc.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=srv.loc' -extensions EXT -config extfile.cnf

CMD ["npm", "start"]