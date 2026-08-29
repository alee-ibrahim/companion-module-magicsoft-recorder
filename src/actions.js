import { CHOICES_ENCODER, CHOICES_VIDEO_MODE, getChannelChoices } from './constants.js'
import { getChannelStatus } from './api.js'

export function getActions(self) {
	const channelChoices = getChannelChoices(self.config.channels || 4)

	const channelOption = {
		type: 'dropdown',
		id: 'ch',
		label: 'Channel',
		default: '0',
		choices: channelChoices,
	}

	return {
		rec_start: {
			name: 'Recording: Start',
			options: [
				channelOption,
				{
					type: 'textinput',
					id: 'recname',
					label: 'Recording Name',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action) => {
				const recname = await self.parseVariablesInString(action.options.recname || '')
				await self.sendCommand('recording/rec', { channel: action.options.ch, recname })
			},
		},

		rec_stop: {
			name: 'Recording: Stop',
			options: [channelOption],
			callback: async (action) => {
				await self.sendCommand('recording/stop', { channel: action.options.ch })
			},
		},

		rec_toggle: {
			name: 'Recording: Toggle (Start/Stop)',
			description:
				'Starts recording if the channel is idle, stops it if it is already recording. ' +
				'Uses the live channel status to decide.',
			options: [
				channelOption,
				{
					type: 'textinput',
					id: 'recname',
					label: 'Recording Name (used when starting)',
					default: '',
					useVariables: true,
				},
			],
			callback: async (action) => {
				const ch = action.options.ch
				// Prefer the freshly polled cache; fall back to a live query so
				// toggling works even when polling is disabled.
				let isRecording
				const cached = self.channelStatus?.[Number(ch)]
				// The API reports recording as 1/0; use the polled cache when
				// present, otherwise query live so toggling works without polling.
				if (cached && cached.recording !== undefined) {
					isRecording = !!cached.recording
				} else {
					const live = await getChannelStatus(self, ch)
					isRecording = !!(live && live.recording)
				}

				if (isRecording) {
					await self.sendCommand('recording/stop', { channel: ch })
				} else {
					const recname = await self.parseVariablesInString(action.options.recname || '')
					await self.sendCommand('recording/rec', { channel: ch, recname })
				}
			},
		},

		rec_split: {
			name: 'Recording: Split',
			options: [channelOption],
			callback: async (action) => {
				await self.sendCommand('recording/split', { channel: action.options.ch })
			},
		},

		rec_mark: {
			name: 'Recording: Mark',
			options: [channelOption],
			callback: async (action) => {
				await self.sendCommand('recording/mark', { channel: action.options.ch })
			},
		},

		rec_time: {
			name: 'Recording: Add Time',
			options: [
				channelOption,
				{
					type: 'number',
					id: 'time',
					label: 'Time to add (seconds)',
					min: 0,
					max: 86400,
					default: 10,
					required: true,
				},
			],
			callback: async (action) => {
				await self.sendCommand('recording/time/add', {
					channel: action.options.ch,
					time: action.options.time,
				})
			},
		},

		rec_preset: {
			name: 'Recording: Set Preset',
			options: [
				channelOption,
				{
					type: 'dropdown',
					id: 'encoder',
					label: 'Encoder',
					default: '0',
					choices: CHOICES_ENCODER,
				},
				{
					type: 'dropdown',
					id: 'video_mode',
					label: 'Video Mode',
					default: '-1',
					choices: CHOICES_VIDEO_MODE,
				},
				{
					type: 'number',
					id: 'preset',
					label: 'Preset Index',
					min: 0,
					max: 100,
					default: 0,
					required: true,
					tooltip: 'Index into the channel presets array (see the recording/status response).',
				},
			],
			callback: async (action) => {
				await self.sendCommand('recording/preset', {
					channel: action.options.ch,
					encoder: action.options.encoder,
					videomode: action.options.video_mode,
					preset: action.options.preset,
				})
			},
		},

		videohub_change: {
			name: 'Video Hub: Change Channel',
			options: [
				{
					type: 'number',
					id: 'index',
					label: 'Video Hub Channel Index',
					min: 0,
					max: 100,
					default: 0,
					required: true,
					tooltip: 'Index into the video_hub_channels array (see the recording/status response).',
				},
			],
			callback: async (action) => {
				await self.sendCommand('videohub/change', { index: action.options.index })
			},
		},
	}
}
