FROM node:16-alpine as version

WORKDIR /mangas

COPY --chown=node:node package.json package-lock.json ./

RUN node -e "['./package.json','./package-lock.json'].forEach(n => {  \
  let p = require(n);                               \
  p.version = '0.0.0';                              \
  fs.writeFileSync(n, JSON.stringify(p));           \
  });"


FROM node:16-alpine as build

WORKDIR /mangas

COPY --chown=node:node --from=version /mangas/package.json /mangas/package-lock.json ./
RUN npm ci --only=production
RUN npm cache clean --force

COPY --chown=node:node . .

RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=8080

USER node

EXPOSE 8080
EXPOSE 8000

CMD [ "npm", "start" ]