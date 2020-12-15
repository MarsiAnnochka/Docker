FROM node:10.19.0

WORKDIR /home/osboxes/Docker_app
COPY package*.json /home/osboxes/Docker_app/

RUN npm install

COPY . /home/osboxes/Docker_app

EXPOSE 8080
EXPOSE 5432

CMD [ "node", "app"]

