FROM node:10.18-jessie

WORKDIR /usr/src/app
COPY . .
RUN cd ./programs/server && npm install --production
RUN cd ../../
EXPOSE 3000 
CMD ["node","main.js"]