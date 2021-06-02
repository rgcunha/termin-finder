# Termin Finder

A Node.js service to find doctor appointments. Once an appointment has been found a notification will be sent to the Telegram bot: @TerminFinderBot

## Install

```sh
nvm install # installs node version specified in .nvmrc
cp .env.example .env
npm install
```

## Start

The web server runs on port `3001` by default unless a different value is specified in `PORT` env variable.

```sh
npm run tunnel
npm start
```

## Start (with Docker)

The server runs on port `3001` by default unless a different value is specified in `PORT` env variable.

```sh
docker build . -t termin-finder
docker run -p 3001:3001 -t termin-finder
```
