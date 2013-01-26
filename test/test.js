// Task2Burndown tests
var should = require("should");

// Dependencies
var moment = require("moment");
var t2b = require('../task2burndown');


// Sample dates
var yesterday = moment().subtract('d', 1).format('YYYY-MM-DD');
var today = moment().format('YYYY-MM-DD');
var tomorrow = moment().add('d', 1).format('YYYY-MM-DD');

// Test Data
var data = 
	[{
		date: yesterday,
		effort:  8,
		remaining: 0
	},{
		date: yesterday,
		effort:  1,
		remaining: 0
	},{
		date: today,
		effort:  6,
		remaining: 4
	},{
		date: today,
		effort:  2,
		remaining: 2
	},{
		date: tomorrow,
		effort:  4,
		remaining: 4
	}];

// Expectation
var expect = [];
expect[yesterday] = 21;
expect[today] = 12;
expect[tomorrow] = 4;

// Tests
describe('t2B', function(){
	describe('#setAndGetData', function(){
		it('should set the data in the local db', function(){
			t2b.setData(data);
			data.should.equal(t2b.getData());
		});
	});
	describe('#transform', function(){
		it('should do magic', function(){
			t2b.transform().should.eql(expect);
		});
	});
});
