FROM node:20.18.0 AS builder

ENV NODE_OPTIONS=--max_old_space_size=4096

WORKDIR /build

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run gen-banned-address

RUN yarn build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /build/dist ./dist

CMD ["nginx"]
