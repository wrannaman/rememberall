FROM node:22-alpine
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api
COPY package.json /usr/src/api/package.json 
RUN npm install
COPY . /usr/src/api
COPY .env.prod .env
RUN rm -rf .env.local && rm -rf .env.prod
RUN ls -plah .
RUN npm run build
ENV NODE_ENV=production
ENV ENV=production
ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "run", "start" ]
