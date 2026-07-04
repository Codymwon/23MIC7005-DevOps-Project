# Use lightweight Nginx alpine base image
FROM nginx:alpine

# Copy static website files to Nginx default public folder
COPY ./public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
