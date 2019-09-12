var express = require('express');

module.exports = function(options) {
    var router = express.Router();
    
    // default    
    router.use(express.json());
    router.use(express.urlencoded({ extended: true }));

    var methodOverride = require('method-override');
    router.use(methodOverride('X-HTTP-Method-Override'));

    var logger = options.logger;
    documentation(router, logger);
    routes(router, logger, options.commandsDir);
        
    return router;
}

// API documentation
function documentation(router, logger) {
    router.get('/', function (req, res, next) {
        res.sendFile(__dirname + '/public/documentation.html');
    });
    router.get('/readme.html', function (req, res, next) {
        res.sendFile(__dirname + '/public/readme.html');
    });
}

// get API spec
function routes(router, logger, commandsDir) {
    var getApiData = require('./lib/getApiData.js');
    
    // if (!commandsDir) return;
    var apis = getApiData(commandsDir);

    router.get('/api.json', function (req, res, next) {
        res.send(apis);
    });

    var increment = function(route, field) {
        route[field] = (route[field] || 0) + 1;
    };
    var timerStart = function(req) {
        req.start = process.hrtime();
    };
    var timerEnd = function(req, route) {
        var diff = process.hrtime(req.start);
        var ms = diff[0]*1000+diff[1]/1000000;
        // met le resultat dans un tableau (n'en garde que X à la fois) puis calcule des stats
        route.mss = route.mss || [];
        if (route.mss.length >= 10) route.mss.shift();
        route.mss.push(ms);
        var stats = require('arraystat')(route.mss);
        route.msMin = stats.min;
        route.msMax = stats.max;
        route.msAvg = parseInt(stats.avg);
        return ms;
    };

    // pour chaque route de l'api
    Object.keys(apis).forEach(function(routeName) {
        var {path, method, handler} = apis[routeName];

        // on enregistre la route dans express
        logger.info('registering ' + method + ' ' + routeName + ' at '+path, {type: 'express'});
        router[method](path, function(req, res, next) {

            // on genere un id de requete
            req.id = req.headers['x-request-id'] || require('crypto').randomBytes(16).toString('hex');

            logger.info(req.method+' '+path, {type: 'express', reqId: req.id});
            
            // on parse les parametres
            increment(apis[routeName], 'nb');
            require('./lib/req2array.js')(req, apis[routeName], function(err, params) {
                if (err) increment(apis[routeName], 'nbErrParams');
                if (err) return next(err);
                
                // on execute la fonction
                timerStart(req);
                handler(params, function(err, data) {
                    var ms = timerEnd(req, apis[routeName]);
                    if (err) increment(apis[routeName], 'nbErrHandler');
                    if (err) return next(err);
                    
                    // on renvoie le résultat
                    res.send(data);
                    logger.info('response 200 '+JSON.stringify(data).length+' bytes '+ms+' ms', {type: 'express', reqId: req.id});
                });
            });
        });    
    });


    // default and errors manager
    router.use(function(req, res, next) {
        var err = new Error('Page not found '+req.url);
        err.code = 'NOTFOUND';
        err.status = 404;
        err.path = req.url;
        next(err);
    });

    router.use(function(err, req, res, next) {
        err.status = err.status || 500;
        logger.error('response '+err.status, {
            type: 'express',
            reqId: req.id,
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            err: err,
            url: req.originalUrl,
        });

        res.status(err.status).send({
            code: err.code,
            message: err.message,
        });
    });
}