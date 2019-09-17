var assert = require('assert');

describe('mockData', function() {
    var mockData = require('../lib/mockData.js');

    it('should create fake data', function() {
        mockData({
            id: {
                type: 'int',
                required: true,
            },
            name: {
                type: 'string',
                required: true,
            },
            type: {
                type: 'string',
                required: true,
                values: ['appartement', 'maison'],
            },
            nbRoom: {
                type: 'int',
                required: false,
                default: 1,
                min: 0,
            }
        }, function(err, params) {
            assert.ifError(err);
            assert.equal(typeof params.id, 'number');
            assert.equal(typeof params.name, 'string');
            assert.equal(typeof params.type, 'string');
            assert.equal(typeof params.nbRoom, 'number');
        });
    });
});
