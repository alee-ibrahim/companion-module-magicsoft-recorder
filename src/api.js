import { InstanceStatus } from '@companion-module/base'
import { ERROR_MESSAGES } from './constants.js'

// Build a full REST url for the given path (e.g. 'recording/rec') and params.
function buildUrl(self, path, params = {}) {
	const host = (self.config.host || '').trim()
	const port = (self.config.port || '8045').toString().trim()
	const query = new URLSearchParams(params).toString()
	return `http://${host}:${port}/${path}${query ? `?${query}` : ''}`
}

// Turn an API error structure into a readable message.
function describeError(body) {
	if (body && body.error) {
		const known = ERROR_MESSAGES[body.error.code]
		return body.error.message || known || `Error code ${body.error.code}`
	}
	return 'Command was not successful'
}

// Perform a single REST request. Verb is 'GET' or 'POST'. Returns the parsed
// JSON body, or throws on transport/HTTP failure.
async function request(self, verb, path, params = {}) {
	const url = buildUrl(self, path, params)
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 5000)
	try {
		const res = await fetch(url, { method: verb, signal: controller.signal })
		if (!res.ok) {
			throw new Error(`HTTP ${res.status} ${res.statusText}`)
		}
		const text = await res.text()
		return text ? JSON.parse(text) : {}
	} finally {
		clearTimeout(timeout)
	}
}

// Send a control command (POST). Logs and surfaces API-level errors, and marks
// the connection status. Returns true on success.
export async function sendCommand(self, path, params = {}) {
	if (!self.config.host) {
		self.log('warn', 'No host configured; cannot send command')
		return false
	}
	try {
		const body = await request(self, 'POST', path, params)
		// The API reports booleans as 1/0, so an unsuccessful command comes back
		// as success:0 (not false). Treat any falsy, defined success as failure.
		if (body && body.success !== undefined && !body.success) {
			const msg = describeError(body)
			self.log('error', `${path} failed: ${msg}`)
			self.updateStatus(InstanceStatus.UnknownWarning, msg)
			return false
		}
		self.updateStatus(InstanceStatus.Ok)
		// Refresh status quickly so feedback/variables reflect the change.
		self.pollStatus().catch(() => {})
		return true
	} catch (e) {
		self.log('error', `${path} request failed: ${e.message}`)
		self.updateStatus(InstanceStatus.ConnectionFailure, e.message)
		return false
	}
}

// Query the live recording status for a single channel. Returns the channel
// status object, or null on failure. Used by the toggle action so it works
// even when polling is disabled.
export async function getChannelStatus(self, channel) {
	try {
		const body = await request(self, 'GET', 'recording/status', { channel })
		if (body && body.status) {
			// A single-channel request returns a status object (not an array).
			return Array.isArray(body.status) ? body.status[Number(channel)] : body.status
		}
	} catch (e) {
		self.log('debug', `status query failed: ${e.message}`)
	}
	return null
}

// Poll the status of all channels, then update variables and feedbacks.
export async function pollStatus(self) {
	if (!self.config.host) return
	try {
		// A channel value outside 0..3 asks the Recorder for all channels.
		const body = await request(self, 'GET', 'recording/status', { channel: 99 })
		if (!body || !body.status) {
			self.updateStatus(InstanceStatus.UnknownWarning, 'No status returned')
			return
		}
		const list = Array.isArray(body.status) ? body.status : [body.status]
		self.channelStatus = list
		self.updateStatus(InstanceStatus.Ok)
		self.updateVariableValues()
		self.checkFeedbacks(
			'recording',
			'channel_enabled',
			'channel_remote',
			'channel_forbidden',
			'any_recording',
		)
	} catch (e) {
		self.updateStatus(InstanceStatus.ConnectionFailure, e.message)
	}
}

// (Re)start the polling loop based on current config.
export function startPolling(self) {
	stopPolling(self)
	if (!self.config.polling || !self.config.host) return
	const interval = Math.max(250, Number(self.config.pollInterval) || 1000)
	// Prime immediately, then on the interval.
	self.pollStatus().catch(() => {})
	self.pollTimer = setInterval(() => {
		self.pollStatus().catch(() => {})
	}, interval)
}

export function stopPolling(self) {
	if (self.pollTimer) {
		clearInterval(self.pollTimer)
		self.pollTimer = undefined
	}
}
