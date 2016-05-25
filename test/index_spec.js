require("babel-register")
import Lab from 'lab'
import Code from 'code'
import maap, {resourceTypes} from './../src'
const {script} = Lab;
const {expect} = Code;
export var lab = script()
const  {it, describe} = lab

describe('maap', ()=>{
	describe('resourceTypes', ()=>{
		it('returns all resource names', (done)=>{
			expect(resourceTypes(false)).to.equal({
				create: {method: 'GET', suffix: '/create'},
				edit: {method: 'GET', suffix: '/{id}/edit'},
				show: {method: 'GET', suffix: '/{id}'},
				index: {method: 'GET', suffix: ''},
				update: {method: 'PUT', suffix: '/{id}'},
				store: {method: 'POST', suffix: ''},
				delete: {method: 'DELETE', suffix: '/{id}'}
			})
			done()
		})
		it('returns default ajax resource names', (done)=>{
			expect(resourceTypes()).to.equal({
				show: {method: 'GET', suffix: '/{id}'},
				index: {method: 'GET', suffix: ''},
				update: {method: 'PUT', suffix: '/{id}'},
				store: {method: 'POST', suffix: ''},
				delete: {method: 'DELETE', suffix: '/{id}'}
			})
			done()
		})
	})
	
	describe('maap', ()=>{
		it('throws error controller property', (done)=>{
			expect(()=>maap({})).to.throw(Error, 'You must include a controller property')
			done()	
		})
		it('returns x', (done)=>{
			expect(maap({controller: true})).to.equal(1)
			done()	
		})
	})
	
})
