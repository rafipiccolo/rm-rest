// generate fake data from a params specification
//
// params = {
//     id: {
//         type: 'int',
//         required: true,
//     },
//     name: {
//         type: 'string',
//         required: true,
//     }
// }
module.exports = function mockData(params, callback) {
    var obj = {};

    Object.keys(params).forEach(function(name) {
        var param = params[name];

        if (param.type == 'string') obj[name] = 'Sample text';
        if (param.type == 'int') obj[name] = parseInt(Math.random()*10000);
        if (param.type == 'number') obj[name] = Math.random();
        if (param.type == 'date') obj[name] = new Date();
        if (param.type == 'time') obj[name] = '18:00:00';
        if (param.type == 'datetime') obj[name] = new Date();
        if (param.type == 'email') obj[name] = 'email@email.com';
        if (param.type == 'phone') obj[name] = '0612345678';
        if (param.values) obj[name] = param.values[0];
        if (param.min) obj[name] = param.min;
        if (param.max) obj[name] = param.max;
        if (param.maxlength) obj[name] = obj[name].substr(0, param.maxlength);
        if (param.minlength && obj[name].length < param.minlength) obj[name] = Array(param.minlength).join('x');
    });

    callback(null, obj);
};
