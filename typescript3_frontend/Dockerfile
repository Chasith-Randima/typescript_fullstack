# FROM node:20-alpine

# WORKDIR /app/frontend

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm","run","dev"]


# Use Node.js 20 Alpine as the base image for building
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

ENV NEXT_PUBLIC_APP_NAME=LAP.LK
ENV NEXT_PUBLIC_FRONTEND_DOMAIN="http://44.204.150.148:3001/api/v1"
ENV NEXT_PUBLIC_API_DEVELOPMENT="http://44.204.150.148:3001/api/v1"
ENV NEXT_PUBLIC_API_PRODUCTION="http://44.204.150.148:3001/api/v1"
ENV NEXT_PUBLIC_PRODUCTION=false,
ENV NEXT_PUBLIC_STRIPE=pk_test_51H1PjSIzYcTJzt02z5GaR7ntXS7SzKPSg1qSNRkeP55DoPFWyHwQ5MhuzBer27U1YSt1poEhuSHTntS9lvf6em3400mftYOTgG

# Build the Next.js application
RUN npm run build

# Use Nginx as the base image for serving the built files
FROM nginx:alpine

# remove existing files from nginx directory
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the previous stage to the Nginx directory
COPY --from=builder /app/frontend/out /usr/share/nginx/html

# add nginx config
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf


# Expose port 3000 (default for Nginx)
EXPOSE 3000

# Default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]



# # using staged builds
# FROM node:20-alpine as builder
# # make the directory where the project files will be stored
# RUN mkdir -p /usr/src/next-nginx
# # set it as the working directory so that we don't need to keep referencing it
# WORKDIR /usr/src/next-nginx
# # Copy the package.json file
# COPY package.json package.json
# # install project dependencies
# RUN npm install
# # copy project files 
# # make sure to set up .dockerignore to copy only necessary files
# COPY . .
# # run the build command which will build and export html files
# RUN npx prisma db seed && npm run build

# # bundle static assets with nginx
# FROM nginx:1.21.0-alpine as production
# ENV NODE_ENV production
# # remove existing files from nginx directory
# RUN rm -rf /usr/share/nginx/html/*
# # copy built assets from 'builder' stage
# COPY --from=builder /usr/src/next-nginx/out /usr/share/nginx/html
# # add nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# # expose port 80 for nginx
# EXPOSE 80
# # start nginx
# CMD ["nginx", "-g", "daemon off;"]