var yargs = require('yargs');
var BuildKiteApi = require('./buildkite-api');
var fs = require('fs');
var path = require('path');

var camelCased = function(param) {
	return param.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
};

exports.run = function(args) {
	var buidkiteOptions = null

	var buidkiteOptions = null;

	//check for buildkite.json in dir and 3 above
	if (!buidkiteOptions && fs.existsSync('./buildkite.json')) buidkiteOptions = require(path.resolve('./buildkite.json'));
	if (!buidkiteOptions && fs.existsSync('../buildkite.json')) buidkiteOptions = require(path.resolve('../buildkite.json'));
	if (!buidkiteOptions && fs.existsSync('../../buildkite.json')) buidkiteOptions = require(path.resolve('../../buildkite.json'));
	if (!buidkiteOptions && fs.existsSync('../../../buildkite.json')) buidkiteOptions = require(path.resolve('../../../buildkite.json'));

	buidkiteOptions = buidkiteOptions || {};

	var commandHelp = {
		'build': 'create, cancel a buildkite build'
	};

	var describeHelp = {
		'create': 'create or trigger a build',
		'cancel': 'cancel a build',
		'get': 'get a build',
		'message' : 'build message',
		'branch' : 'branch to build',
		'commit' : 'commit to build',
		'build-number': 'build number',
		'pipeline': 'buidkite pipeline slug',
		'organization': 'buildkite organization slug',
		'wait-result': 'wait for the result (success, failed)',
		'env': 'build environment variable e.g "{TEST_VAR:\'Testing\'}"'
	};

	var mainArgs = yargs(args)
	.usage('prazzle <command>')
	.command('build', commandHelp.build)
	.demand(1, 'must provide a valid command');

	var initArgs = function(options, command, keys, required) {

		mainArgs.reset(); //reset and start parsing again.

		var required = required || [];

		var keyDescriptions = {};

		keys.forEach(function(key) {
			keyDescriptions[key] = describeHelp[key];
		})

		var packageArgs = yargs
		.usage('\n* ' + commandHelp[command])
		.describe(keyDescriptions)
		.help();

		if (required) packageArgs.demand(required);

		var args = packageArgs.argv;
		//console.log('test',args);
		var showHelp = false;

		keys.forEach(function(key) {
			var prop = camelCased(key);
			options[prop] = args[key] || buidkiteOptions[key];
			if (!options[prop] && required.indexOf(key) >= 0) {
				console.warn('Missing required property for: ' + prop);
				showHelp = true;
				process.exit();
			}
		})

		if (showHelp) {
			packageArgs.showHelp();
		}

		return options;
	};

	
	var mainArgs = yargs(args)
	var command = mainArgs.argv._[0];
	var buildkite = new BuildKiteApi(buidkiteOptions);
	switch (command) {
		case 'build':
		var options = { };
		initArgs(options, 'build', ['build-param','access-token','organization','pipeline','message', 'branch', 'commit', 'create', 'get','build-number','list', 'wait-result', 'env']);
		console.log('creating build...');
		require('./build.js').run(options);
		return;
	}
}