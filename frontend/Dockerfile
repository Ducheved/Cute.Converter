FROM node:latest as builder
WORKDIR /app
ENV PATH /usr/src/node_modules/.bin:$PATH
ARG VITE_APP_API_URL
ENV VITE_APP_API_URL=$VITE_APP_API_URL
COPY package*.json ./
RUN npm install
COPY . .

FROM builder as dev
CMD ["npm", "run", "dev"]

FROM builder as prod-builder
RUN npm run build

FROM nginx:latest as production-stage
COPY --from=prod-builder /app/dist /usr/share/nginx/html
COPY builds/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]