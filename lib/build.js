var BuildKiteApi = require('./buildkite-api.js');

exports.run = function(options) {
	var buildKiteOptions = {
		accessToken: options.accessToken,
		organization: options.organization
	}

	var buildOptions = {
		message: options.message,
		commit: options.commit || 'HEAD',
		branch: options.branch || 'master'
	}

	var buildkite = new BuildKiteApi(buildKiteOptions);

	if(options.create)
	{
		var buildNumber = null;
		var readyToCheck = false;
		var interval = null	
		buildkite.builds.create(options.pipeline, buildOptions).then(data => {
				console.log(data);
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
							console.log(data);
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
			}, 2000); 
		}
		
	}
}