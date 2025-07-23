# STAGE BUILD APP
FROM node:latest AS build-app

WORKDIR /frontend-sipren

COPY package.* ./
RUN npm install

COPY . .
RUN npm run build


# STAGE DEPLOY
FROM nginx:latest

COPY from=build-app /frontend-sipren/dist /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
