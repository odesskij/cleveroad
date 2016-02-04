FROM ubuntu:14.04

MAINTAINER Vladimir Odesskij <odesskij1992@gmail.com>

RUN apt-get update -y && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
RUN apt-get install -y nodejs

WORKDIR /app
ADD . /app

RUN npm install

EXPOSE 3000

CMD ["node_modules/.bin/pm2", "start", "app.js"]