FROM node:16
WORKDIR /kanban-bord/back
RUN npm install
EXPOSE 4000
CMD npm run start
