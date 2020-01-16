FROM node:12

WORKDIR /usr/src/app
COPY . .
RUN cd ./programs/server && npm install --production
RUN cd ../../
EXPOSE 3000 
CMD ["node","main.js"]