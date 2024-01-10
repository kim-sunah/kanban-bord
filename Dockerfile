FROM node
WORKDIR ./back
RUN npm install
EXPOSE 3000
CMD npm start
