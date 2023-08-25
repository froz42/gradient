FROM node:20-slim as base-build
ENV NODE_ENV build
USER node

WORKDIR /home/node
COPY --chown=node package*.json yarn.lock ./

FROM base-build as install-prod-libs

RUN yarn config set network-timeout 600000 -g

RUN yarn install --frozen-lockfile

FROM install-prod-libs as make-dist

ARG VITE_HTTP_BACKEND_ENDPOINT
ARG VITE_WS_BACKEND_ENDPOINT

ENV VITE_HTTP_BACKEND_ENDPOINT=$VITE_HTTP_BACKEND_ENDPOINT
ENV VITE_WS_BACKEND_ENDPOINT=$VITE_WS_BACKEND_ENDPOINT

COPY --chown=node . .
COPY --chown=node --from=install-prod-libs /home/node/node_modules ./node_modules

RUN yarn build

FROM nginx:1.25-bullseye as prod

WORKDIR /usr/share/nginx/html
COPY confs/nginx.conf /etc/nginx/nginx.conf
COPY --from=make-dist /home/node/dist .

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]