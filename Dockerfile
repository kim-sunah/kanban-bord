# Dockerfile

# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /app/back

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
