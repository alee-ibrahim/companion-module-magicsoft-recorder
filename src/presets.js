import { combineRgb } from '@companion-module/base'
import { getChannelChoices, CHOICES_REC_TIME } from './constants.js'

const white = combineRgb(255, 255, 255)
const black = combineRgb(0, 0, 0)
const red = combineRgb(200, 0, 0)
const darkRed = combineRgb(60, 0, 0)

export function getPresets(self) {
	const presets = {}
	const channels = getChannelChoices(self.config.channels || 4)

	for (const ch of channels) {
		const id = ch.id
		const n = Number(id) + 1

		// --- Toggle record ---------------------------------------------------
		// Stopped: black with "READY". Recording: the feedback flips it red and
		// swaps the text to the live elapsed timecode.
		presets[`toggle_${id}`] = {
			type: 'button',
			category: 'Record Toggle',
			name: `Toggle Record ${ch.label}`,
			style: {
				text: `${ch.label}\\nREADY`,
				size: '14',
				color: white,
				bgcolor: black,
			},
			steps: [
				{
					down: [{ actionId: 'rec_toggle', options: { ch: id, recname: '' } }],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'recording',
					options: { ch: id },
					style: {
						bgcolor: red,
						color: white,
						text: `${ch.label}\\n● $(magicsoft-recorder:ch${n}_time_elapsed)`,
					},
				},
			],
		}

		// --- Elapsed time display (turns red while recording) ----------------
		presets[`time_${id}`] = {
			type: 'button',
			category: 'Record Time',
			name: `Rec Time ${ch.label}`,
			style: {
				text: `${ch.label}\\n$(magicsoft-recorder:ch${n}_time_elapsed)`,
				size: '14',
				color: white,
				bgcolor: black,
			},
			steps: [{ down: [], up: [] }],
			feedbacks: [
				{
					feedbackId: 'recording',
					options: { ch: id },
					style: { bgcolor: darkRed, color: white },
				},
			],
		}

		// --- Discrete Start / Stop / Split / Mark ----------------------------
		presets[`start_${id}`] = simpleButton(ch, 'Recording Start', `Rec Start ${ch.label}`, [
			{ actionId: 'rec_start', options: { ch: id, recname: '' } },
		])
		presets[`start_${id}`].feedbacks = [
			{ feedbackId: 'recording', options: { ch: id }, style: { bgcolor: red, color: white } },
		]

		presets[`stop_${id}`] = simpleButton(ch, 'Recording Stop', `Rec Stop ${ch.label}`, [
			{ actionId: 'rec_stop', options: { ch: id } },
		])

		presets[`split_${id}`] = simpleButton(ch, 'Recording Split', `Rec Split ${ch.label}`, [
			{ actionId: 'rec_split', options: { ch: id } },
		])

		presets[`mark_${id}`] = simpleButton(ch, 'Recording Mark', `Rec Mark ${ch.label}`, [
			{ actionId: 'rec_mark', options: { ch: id } },
		])

		// --- Add time presets ------------------------------------------------
		for (const t of CHOICES_REC_TIME) {
			presets[`addtime_${id}_${t.id}`] = simpleButton(ch, 'Recording Add Time', `${ch.label}\\n+${t.label}`, [
				{ actionId: 'rec_time', options: { ch: id, time: Number(t.id) } },
			])
		}
	}

	return presets
}

function simpleButton(ch, category, text, downActions) {
	return {
		type: 'button',
		category,
		name: text.replace('\\n', ' '),
		style: {
			text,
			size: '14',
			color: white,
			bgcolor: black,
		},
		steps: [
			{
				down: downActions,
				up: [],
			},
		],
		feedbacks: [],
	}
}
