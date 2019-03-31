# [WIP] Ng Spotify Playlist

[![CircleCI](https://circleci.com/gh/GonzaloChacon/ng-spotify-playlist.svg?style=svg)](https://circleci.com/gh/GonzaloChacon/ng-spotify-playlist)

This is a Angular front end project that communicates with the  [Spotify Web API](https://developer.spotify.com/web-api/) and lets you modify your user playlists. You will need to login through the ***Spotify interface***, and once authenticated, you will be able to:

- Log into your Spotify account
- Create, edit and unsubscribe from your playlists
- Add or remove tracks
- Search tracks, albums or artists in Spotify database

> ***NOTE:*** This is a work in progress.  I'm just playing around with the Spotify API and also messing around with some javascript :)

> ***TODO:***
> - Create UI for both desktop and mobile
> - ...SOME MORE STUFF I DON'T KNOW YET!

## About this project

This porject was intended to implement only the basic dependencies necesary to run Angular framework. All services, components and features are custom made (check [App Features](doc/Features.md)), the idea is to play a little with some concepts and not rely in libraries.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli).

#### ***- Install***
Clone repo and run `npm install` (Make sure to have installed Node and NPM before).

#### ***- Development server:***
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### ***- Build:***
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

#### ***- Running unit tests:***
Run `npm run test` to run tests once with `code coverage` results. (results will be stored at `/coverage`).
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Features

[App Features](doc/Features.md)
