FROM node:5.0.0
ADD . /code
WORKDIR /code
RUN npm install
CMD npm run start