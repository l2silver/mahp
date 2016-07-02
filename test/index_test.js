// @flow
import test from 'tape'
import mahp, {resourceTypes, whichResources, verify, getConfig, verifyConfig} from './../src'
const ajaxMethods = ['show', 'index', 'update', 'store', 'delete']
const allMethods = ['create', 'edit', 'show', 'index', 'update', 'store', 'delete']
const routesObjectExpected =  {
	show: { config: {}, handler: 'show', method: 'GET', path: '/examples/{id}' },
	index: { config: {}, handler: 'index', method: 'GET', path: '/examples' },
	edit: { config: {}, handler: 'edit', method: 'GET', path: '/examples/{id}/edit' },
	create: { config: {}, handler: 'create', method: 'GET', path: '/examples/create' },
	update: { config: {}, handler: 'update', method: 'PUT', path: '/examples/{id}' },
	delete: { config: {}, handler: 'delete', method: 'DELETE', path: '/examples/{id}' },  
	store: { config: {}, handler: 'store', method: 'POST', path: '/examples' }
}
const ajax = false
const controller = allMethods.reduce((ExampleController, action)=>{
	ExampleController[action] = action
	return ExampleController
},{})
const name = 'examples'
test('mahp verify', function (st) {
		st.plan(4)
		st.equal(typeof mahp, 'function');
		st.throws(()=>verify(), /You must include the resource's properties/, 'no properties')
		st.throws(()=>verify({}), /You must include a controller property/, 'no controller property')
		st.throws(()=>verify({controller}), /You must include a controller name/, 'no controller name')
	})
test('mahp whichResources', function (st) {
		st.plan(4)
		st.equal(typeof whichResources, 'function')
		st.deepEqual(whichResources(['store']), ['store'])
		st.deepEqual(whichResources(undefined, true), ajaxMethods)
		st.deepEqual(whichResources(undefined, false), allMethods)
	})
test('mahp resourceTypes', (st)=>{
		st.plan(3)
		st.equal(typeof resourceTypes, 'function')
		st.deepEqual(resourceTypes(false), allMethods)
		st.deepEqual(resourceTypes(), ajaxMethods)
	})
test('mahp getConfig', (st)=>{
		st.plan(3)
		st.equal(typeof getConfig, 'function')
		const nullConfig = getConfig(undefined, 'globals');
		st.deepEqual(nullConfig, {})
		const tag = 'api'
		const config = getConfig({tag})
		st.deepEqual(config, {tag})
	})
test('mahp verifyConfig', (st)=>{
		st.plan(2)
		st.equal(typeof verifyConfig, 'function')
		st.throws(()=>verifyConfig('string', 'globals'), /globals property must be an object/, 'wrong config type')
		//st.throws(()=>verifyConfig([], 'globals'), /globals property cannot be an array/, 'wrong object type')
	})
test('mahp success ajax false', (st)=>{
	st.plan(7)
	const routes = mahp({controller, name, ajax})
	const routesObject = routes.reduce((routesObject, route)=>{
		routesObject[route.handler] = route
		return routesObject
	}, {})
	allMethods.forEach(method=>{
		st.deepEqual(routesObject[method], routesObjectExpected[method])
	});
})
test('mahp success ajax true', (st)=>{
	st.plan(7)
	const routes = mahp({controller, name})
	const routesObject = routes.reduce((routesObject, route)=>{
		routesObject[route.handler] = route
		return routesObject
	}, {})
	ajaxMethods.forEach(method=>{
		st.deepEqual(routesObject[method], routesObjectExpected[method])
	})
	const routesNotCalled = ['edit', 'create']
	routesNotCalled.forEach(method=>{
		st.equal(routesObject[method], undefined)
	})
})
test('mahp success globals set', (st)=>{
	st.plan(5)
	const globals = {globalConfigs: 'globalConfigs'}
	const routes = mahp({controller, name, globals})
	const routesObject = routes.reduce((routesObject, route)=>{
		routesObject[route.handler] = route
		return routesObject
	}, {})
	ajaxMethods.forEach(method=>{
		const expectedWithGlobals = Object.assign({}, routesObjectExpected[method], {config: globals})
		st.deepEqual(routesObject[method], expectedWithGlobals)
	})
})
test('mahp success globals set and specific config', (st)=>{
	st.plan(1)
	const globals = {globalConfigs: 'globalConfigs'}
	const show = {specificConfigs: 'specificConfigs'}
	const routes = mahp({controller, name, globals, show})
	const routesObject = routes.reduce((routesObject, route)=>{
		routesObject[route.handler] = route
		return routesObject
	}, {})
	const config = Object.assign({}, globals, show)
	const expectedRoute = Object.assign({}, routesObjectExpected.show, {config})
	st.deepEqual(routesObject.show, expectedRoute)
})