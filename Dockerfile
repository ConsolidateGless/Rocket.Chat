FROM node:8.17

WORKDIR /usr/src/app
COPY . .
RUN cd ./programs/server && npm install --production --unsafe-perm
RUN cd ../../
EXPOSE 3000 
CMD ["node","main.js"]