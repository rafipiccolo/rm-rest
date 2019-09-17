var assert = require('assert');

describe('sanitize', function() {
    var sanitize = require('../lib/sanitize.js');
    
    var tests = [
        { value: '2', result: 2, param: { type: 'int' } },
        { value: 2, result: 2, param: { type: 'int' } },
        { value: ' 2 ', result: 2, param: { type: 'int' } },
        { value: ' 2 ', result: 2, param: { type: 'int' } },
        { value: '0621566778', result: '33621566778', param: { type: 'phone' } },
        { value: '33621566778', result: '33621566778', param: { type: 'phone' } },
        { value: '+336.21.56.67.78', result: '33621566778', param: { type: 'phone' } },
        { value: '0033621566778', result: '33621566778', param: { type: 'phone' } },
        { value: '18:00:00', result: '18:00:00', param: { type: 'time' } },
        { value: '18:00', result: '18:00:00', param: { type: 'time' } },
        { value: 'true', result: true, param: { type: 'bool' } },
        { value: true, result: true, param: { type: 'bool' } },
        { value: 1, result: true, param: { type: 'bool' } },
        { value: false, result: false, param: { type: 'bool' } },
        { value: 'false', result: false, param: { type: 'bool' } },
        { value: 0, result: false, param: { type: 'bool' } },
        { value: '18', result: 18, param: { type: 'int' } },
        { value: '18.1', result: 18, param: { type: 'int' } },
        { value: '18', result: 18, param: { type: 'number' } },
        { value: '18.1', result: 18.1, param: { type: 'number' } },
        { value: 'test.test@test.com', result: 'test.test@test.com', param: { type: 'email' } },
        { value: 'test', result: 'test', param: { type: 'text', values: ['test', 'other'] } },
        // cas avec erreur
        { value: 'fail', err: true, param: { type: 'text', values: ['test', 'other'] } },
    ];
    tests.forEach(function(test) {
        it('should parse ' + JSON.stringify(test.value) + ' => ' + JSON.stringify(test.result) + ' with ' + JSON.stringify(test.param), function (done) {
            sanitize(test.value, test.param, function (err, result) {
                if (test.err) {
                    assert.ok(err);
                }
                else {
                    assert.ifError(err);
                    assert.equal(result, test.result);    
                }
                done();
            });
        });
    });

    var tests = [
        { value: '2019-08-01 18:50:50', result: new Date('2019-08-01 18:50:50'), param: { type: 'datetime' } },
        { value: '2019-08-01 18:50', result: new Date('2019-08-01 18:50:00'), param: { type: 'datetime' } },
    ];
    tests.forEach(function (test) {
        it('should parse ' + JSON.stringify(test.value) + ' => ' + JSON.stringify(test.result) + ' with ' + JSON.stringify(test.param), function (done) {
            sanitize(test.value, test.param, function (err, result) {
                assert.ifError(err);
                assert.equal(result.getTime(), test.result.getTime());
                done();
            });
        });
    });
});
