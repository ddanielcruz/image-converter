# Build image
FROM node:16-alpine AS build

# Create build directory
WORKDIR /root/build

# Copy projects and install dependencies
COPY . .
RUN npm ci

# Build packages (define used packages on big projects)
RUN npm run compile

# App image
FROM node:16-alpine

# Create app directory
WORKDIR /root/app

# Copy project dependencies
COPY package.json package-lock.json ./
COPY --from=build /root/build/packages /root/app/packages
RUN cd packages && find . -type f -not -wholename '*/dist*' -not -wholename '*package*.json' -delete

# Install project production dependencies
ENV NODE_ENV production
RUN npm ci

# Start the project
CMD ["npm", "start", "-w", "@image-converter/webhooks"]
