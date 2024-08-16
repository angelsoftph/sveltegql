# Dockerfile for Svelte Front-End

# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose port 5000 (change this if your Svelte app runs on a different port)
EXPOSE 5000

# Command to run the app
CMD ["npm", "run", "preview"]
