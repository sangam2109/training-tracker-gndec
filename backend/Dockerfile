# Use the official Node.js image as base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which the application will run (if needed)
EXPOSE 8443


# Specify the command to run when the container starts
CMD ["node", "index.js"]
