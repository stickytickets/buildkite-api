var BuildKiteApi = require('./lib/buildkite-api.js')

var buildkite = new BuildKiteApi({
	'accessToken' : 'd070436198e511230ae6dfbe90b35ea163116456',//'c3ff54a8739168cdb4e46ebc0034e8fa54f0dd3b',
	'organization': 'sticky-tickets-pty-ltd'//'wilson-banta'
});

/*
buildkite.builds.create('web-deploy-develop',{ "message" : "testing api", "commit" : "HEAD", "branch" : "master"})
	.then(data => {
		console.log(data);
	})
	.catch(err=> {
		//throw 'Error'
		console.log(err);
	});
*/
buildkite.builds.get('web-deploy-develop', '73')
	.then((data) => {
		console.log(data);
	})
	.catch(err=> {
		console.log(err);
		//throw 'Error';
	});
