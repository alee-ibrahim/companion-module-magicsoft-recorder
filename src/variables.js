import { formatSeconds, VIDEO_MODE_LABELS, getChannelChoices } from './constants.js'

// Build the list of variable definitions for the configured channels.
export function getVariableDefinitions(self) {
	const channels = getChannelChoices(self.config.channels || 4)
	const defs = [{ variableId: 'recording_count', name: 'Number of channels currently recording' }]

	for (const ch of channels) {
		const n = Number(ch.id) + 1
		defs.push(
			{ variableId: `ch${n}_name`, name: `CH ${n}: Recording name` },
			{ variableId: `ch${n}_recording`, name: `CH ${n}: Recording (true/false)` },
			{ variableId: `ch${n}_status`, name: `CH ${n}: Status text` },
			{ variableId: `ch${n}_enabled`, name: `CH ${n}: Enabled (true/false)` },
			{ variableId: `ch${n}_remote`, name: `CH ${n}: Remote controlled (true/false)` },
			{ variableId: `ch${n}_video_mode`, name: `CH ${n}: Video mode` },
			{ variableId: `ch${n}_time_elapsed`, name: `CH ${n}: Time elapsed (HH:MM:SS)` },
			{ variableId: `ch${n}_time_remaining`, name: `CH ${n}: Time remaining (HH:MM:SS)` },
			{ variableId: `ch${n}_marks`, name: `CH ${n}: Marks count` },
		)
	}

	return defs
}

// Push current values into Companion, derived from the last polled status.
export function updateVariableValues(self) {
	const channels = getChannelChoices(self.config.channels || 4)
	const values = {}
	let recordingCount = 0

	for (const ch of channels) {
		const idx = Number(ch.id)
		const n = idx + 1
		const s = self.channelStatus?.[idx]

		if (s) {
			if (s.recording) recordingCount++
			values[`ch${n}_name`] = s.name ?? ''
			values[`ch${n}_recording`] = s.recording ? 'true' : 'false'
			values[`ch${n}_status`] = s.status_text ?? ''
			values[`ch${n}_enabled`] = s.enabled ? 'true' : 'false'
			values[`ch${n}_remote`] = s.remote ? 'true' : 'false'
			values[`ch${n}_video_mode`] = VIDEO_MODE_LABELS[String(s.video_mode)] ?? String(s.video_mode ?? '')
			values[`ch${n}_time_elapsed`] = formatSeconds(s.time_elapsed)
			values[`ch${n}_time_remaining`] = formatSeconds(s.time_remaining)
			values[`ch${n}_marks`] = s.marks_count ?? 0
		} else {
			values[`ch${n}_name`] = ''
			values[`ch${n}_recording`] = 'false'
			values[`ch${n}_status`] = ''
			values[`ch${n}_enabled`] = 'false'
			values[`ch${n}_remote`] = 'false'
			values[`ch${n}_video_mode`] = ''
			values[`ch${n}_time_elapsed`] = formatSeconds(0)
			values[`ch${n}_time_remaining`] = formatSeconds(0)
			values[`ch${n}_marks`] = 0
		}
	}

	values['recording_count'] = recordingCount
	self.setVariableValues(values)
}
