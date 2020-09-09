
FROM node:12

WORKDIR /opt/censys/splunk-hec

COPY package*.json ./

RUN npm install -s

COPY . .

# EXPOSE 8080

CMD ["node", "docker.js"]
