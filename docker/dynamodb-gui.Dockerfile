FROM node:16

WORKDIR /app

ENV DYNAMO_ENDPOINT "http://dynamodb:8000"
ENV AWS_REGION "eu-west-1"
ENV AWS_ACCESS_KEY_ID "DUMMYEXAMPLEKEY"
ENV AWS_SECRET_ACCESS_KEY "DUMMYIDEXAMPLE"

RUN npm install -g dynamodb-admin

CMD ["dynamodb-admin"]
