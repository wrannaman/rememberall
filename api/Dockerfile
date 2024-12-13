FROM node:22-alpine
# Add build argument for TYPE
ARG TYPE=api
# Add environment variable to persist the TYPE arg
ENV TYPE=$TYPE

RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY package.json /usr/src/api/package.json 
RUN npm install
COPY . /usr/src/api
COPY .env.prod .env
ENV NODE_ENV=production
ENV ENV=production
ENV PORT=3001
EXPOSE 3001

# Simplified CMD to just run the main index file
CMD node index.js
