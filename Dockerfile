FROM mongo-express:latest

COPY spp.js /app/
COPY package.json /app/

WORKDIR /app 

RUN npm install // Does it download from package-lock as well?

CMD ["node", "app.js"]
