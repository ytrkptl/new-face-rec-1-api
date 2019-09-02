FROM node:10.16.0

WORKDIR /usr/src/facerecognitionbrain-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]