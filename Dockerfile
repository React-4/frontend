# 1. Use the official Nginx base image for serving the application
FROM nginx:latest

# 2. Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# 3. Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4. Expose the port Nginx will listen on
EXPOSE 80

# 5. Start Nginx when the container is run
CMD ["nginx", "-g", "daemon off;"]
