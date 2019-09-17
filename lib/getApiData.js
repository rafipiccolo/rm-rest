var fs = require('fs');

// get API spec
module.exports = function getApiData(dir) {
    var apis = require(dir+'/index.js');

    consolidateRoutes(apis);

    return apis;
};

function consolidateRoutes(routes) {
    // foreach route in the api
    for (var routeName in routes) {
        var route = routes[routeName];

        // set name in route data for ez
        route.name = routeName;
        
        // every route has exemple array, even empty
        route.exemples = route.exemples || [];
        
        // every route has params, even empty
        route.params = route.params || [];

        // add the path in the exemple for ez
        route.exemples.forEach(function (exemple) {
            exemple.path = route.path;
        });
        
        for (var paramName in route.params) {
            var param = route.params[paramName];

            // auto set from depending on method and route
            if (!param.from) {
                if (route.type == 'bearer') param.from = 'headers';
                else if (route.path.indexOf(':' + paramName) != -1) param.from = 'params';
                else if (route.method == 'post') param.from = 'body';
                else if (route.method == 'get') param.from = 'query';
            }

            // add name in parameter
            param.name = paramName;
        }
    }
}
