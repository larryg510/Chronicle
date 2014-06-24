FROM stackbrew/ubuntu:latest

EXPOSE 80

RUN apt-get update
RUN apt-get install -y wget
RUN wget -O - http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz | tar -C /usr/local/ --strip-components=1 -zxv

WORKDIR /data/app

ADD ./package.json /data/app/package.json
ADD ./npm-shrinkwrap.json /data/app/npm-shrinkwrap.json
RUN npm install
RUN npm install -g grunt-cli > /dev/null 2>&1

ADD ./ /data/app

RUN npm run-script build

CMD npm start
