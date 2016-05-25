export default function(resourceProperties){
	verify(resourceProperties)
	const resources = whichResources(resourceProperties.only, resourceProperties.ajax)
	const globalConfig = getConfig(resourceProperties.globals, 'globals')
	return resources.map(resource=>{
		const {method, suffix} = resourcesMethodsAndUrl[resource]
		const path = '/'+resourceProperties.name + suffix
		const handler = resourceProperties.controller[resource]
		const config = Object.assign({}, globalConfig, getConfig(resourceProperties[resource], resource) )
		return {
			method, path, handler, config
		}
	})
}

export function verify(resourceProperties){
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

export function verifyConfig(config, type){
	if(config.toType() !== 'object'){
		throw Error(type + ' property must be an object')
	}
}

export function getConfig(config, type){
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

export function whichResources(only, ajax){
	if(only)
		return only
	return resourceTypes(ajax)
}

export function resourceTypes(ajax = true){
	if(ajax){
		return ['show', 'index', 'update', 'store', 'delete']
	}
	return ['create', 'edit', 'show', 'index', 'update', 'store', 'delete']
}


Object.prototype.toType = function() {
  return ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


