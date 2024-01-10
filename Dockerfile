# Dockerfile

# Use an official Node runtime as a parent image
FROM node:latest

# Install app dependencies for back-end
WORKDIR /app/back

RUN ls -al
# RUN npm install

# # Move back to the root directory
# WORKDIR /app

# # Copy the rest of the application code to the container
# COPY . .

# # Make port 3000 available to the world outside this container
# EXPOSE 3000

# # Define the command to run the application
# CMD ["npm","run", "start"]
