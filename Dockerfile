FROM node:16.17.0-alpine3.16

WORKDIR /opt/app
RUN yarn global add pm2
EXPOSE 3000

WORKDIR /the-perfect-score-api

COPY ./package.json .
COPY ./yarn.lock .
COPY .npmrc ./

RUN yarn

COPY . .

RUN yarn build
RUN rm -f .npmrc 

CMD ["pm2-runtime", "start", "yarn", "--name", "the-perfect-score-api", "--interpreter", "sh", "--", "start"]