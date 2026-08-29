import { combineRgb } from '@companion-module/base'
import { getChannelChoices } from './constants.js'

const white = combineRgb(255, 255, 255)
const black = combineRgb(0, 0, 0)
const red = combineRgb(200, 0, 0)
const green = combineRgb(0, 150, 0)
const amber = combineRgb(180, 120, 0)

export function getFeedbacks(self) {
	const channelChoices = getChannelChoices(self.config.channels || 4)
	const channelOption = {
		type: 'dropdown',
		id: 'ch',
		label: 'Channel',
		default: '0',
		choices: channelChoices,
	}

	const statusFor = (channel) => self.channelStatus?.[Number(channel)]

	return {
		recording: {
			type: 'boolean',
			name: 'Channel is recording',
			description: 'Change the button style while the selected channel is recording',
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [channelOption],
			callback: (feedback) => {
				return !!statusFor(feedback.options.ch)?.recording
			},
		},

		any_recording: {
			type: 'boolean',
			name: 'Any channel is recording',
			description: 'Change the button style while at least one channel is recording',
			defaultStyle: {
				bgcolor: red,
				color: white,
			},
			options: [],
			callback: () => {
				return (self.channelStatus || []).some((c) => c && c.recording)
			},
		},

		channel_enabled: {
			type: 'boolean',
			name: 'Channel is enabled',
			description: 'Change the button style when the selected channel is enabled in the Recorder',
			defaultStyle: {
				bgcolor: green,
				color: white,
			},
			options: [channelOption],
			callback: (feedback) => {
				return !!statusFor(feedback.options.ch)?.enabled
			},
		},

		channel_remote: {
			type: 'boolean',
			name: 'Channel is remote-controlled',
			description: 'Active when the selected channel is currently being controlled through web',
			defaultStyle: {
				bgcolor: amber,
				color: white,
			},
			options: [channelOption],
			callback: (feedback) => {
				return !!statusFor(feedback.options.ch)?.remote
			},
		},

		channel_forbidden: {
			type: 'boolean',
			name: 'Channel is forbidden',
			description: 'Active when the selected channel is forbidden to be controlled through web',
			defaultStyle: {
				bgcolor: black,
				color: red,
			},
			options: [channelOption],
			callback: (feedback) => {
				return !!statusFor(feedback.options.ch)?.forbidden
			},
		},
	}
}
