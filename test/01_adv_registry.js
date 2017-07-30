var ADXAdvertiserRegistry = artifacts.require("./ADXAdvertiserRegistry.sol");
var Promise = require('bluebird')
var time = require('../helpers/time')

contract('ADXAdvertiserRegistry', function(accounts) {
	var accOne = web3.eth.accounts[0]
	var wallet = web3.eth.accounts[8]


	var advRegistry 

	it("initialize contract", function() {
		return ADXAdvertiserRegistry.new().then(function(_advRegistry) {
			advRegistry = _advRegistry
		})
	});

	it("can't register a campaign w/o being an advertiser", function() {
		return new Promise((resolve, reject) => {
			advRegistry.registerCampaign(0, "test campaign", "{}", {
				from: accOne,
				gas: 130000
			}).catch((err) => {
				assert.equal(err.message, 'VM Exception while processing transaction: invalid opcode')
				resolve()
			})
		})
	});

	it("can't register an ad unit w/o being an advertiser", function() {
		return new Promise((resolve, reject) => {
			advRegistry.registerAdUnit(0, 0, [], [], {
				from: accOne,
				gas: 130000
			}).catch((err) => {
				assert.equal(err.message, 'VM Exception while processing transaction: invalid opcode')
				resolve()
			})
		})
	})


	it("can't register as an advertiser w/o a wallet", function() {
		return new Promise((resolve, reject) => {
			advRegistry.registerAsAdvertiser("stremio", 0, "{}", {
				from: accOne,
				gas: 130000
			}).catch((err) => {
				assert.equal(err.message, 'VM Exception while processing transaction: invalid opcode')
				resolve()
			})
		})
	})

	it("can register as an advertiser", function() {
		return advRegistry.registerAsAdvertiser("stremio", wallet, "{}", {
			from: accOne,
			gas: 130000
		}).then(function(res) {
			var ev = res.logs[0]
			if (! ev) throw 'no event'
			assert.equal(ev.event, 'LogAdvertiserRegistered')
			assert.equal(ev.args.addr, accOne)
			assert.equal(ev.args.wallet, wallet)
			assert.equal(ev.args.meta, '{}')
		})
	})

	it("can update advertiser info", function() {
		return advRegistry.registerAsAdvertiser("stremio", wallet, '{ "email": "office@strem.io" }', {
			from: accOne,
			gas: 130000
		}).then(function(res) {
			var ev = res.logs[0]
			if (! ev) throw 'no event'
			assert.equal(ev.event, 'LogAdvertiserModified')
			assert.equal(ev.args.addr, accOne)
			assert.equal(ev.args.wallet, wallet)
			assert.equal(ev.args.meta, '{ "email": "office@strem.io" }')
		})
	})
	// can register a new campaign
	// update existing campaign
	// can't update another advertiser's campaign

	// can register an ad unit
	// can update an existing ad unit
	// can't update another advertiser's ad unit
})