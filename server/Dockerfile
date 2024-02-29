FROM node:20.11.1-alpine3.19
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 33250
ENV ADDRESS=0.0.0.0 PORT=33250
ENV UNIT=1 TYPE=1
CMD ["npm", "start"]