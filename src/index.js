// @flow

type resourceConfig = Object;
type only = Array<string>;
type ajax = bool;
type name = string;
type resourceProperties = {
	controller: Object;
	name: name;
	ajax?: ajax;
	globals?: resourceConfig;
	index?: resourceConfig;
	show?: resourceConfig;
	delete?: resourceConfig;
	store?: resourceConfig;
	update?: resourceConfig;
	edit?: resourceConfig;
	create?: resourceConfig;
};

function toType(obj){
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

export default function(resourceProperties: resourceProperties){
	verify(resourceProperties);
	const {controller, globals, name} = resourceProperties;
	const globalConfig = getConfig(globals, 'globals')
	return Object.keys(resourceProperties.controller).map(resource=>{
		let {method, suffix} = controller[resource];
		if(!method){
			method = resourcesMethodsAndUrl[resource].method;
		}
		if(!suffix){
			suffix = resourcesMethodsAndUrl[resource].suffix;
		}
		const {validate, handler} = controller[resource];
		const config = Object.assign({}, globalConfig, getConfig(resourceProperties[resource], resource), validate ? {validate} : {})
		const path = '/'+name + suffix
		return {
			method, path, handler, config
		}
	})
}

export function verify(resourceProperties: resourceProperties){
	if(!resourceProperties){
		throw Error('You must include the resource\'s properties')
	}
	if(!resourceProperties.controller){
		throw Error('You must include a controller property')
	}
	if(!resourceProperties.name){
		throw Error('You must include a controller name')
	}
}

export function verifyConfig(config: resourceConfig, type: name){
	if(toType(config) !== 'object'){
		throw Error(type + ' property must be an object')
	}
}

export function getConfig(config: resourceConfig, type: name){
	if(config){
		verifyConfig(config, type)
		return config
	}
	return {}
}

export const resourcesMethodsAndUrl = {
	create: {method: 'GET', suffix: '/create'},
	edit: {method: 'GET', suffix: '/{id}/edit'},
	show: {method: 'GET', suffix: '/{id}'},
	index: {method: 'GET', suffix: ''},
	update: {method: 'PUT', suffix: '/{id}'},
	store: {method: 'POST', suffix: ''},
	delete: {method: 'DELETE', suffix: '/{id}'}
}