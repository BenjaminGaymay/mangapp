FROM node:18-alpine as version

WORKDIR /mangas

COPY --chown=node:node package.json package-lock.json ./

RUN node -e "['./package.json','./package-lock.json'].forEach(n => {  \
  let p = require(n);                               \
  p.version = '0.0.0';                              \
  fs.writeFileSync(n, JSON.stringify(p));           \
  });"


FROM node:18-alpine as build

WORKDIR /mangas

RUN apk add xvfb chromium python3

ENV NODE_CHROMIUM_SKIP_INSTALL=true
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY --chown=node:node --from=version /mangas/package.json /mangas/package-lock.json ./
RUN npm i
RUN npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=8080

USER node

EXPOSE 8080

CMD [ "npm", "start" ]