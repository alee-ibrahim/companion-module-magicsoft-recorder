# companion-module-magicsoft-recorder

Bitfocus Companion module for [MagicSoft Recorder](https://magicsoft.tv/recorder.html),
controlling it over its HTTP/REST protocol. See [companion/HELP.md](companion/HELP.md)
for usage and the full list of actions, feedbacks, variables and presets.

## Features

- Start / Stop / **Toggle** / Split / Mark recordings per channel
- Set preset (encoder / video mode / preset index) and add time
- Video Hub channel change
- **Live recording feedback** — buttons turn red while a channel is recording
- **Status variables** — recording name, status text, elapsed/remaining timecode, marks count, per-channel state
- **Presets** — toggle-record buttons whose colour follows the live recording state, plus time, start/stop/split/mark

## Development

```
yarn install
yarn build
```

Point Companion at this folder as a developer module (Settings → Developer modules path).

## Changelog

**v2.0.0**

- Migrated from the legacy `instance_skel` API to `@companion-module/base` (Companion v3+)
- Added recording status polling via the `recording/status` REST endpoint
- Added Toggle Record action and per-channel recording feedback
- Added status variables and status-aware presets
- Configurable channel count and poll interval

**v1.0.0**

- Cleaned up before inclusion into the core

**V0.0.1–V0.4**

- Added all main commands as simple commands (no preset/feedbacks)
- Added presets for all current commands
- Added all video modes to the dropdown
