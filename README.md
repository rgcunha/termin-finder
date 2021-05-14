# Covid-19 Vaccine Finder

A Node.js service to find covid-19 vaccine appointments. Once an appointment has been found a notification will be sent to the Telegram bot: @Covid19VaccineFinderBot

## Install

```sh
nvm install # installs node version specified in .nvmrc
cp .env.example .env
npm install
```

## Start

The web server runs on port `3001` by default unless a different value is specified in `PORT` env variable.

```sh
npm start
```

## Start (with Docker)

The server runs on port `3001` by default unless a different value is specified in `PORT` env variable.

```sh
docker build . -t vaccine-finder
docker run -p 3001:3001 -t vaccine-finder
```
