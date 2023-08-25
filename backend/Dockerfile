FROM node:20-slim as base-build
ENV NODE_ENV build
USER node

WORKDIR /home/node
COPY --chown=node package*.json yarn.lock ./
FROM base-build as install-prod-libs

RUN yarn config set network-timeout 600000 -g

RUN yarn install --frozen-lockfile

FROM install-prod-libs as make-dist
COPY --chown=node . .
COPY --chown=node --from=install-prod-libs /home/node/node_modules ./node_modules
RUN yarn build

FROM node:20-slim as prod

RUN apt-get update && apt-get install -y ffmpeg

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --chown=node --from=install-prod-libs /home/node/node_modules ./node_modules
COPY --chown=node --from=make-dist /home/node/dist ./dist
COPY --chown=node --from=make-dist /home/node/package.json ./package.json

CMD ["yarn", "start:prod"]