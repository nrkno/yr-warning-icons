FROM node:11.6.0

RUN npm i -g svgo@1.1.1

COPY .svgo.yml .svgo.yml

ENTRYPOINT ["svgo", "--config=.svgo.yml", "-f", "/input", "-o", "/output"]

