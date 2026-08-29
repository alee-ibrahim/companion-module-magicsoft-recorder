// Video modes as documented in the MagicSoft Recorder REST protocol.
// The status endpoint only reports 0..5, but the preset command accepts the
// full list, so we keep them all available for the preset action.
export const CHOICES_VIDEO_MODE = [
	{ id: '-1', label: 'Unknown' },
	{ id: '0', label: 'PAL' },
	{ id: '1', label: 'NTSC' },
	{ id: '2', label: 'HD 720p 50' },
	{ id: '3', label: 'HD 720p 59.94' },
	{ id: '4', label: 'HD 1080i 50' },
	{ id: '5', label: 'HD 1080i 59.94' },
	{ id: '6', label: 'HD 1080p 23.98' },
	{ id: '7', label: 'HD 1080p 24' },
	{ id: '8', label: 'HD 1080p 25' },
	{ id: '9', label: 'HD 1080p 50' },
	{ id: '10', label: 'HD 1080p 29.97' },
	{ id: '11', label: 'HD 1080p 59.94' },
	{ id: '12', label: 'HD 1080p 30' },
	{ id: '13', label: 'HD 1080p 60' },
	{ id: '14', label: 'UHD 4K 2160p 23.98' },
	{ id: '15', label: 'UHD 4K 2160p 24' },
	{ id: '16', label: 'UHD 4K 2160p 25' },
	{ id: '17', label: 'UHD 4K 2160p 50' },
	{ id: '18', label: 'UHD 4K 2160p 29.97' },
	{ id: '19', label: 'UHD 4K 2160p 59.94' },
	{ id: '20', label: 'UHD 4K 2160p 30' },
	{ id: '21', label: 'UHD 4K 2160p 60' },
]

// Map of the video mode ids reported by recording/status to a short label,
// used when populating the per-channel video mode variable.
export const VIDEO_MODE_LABELS = Object.fromEntries(CHOICES_VIDEO_MODE.map((m) => [m.id, m.label]))

export const CHOICES_ENCODER = [
	{ id: '0', label: 'Encoder 1' },
	{ id: '1', label: 'Encoder 2' },
]

export const CHOICES_REC_TIME = [
	{ id: '1', label: '1 Sec' },
	{ id: '5', label: '5 Sec' },
	{ id: '10', label: '10 Sec' },
	{ id: '15', label: '15 Sec' },
	{ id: '30', label: '30 Sec' },
	{ id: '60', label: '60 Sec' },
]

// Error codes returned by the REST API (see the protocol PDF, "Errors").
export const ERROR_MESSAGES = {
	1: 'Invalid arguments',
	2: 'Channel is unavailable',
	3: 'No license detected',
	4: 'Could not process request',
}

// Build the channel dropdown choices for the configured number of channels.
// The REST protocol addresses channels by a zero-based index; we label them
// 1-based for humans.
export function getChannelChoices(count) {
	const choices = []
	for (let i = 0; i < count; i++) {
		choices.push({ id: String(i), label: `CH ${i + 1}` })
	}
	return choices
}

// Format a number of seconds as HH:MM:SS, used for the elapsed/remaining
// recording time variables.
export function formatSeconds(totalSeconds) {
	const secs = Math.max(0, Math.floor(Number(totalSeconds) || 0))
	const h = Math.floor(secs / 3600)
	const m = Math.floor((secs % 3600) / 60)
	const s = secs % 60
	const pad = (n) => String(n).padStart(2, '0')
	return `${pad(h)}:${pad(m)}:${pad(s)}`
}
