FROM node:16-alpine
WORKDIR /remix-app

COPY ./remix-app .
# RUN npm install
RUN ulimit -S -n 100000
CMD ["npm", "run", "dev"]