import { Regex } from '@companion-module/base'

export function getConfigFields() {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				'This module controls MagicSoft Recorder over its HTTP/REST protocol. ' +
				'Enable status polling to get live recording feedback, toggle actions and variables. ' +
				'The Web port defaults to 8045 (see Recorder → Settings → Web).',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP / Host',
			width: 6,
			regex: Regex.IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'HTTP Port',
			width: 3,
			default: '8045',
			regex: Regex.PORT,
		},
		{
			type: 'number',
			id: 'channels',
			label: 'Number of Channels',
			width: 3,
			default: 4,
			min: 1,
			max: 8,
			tooltip: 'The REST protocol documents channels 0..3 (4 channels). Increase if your Recorder exposes more.',
		},
		{
			type: 'checkbox',
			id: 'polling',
			label: 'Enable Status Polling',
			width: 4,
			default: true,
			tooltip: 'Required for recording feedback, toggle buttons and status variables.',
		},
		{
			type: 'number',
			id: 'pollInterval',
			label: 'Poll Interval (ms)',
			width: 4,
			default: 1000,
			min: 250,
			max: 60000,
			isVisible: (config) => !!config.polling,
		},
	]
}
