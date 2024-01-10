# Dockerfile

# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app
ADD . /app

RUN cd back

# Install app dependencies
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start"]
