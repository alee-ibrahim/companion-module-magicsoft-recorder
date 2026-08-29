## MagicSoft Recorder

Control MagicSoft Recorder over its HTTP/REST protocol, with live recording
status feedback, toggle buttons and status variables.

### Configuration

| Field                     | Description                                                                             |
| ------------------------- | --------------------------------------------------------------------------------------- |
| **Target IP / Host**      | IP address or hostname of the machine running MagicSoft Recorder.                       |
| **HTTP Port**             | The Recorder Web HTTP port (default `8045`, see _Recorder → Settings → Web_).           |
| **Number of Channels**    | How many channels to expose. The REST protocol documents channels `0..3` (4 channels).  |
| **Enable Status Polling** | Poll the Recorder for live status. Required for feedback, toggle buttons and variables. |
| **Poll Interval (ms)**    | How often to poll while polling is enabled (default `1000`).                            |

> **Note:** the control commands (start/stop/split/mark/preset/add time) require
> a **Web License** on the Recorder. Reading status does not.

### Actions

- **Recording: Start** — start a recording on a channel with an optional name (supports variables).
- **Recording: Stop** — stop the recording on a channel.
- **Recording: Toggle (Start/Stop)** — start if idle, stop if already recording. Uses live status to decide.
- **Recording: Split** — split the recording on a channel.
- **Recording: Mark** — place a mark on the recording.
- **Recording: Add Time** — add seconds to the current recording.
- **Recording: Set Preset** — change encoder / video mode / preset index on a channel.
- **Video Hub: Change Channel** — change the selected Video Hub channel by index.

### Feedbacks

- **Channel is recording** — style the button (default red) while a channel is recording.
- **Any channel is recording** — style the button while at least one channel records.
- **Channel is enabled / remote-controlled / forbidden** — reflect the channel's control state.

### Variables

Per channel (`ch1_…`, `ch2_…`, …): `name`, `recording`, `status`, `enabled`,
`remote`, `video_mode`, `time_elapsed`, `time_remaining`, `marks`. Plus a global
`recording_count`.

### Presets

Ready-made buttons per channel: **Toggle Record** (colour follows recording
state), **Rec Time** (elapsed timecode), Start, Stop, Split, Mark, and Add Time.
