'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (resourceProperties) {
	verify(resourceProperties);
	var resources = whichResources(resourceProperties.only, resourceProperties.ajax);
	var globalConfig = getConfig(resourceProperties.globals, 'globals');
	return resources.map(function (resource) {
		var _resourcesMethodsAndU = resourcesMethodsAndUrl[resource];
		var method = _resourcesMethodsAndU.method;
		var suffix = _resourcesMethodsAndU.suffix;

		var path = '/' + resourceProperties.name + suffix;
		var handler = resourceProperties.controller[resource].handler;
		var validate = resourceProperties.controller[resource].validate;
		var config = Object.assign({}, globalConfig, getConfig(resourceProperties[resource], resource), validate ? { validate: validate } : {});
		return {
			method: method, path: path, handler: handler, config: config
		};
	});
};

exports.verify = verify;
exports.verifyConfig = verifyConfig;
exports.getConfig = getConfig;
exports.whichResources = whichResources;
exports.resourceTypes = resourceTypes;


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

function whichResources(only, ajax) {
	if (only) return only;
	return resourceTypes(ajax);
}

function resourceTypes() {
	var ajax = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

	if (ajax) {
		return ['show', 'index', 'update', 'store', 'delete'];
	}
	return ['create', 'edit', 'show', 'index', 'update', 'store', 'delete'];
}