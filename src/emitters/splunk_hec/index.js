// index.js

const {http} = _g.components;


module.exports = class {
	
	constructor({
		schema = 'https',
		host = '127.0.0.1',
		port = '8088',
		source = 'censys',
		type = '_json',
		default_index = 'main',
		hec_token = '',
		catchErrors = true,
		rootEndpoint = `${schema}://${host}:${port}/services/collector`,
		userAgent = 'censys-api-engine/0.0',
	})

	{
		const httpRequest = catchErrors ? http.tryRequest : http.request;

		let defaultHeaders = {
						'content-type': 'application/json',
						'authorization': `Splunk ${hec_token}`,
						'cache-control': 'no-cache',
						'user-agent': `${userAgent}`,
					};


		this.userAgent = userAgent;

		this.sendEvents = (payload = '') =>
			httpRequest(`${rootEndpoint}`, {
				method: 'POST',
				headers: {...defaultHeaders},
				payload: payload,
				rejectUnauthorized: false,
			});
	}
}
