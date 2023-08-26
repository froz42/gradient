# Gradient

A discord music bot with a cool dashboard.
![image](https://github.com/tmatis/gradient/assets/54767855/24a7bb31-7a13-4f27-a8a5-1f267dcfa5d9)


## Setup instructions

### requirements

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### setup

#### clone the repository

```bash
git clone https://github.com/tmatis/gradient.git
cd gradient
```

#### setup environment variables

Copy the following environment variables into a file named `.env` in the root of the project.

```.env
DOMAIN_NAME=
EMAIL=
DISCORD_TOKEN=
JWT_SECRET=
YOUTUBE_API_KEY=
```

- `DOMAIN_NAME` is the domain name of the server. your need to have a DNS record pointing to the server. to generate a certificate for the domain name, [certbot](https://certbot.eff.org/) is used.
- `EMAIL` is the email address used to generate the certificate.
- `DISCORD_TOKEN` is the token of the discord bot. see [here](https://www.writebots.com/discord-bot-token/) for more information.
- `JWT_SECRET` is the secret used to sign the JWT tokens. it can be any string. it is recommended to use a random string.
- `YOUTUBE_API_KEY` is the API key used to fetch the videos from youtube. see [here](https://developers.google.com/youtube/v3/getting-started) for more information.
  Note: the youtube API key is required to fetch channel content but is not required to fetch playlist, search results or videos.

#### start the app

Start the server with the following command.

```bash
docker-compose up
```

if you don't see any error you can detach from the process with `Ctrl + C` and run the following command to start the server in the background.

```bash
docker-compose up -d
```

#### stop the app

```bash
docker-compose down
```

#### update the app

```bash
git pull
docker-compose down
docker-compose up -d
```
