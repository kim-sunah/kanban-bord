FROM node
WORKDIR /app
ADD . /app
WORKDIR /back
RUN ls -al
