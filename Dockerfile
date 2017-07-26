FROM node:6.11.1

RUN npm install -g pm2 webpack babel-core

WORKDIR /app

ADD . /app

RUN npm install

EXPOSE 8080

ENV APP_PATH /app
ENV ENV devlopment

CMD webpack --config frontend_webpack.config.js && webpack --config backend_webpack.config.js && pm2 start --no-daemon build.js