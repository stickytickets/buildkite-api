var BuildKiteApi = require('./buildkite-api.js');

exports.run = function(options) {
	var buildKiteOptions = {
		accessToken: options.accessToken,
		organization: options.organization
	}

	var buildParamsDefault = {}
	if(options.buildParam){
		buildParamsDefault = options.buildParam;				
	}

	var env =  null;
	if(options.env) {
		env	= JSON.parse(options.env.replace(/\'/g,'"'));
	}
	 
	var buildOptions = {
		message: options.message,
		commit: options.commit || buildParamsDefault.commit || 'HEAD',
		branch: options.branch || buildParamsDefault.branch ||'master',
		env:  env || buildParamsDefault.env 
	}

	var buildkite = new BuildKiteApi(buildKiteOptions);

	if(options.create)
	{
		var buildNumber = null;
		var readyToCheck = false;
		var interval = null	

		buildkite.builds.create(options.pipeline, buildOptions).then(data => {
				buildNumber = data.number;
			}).catch(err => {
				console.log(err);
				
				if(!interval) {
					clearInterval(interval);
				}

				throw 'Error on buildkite'
		});

		if(options.waitResult){
			interval = setInterval(function(){
				if (!buildNumber) return;

				if(!readyToCheck) {
					readyToCheck = true;
					console.log('checking build number ' + buildNumber + ' state');

					buildkite.builds.get(options.pipeline, buildNumber).then(data => {
						var state = data.state;
						console.log('current build state: ' + state);

						if(state !== 'scheduled' && state !== 'running'){
							clearInterval(interval)
						} 
						else {
							readyToCheck = false;
						}
					}).catch(err => {
						console.log(err);
						throw err.response.statusText;
						clearInterval(interval);
					})
				}
			}, 10000); 
		}
	}
}