FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV BOT_TOKEN=YOUR_BOT_TOKEN
ENV API_SERVER=https://api-cc.imeow.pro
ENV BOT_PORT=41004
ENV BOT_ADDRESS=0.0.0.0
ENV USE_WEBHOOKS=TRUE
ENV WEBHOOK_URL=https://bot-cc.imeow.pro
EXPOSE 41004
CMD [ "node", "app.js" ]