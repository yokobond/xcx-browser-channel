# Xcratch Browser Channel Extension
This extension allows [Xcratch](https://xcratch.github.io/) projects to communicate with each other over a browser-based channel.  It utilizes `BroadcastChannel` for secure and efficient cross-project communication.


## ✨ What You Can Do With This Extension

Play example to look at what you can do with "Browser Channel" extension. 

game project: [cat-fight-bc](https://xcratch.github.io/editor/#https://yokobond.github.io/xcx-browser-channel/projects/catfight-bc.sb3)
<iframe src="https://xcratch.github.io/editor/player#https://yokobond.github.io/xcx-browser-channel/projects/cat-fight-bc.sb3" width="540px" height="460px"></iframe>

controller project: [microbit-controller](https://xcratch.github.io/editor/#https://yokobond.github.io/xcx-browser-channel/projects/microbit-controller.sb3)
<iframe src="https://xcratch.github.io/editor/player#https://yokobond.github.io/xcx-browser-channel/projects/microbit-controller.sb3" width="540px" height="460px"></iframe>

This projects demonstrates how to use the Browser Channel extension to create a simple two-player game.  The game is a cat fight where each player controls a cat sprite.  One player can control the cat sprite using the arrow keys, while the other player can control the cat sprite using micro:bit connected in the controller project.  The game uses the Browser Channel extension to allow the two players to communicate with each other. The controller project sends messages to the game project to control the cat sprite.  The game project listens for messages from the controller project and updates the cat sprite accordingly.


## Block Functionality Overview:

This extension facilitates communication by allowing scripts to:

* **Join and leave channels:** Projects connect and disconnect from shared channels.
* **Share data:** Projects can set and retrieve values for keys in a common, shared data space on the channel.
* **Broadcast events:** Projects can send events to other projects on the channel.
* **Handle received events:** Projects can listen and respond to events sent by other projects on the channel.

## Block Categories:

The extension's blocks are grouped into logical categories, outlined below:


**1. Channel Management:**

* **`join channel [CHANNEL]` (opcode: `joinChannel`):**  Joins an existing browser channel.  The `[CHANNEL]` input specifies the name of the channel.  If already joined, this block will return "already joined".  If already joined to another channel, the current channel will be left.
* **`leave channel` (opcode: `leaveChannel`):** Disconnects from the current channel.  Returns a message indicating the channel left or if no channel is joined.
* **`channel name` (opcode: `getChannelName`):** Returns the name of the currently joined channel. If no channel is joined, it returns "no channel joined".


**2. Data Access:**

* **`value of [KEY]` (opcode: `valueOf`):** Retrieves the value associated with the specified `[KEY]` from the shared channel data. Returns an empty string if no channel is joined or the key doesn't exist.
* **`set value of [KEY] to [VALUE]` (opcode: `setValue`):** Updates the shared channel data by associating the `[KEY]` with the `[VALUE]`.  Returns the key-value pair that was set.


**3. Event Handling:**

* **`send event [TYPE] with value [DATA]` (opcode: `sendEvent`):** Broadcasts an event of the specified `[TYPE]` with optional `[DATA]` to all projects connected to the same channel. The `[TYPE]` and `[DATA]` are strings.  Returns a confirmation message including the sent type and data.
* **`when event received` (opcode: `whenEventReceived`):**  A trigger block.  This block will execute the script within when an event is received.  It's a crucial part of the communication.


**4. Event Information:**

* **`event type` (opcode: `lastEventType`):** Returns the type of the last event received from the channel.  Returns an empty string if no event has been received or if no channel is joined.
* **`data of event` (opcode: `lastEventData`):** Returns the data associated with the most recently received event.  Returns an empty string if no event has been received or if no channel is joined.


## How to Use in Xcratch

This extension can be used with other extension in [Xcratch](https://xcratch.github.io/). 
1. Open [Xcratch Editor](https://xcratch.github.io/editor)
2. Click 'Add Extension' button
3. Select 'Extension Loader' extension
4. Type the module URL in the input field 
```
https://yokobond.github.io/xcx-browser-channel/dist/xcxBrowserChannel.mjs
```
5. Click 'OK' button
6. Now you can use the blocks of this extension


## Development

### Install Dependencies

```sh
npm install
```

### Setup Development Environment

Change ```vmSrcOrg``` to your local ```scratch-vm``` directory in ```./scripts/setup-dev.js``` then run setup-dev script to setup development environment.

```sh
npm run setup-dev
```

### Bundle into a Module

Run build script to bundle this extension into a module file which could be loaded on Xcratch.

```sh
npm run build
```

### Watch and Bundle

Run watch script to watch the changes of source files and bundle automatically.

```sh
npm run watch
```

### Test

Run test script to test this extension.

```sh
npm run test
```


## 🏠 Home Page

Open this page from [https://yokobond.github.io/xcx-browser-channel/](https://yokobond.github.io/xcx-browser-channel/)


## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/yokobond/xcx-browser-channel/issues). 
