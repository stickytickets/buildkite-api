var reqwest = require("reqwest");

var apiUrl = '';
var accessToken = '';

var BuidlKiteApi = exports = module.exports = function (options) {
  
  opts = options || {};
  this.options = options;
  accessToken = opts.accessToken
  apiUrl = opts.apiUrl || 'https://api.buildkite.com/v2/'

  this.builds = new Builds(options);
  this.organizations = new Organizations(options);
}

var Builds = function(options) {
	
	return {
		create: function(pipeline, data) {
			return createApiRequest('organizations/' + options.organization + '/pipelines/' + pipeline + '/builds',  data, 'POST');
		},
		get: function (pipeline, number) {
			return createApiRequest('organizations/' + options.organization + '/pipelines/' + pipeline + '/builds/' + number);
		},
		cancel: function(pipeline, number) {
			return createApiRequest('organizations/' + options.organization + '/pipelines/' + pipeline + '/builds/' + number + '/cancel');
		},
		all: function () {
			return createApiRequest('builds');
		}
	}
}

var Organizations = function(options) {

	return {
		all: function(){
			return createApiRequest('organizations');
		},
		get: function () {
			return createApiRequest('organizations/' + options.organization);
		},
		builds: function () {
			return createApiRequest('organizations/' + options.organization + '/builds');
		}
	}
}

function createApiRequest(endpoint, data, verb) {
	var buildkiteApiUrl = apiUrl + (endpoint || '') + '?access_token=' + (accessToken || '');
	return reqwest({
		url: buildkiteApiUrl,
		type: 'json',
		method: verb || 'GET',
		data : JSON.stringify(data)
	})
}
