//
// converti req en un objet qui satisfait les règles de la route actuelle.
// 
// En gros on teste chaque parametres un à un
// voici un exemple de regles qui est appliqué :
//
// var param = nbRoom: {
//     type: 'int',
//     describe: 'Nombre de chambres',
//     required: false,
//     default: 1,
//     min: 0,
// }
//
var sanitize = require('./sanitize.js');
var AppError = require('./AppError.js');
var async = require('async');

module.exports = function req2array(req, route, callback) {
    var obj = {};

    async.map(Object.keys(route.params), function(name, ac) {
        var param = route.params[name];

        // récupère la valeur depuis le get ou le body selon le from qui a été spécifié
        if (!param.from) return callback(new AppError('NEEDFROM', 'please specify params["'+name+'"]["from"] = (body/params/query)', {path: name}));

        obj[name] = req[param.from][name];
        
        // clean
        sanitize(obj[name], param, function(err, value) {
            if (err) return ac(err);
            
            obj[name] = value;
            ac();
        });
    }, function(err){
        if (err) return callback(err);
        
        // renvoie
        callback(null, obj);
    });
};
