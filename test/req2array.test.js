var assert = require('assert');

describe('req2array', function() {
    var req2array = require('../lib/req2array.js');

    it('should parse and return a good object from multiple sources', function(done) {
        var route = {
            path: '/product/:id',
            method: 'post',
            params: {
                id: {
                    type: 'int',
                    required: true,
                    from: 'params',
                },
                name: {
                    type: 'string',
                    required: true,
                    from: 'body',
                },
                type: {
                    type: 'string',
                    required: true,
                    values: ['appartement', 'maison'],
                    from: 'body',
                },
                nbRoom: {
                    type: 'int',
                    required: false,
                    default: 1,
                    min: 0,
                    from: 'body',
                }
            },
        };
        var req = {
            params: {id: '1'},
            query: {},
            body: {name: 'raf', type: 'appartement'},
        };

        req2array(req, route, function(err, data) {
            assert.ifError(err);
            assert.equal(data.id, 1);
            assert.equal(data.name, 'raf');
            assert.equal(data.type, 'appartement');
            assert.equal(data.nbRoom, 1);
            done();
        });
    });

    it('should fail because field name is required', function(done) {
        var route = {
            path: '/product',
            method: 'post',
            params: {
                name: {
                    type: 'string',
                    required: true,
                    from: 'body',
                },
            },
        };
        var req = {
            query: {},
            body: {},
        };

        req2array(req, route, function(err, data) {
            assert.ok(err);
            done();
        });
    });
});