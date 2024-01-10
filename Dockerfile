FROM node
WORKDIR /app
ADD . /app
RUN cd back
RUN ls -al
