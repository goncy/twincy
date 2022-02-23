# Twincy
See all chat messages and click one to feature it on the stream.

![01](./screenshots/01.jpg)

## Use instructions
* Download the latest version from [releases](https://github.com/goncy/twincy/releases)
* Install the application using the installer
* Open the application
* Type the name of the channel you want to listen messages from
* Use the copy button from the navbar to copy the client app url.
* Add the client app url as a browser source on OBS.
* Send a message on the chat.
* Click the message on the admin.
* Now you should see that message on the stream.

## Actions
* Click: Toggle a message from screen
* Ctrl + Click: Send / remove a message from queue
* Alt + Click: Toggle bookmark

## Commands
!q <question> // Automatically highlights the message

## Development instructions
* Install dependencies: `npm install` in the root directory
* Run app in dev mode:
  - Browser: `npm run dev`
  - Desktop: in separate terminals execute `npm run dev` and `npm run dev:tauri`


## Build standalone app
From the root directory you can execute the command `npm run build:tauri` to generate the desktop app for the OS you are running the app from, this will generate several files in the folder `./packages/admin/src-tauri/target/release` including the `twincy-admin.exe` in the case of Windows

---
Follow me on [Twitter](https://twitter.gonzalopozzo.com), on [Twitch](https://twitch.gonzalopozzo.com) and doname un [Cafecito](https://cafecito.gonzalopozzo.com) ✨
