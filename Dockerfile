# Dockerfile

# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /bacc

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 4000

# Define the command to run the application
CMD ["npm", "run", "start"]
