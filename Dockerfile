FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY build /usr/share/nginx/html
COPY build /usr/share/nginx/html/staff

