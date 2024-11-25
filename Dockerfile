# 1. Using the node image as the base image for the build stage
FROM node:18 as build

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the source code to the container's working directory
COPY . .

# 6. Set environment variables
ARG VITE_BACK_URL
ENV VITE_BACK_URL=${VITE_BACK_URL}
ARG VITE_PUBLIC_URL
ENV VITE_PUBLIC_URL=${VITE_PUBLIC_URL}

# 7. Build the project
RUN npm run build

# 8. Use the official Nginx base image for serving the application
FROM nginx:latest

# 9. Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# 10. Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 11. Expose the port Nginx will listen on
EXPOSE 80

# 12. Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]