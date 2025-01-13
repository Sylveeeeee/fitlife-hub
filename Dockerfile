# Use the official Node.js image
FROM node

WORKDIR /app

# Copy only the package files (dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema files (optional, only if needed for generating Prisma Client)
COPY prisma ./prisma

# Build the Prisma client
RUN npx prisma generate

# Copy the rest of the application code (optional, you can exclude specific files using .dockerignore)
COPY . .

# Build the Next.js app
RUN npm run build

# Start the application
CMD ["npm", "start"]
