# Use official Node.js 20 image as the base
FROM node:20

# Install Python 3 and build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port your app runs on (change if needed)
EXPOSE 3000

# Start the app (adjust if your start command is different)
CMD ["npm", "start"]
