import { InstanceBase, InstanceStatus, runEntrypoint } from '@companion-module/base'
import { getConfigFields } from './src/config.js'
import { getActions } from './src/actions.js'
import { getFeedbacks } from './src/feedbacks.js'
import { getPresets } from './src/presets.js'
import { getVariableDefinitions, updateVariableValues } from './src/variables.js'
import { pollStatus, sendCommand, startPolling, stopPolling } from './src/api.js'

class MagicSoftRecorderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
		// Latest polled status, indexed by channel number.
		this.channelStatus = []
	}

	async init(config) {
		this.config = config
		this.updateStatus(InstanceStatus.Connecting)

		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()
		this.updateVariableValues()

		if (this.config.host) {
			startPolling(this)
			if (!this.config.polling) {
				// Without polling we still confirm reachability once.
				this.pollStatus().catch(() => {})
			}
		} else {
			this.updateStatus(InstanceStatus.BadConfig, 'No host configured')
		}
	}

	async destroy() {
		stopPolling(this)
	}

	async configUpdated(config) {
		this.config = config
		// Channel count / feedback options can change, so rebuild everything.
		this.updateActions()
		this.updateFeedbacks()
		this.updatePresets()
		this.updateVariableDefinitions()
		this.updateVariableValues()

		if (this.config.host) {
			startPolling(this)
		} else {
			stopPolling(this)
			this.updateStatus(InstanceStatus.BadConfig, 'No host configured')
		}
	}

	getConfigFields() {
		return getConfigFields()
	}

	// --- helpers wired to the api layer --------------------------------------
	sendCommand(path, params) {
		return sendCommand(this, path, params)
	}

	pollStatus() {
		return pollStatus(this)
	}

	// --- definition refreshers -----------------------------------------------
	updateActions() {
		this.setActionDefinitions(getActions(this))
	}

	updateFeedbacks() {
		this.setFeedbackDefinitions(getFeedbacks(this))
	}

	updatePresets() {
		this.setPresetDefinitions(getPresets(this))
	}

	updateVariableDefinitions() {
		this.setVariableDefinitions(getVariableDefinitions(this))
	}

	updateVariableValues() {
		updateVariableValues(this)
	}
}

runEntrypoint(MagicSoftRecorderInstance, [])
