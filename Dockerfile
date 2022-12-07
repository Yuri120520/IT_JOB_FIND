FROM node:16.17.0-alpine3.16

WORKDIR /opt/app
RUN yarn global add pm2
EXPOSE 3000

WORKDIR /IT_JOB_FIND_API

COPY ./package.json .
COPY ./yarn.lock .
COPY .npmrc ./

RUN yarn

COPY . .

RUN yarn build
RUN rm -f .npmrc 


CMD ["pm2-runtime", "start", "yarn", "--name", "IT_JOB_FIND_API", "--interpreter", "sh", "--", "start"]