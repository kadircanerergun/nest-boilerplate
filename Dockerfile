# Use the official Node.js 20.3.0 base image
FROM node:20.3.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json/yarn.lock to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port your NestJS app runs on
EXPOSE 3000

# Command to start the application
CMD ["npm", "run", "start:prod"]