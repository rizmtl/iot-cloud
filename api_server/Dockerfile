FROM node
WORKDIR /opt/iot/api_server
COPY . /opt/iot/api_server
RUN npm install
CMD ["node", "./index.js"]
EXPOSE 8081
