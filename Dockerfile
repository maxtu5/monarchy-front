# Use a lightweight web server
FROM nginx:alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy React build to Nginx web root
COPY build/ /usr/share/nginx/html

# Copy custom Nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]