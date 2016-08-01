'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (resourceProperties) {
	verify(resourceProperties);
	var controller = resourceProperties.controller;
	var globals = resourceProperties.globals;
	var name = resourceProperties.name;

	var globalConfig = getConfig(globals, 'globals');
	return Object.keys(resourceProperties.controller).map(function (resource) {
		var _controller$resource = controller[resource];
		var method = _controller$resource.method;
		var suffix = _controller$resource.suffix;

		if (!method) {
			method = resourcesMethodsAndUrl[resource].method;
		}
		if (!suffix) {
			suffix = resourcesMethodsAndUrl[resource].suffix;
		}
		var _controller$resource2 = controller[resource];
		var validate = _controller$resource2.validate;
		var handler = _controller$resource2.handler;


		var config = Object.assign({}, globalConfig, getConfig(resourceProperties[resource], resource), validate ? { validate: validate } : {});

		var path = '/' + name + suffix;

		return {
			method: method, path: path, handler: handler, config: config
		};
	});
};

exports.verify = verify;
exports.verifyConfig = verifyConfig;
exports.getConfig = getConfig;


function toType(obj) {
	return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function verify(resourceProperties) {
	if (!resourceProperties) {
		throw Error('You must include the resource\'s properties');
	}
	if (!resourceProperties.controller) {
		throw Error('You must include a controller property');
	}
	if (!resourceProperties.name) {
		throw Error('You must include a controller name');
	}
}

function verifyConfig(config, type) {
	if (toType(config) !== 'object') {
		throw Error(type + ' property must be an object');
	}
}

function getConfig(config, type) {
	if (config) {
		verifyConfig(config, type);
		return config;
	}
	return {};
}

var resourcesMethodsAndUrl = exports.resourcesMethodsAndUrl = {
	create: { method: 'GET', suffix: '/create' },
	edit: { method: 'GET', suffix: '/{id}/edit' },
	show: { method: 'GET', suffix: '/{id}' },
	index: { method: 'GET', suffix: '' },
	update: { method: 'PUT', suffix: '/{id}' },
	store: { method: 'POST', suffix: '' },
	delete: { method: 'DELETE', suffix: '/{id}' }
};