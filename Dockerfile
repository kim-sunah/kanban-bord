FROM node:16
WORKDIR /kanban-bord/back
RUN npm install
RUN npm run build
EXPOSE 4000
CMD npm run start
