var AppError = require('./AppError.js');

module.exports = function(value, param, callback) {
    param.name = param.name || 'value';

    // if empty
    if (value === null || value === '' || typeof value === 'undefined') {
        // applique un default
        if (param.default) value = param.default;
        // check required
        if (param.required) return callback(new AppError('REQUIRED', param.name + ' required', {path: param.name}));
    }
    else {
        // check type
        if (param.type == 'bool') {
            if (value === 'true' || value === true || parseInt(value) > 0)
                value = true;
            else if (value === 'false' || value === false || parseInt(value) === 0)
                value = false;
            else return callback(new AppError('NEEDBOOL', param.name + ' must be an boolean (true / false)', {path: param.name}));
        }
        else if (param.type == 'int') {
            value = parseInt(value);
            if (isNaN(value)) return callback(new AppError('NEEDINT', param.name + ' must be an integer', {path: param.name}));
        }
        else if (param.type == 'bearer') {
            var m = value.match(/^Bearer (\w+)$/i);
            if (!m) return callback(new AppError('NEEDBEARER', param.name + ' must be a bearer', {path: param.name}));
            value = m[1];
        }
        else if (param.type == 'number') {
            value = parseFloat(value);
            if (isNaN(value)) return callback(new AppError('NEEDNUMBER', param.name + ' must be an number', {path: param.name}));
        }
        else if (param.type == 'email') {
            value = value + '';
            value = value.trim();
            if (!value.match(/^[\w.]+@[\w.]+$/)) return callback(new AppError('NEEDEMAIL', param.name + ' must be an email', {path: param.name}));
        }
        else if (param.type == 'phone') {
            value = value + '';
            value = value.replace(/[^0-9]/g, '');
            while (value[0] == '0' && value[1] == '0')
                value = value.substr(2);
            if (value[0] == '0' && value[1])
                value = '33'+value.substr(1);
            if (value.length < 10) return callback(new AppError('PHONE', param.name + ' must be a phone number', {path: param.name}));
        }
        else if (param.type == 'date') {
            if (typeof value === 'string') {
                value = value + '';
                value = value.trim();
                value = value.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1');
                value = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
                value = new Date(value);
            }
            if (!(value instanceof Date && !isNaN(value))) return callback(new AppError('NEEDDATE', param.name + ' must be a date', {path: param.name}));
        }
        else if (param.type == 'datetime') {
            if (typeof value === 'string') {
                value = value + '';
                value = value.trim();
                value = value.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1');
                value = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
                value = new Date(value);
            }
            if (!(value instanceof Date && !isNaN(value))) return callback(new AppError('NEEDDATETIME', param.name + ' must be a datetime', {path: param.name}));
        }
        else if (param.type == 'time') {
            if (typeof value === 'string') {
                value = value + '';
                value = value.trim();
                value = value.replace(/^(\d{2}):(\d{2})$/, '$1:$2:00');
            }
            if (!value.match(/^(\d{2}):(\d{2}):(\d{2})$/)) return callback(new AppError('NEEDTIME', param.name + ' must be a time', {path: param.name}));
        }
        else if (param.type == 'string') {
            value = value + '';
        }
    }

    // check min
    if (param.min && value <= param.min) return callback(new AppError('MIN', param.name+' must be >= '+param.min, {path: param.name}));

    // check max
    if (param.max && value <= param.max) return callback(new AppError('MAX', param.name+' must be <= '+param.max, {path: param.name}));

    // check maxlength
    if (param.maxlength && value.length <= param.maxlength) return callback(new AppError('MAXLENGTH', param.name+' length must be <= '+param.maxlength, {path: param.name}));

    // check minlength
    if (param.minlength && value.length >= param.minlength) return callback(new AppError('MINLENGTH', param.name+' length must be >= '+param.minlength, {path: param.name}));

    // check value is one of the authorised values
    if (param.values && param.values.indexOf(value) == -1) return callback(new AppError('UNKNOWNVALUE', param.name+'\'s value must be one of the following '+JSON.stringify(param.values), {path: param.name}));

    callback(null, value);
};
