# Description

This module allows to create an express compatible rest api with a full documentation

# Usage

## create server.js
It will be the entry point of your project
The api can be mounted anywhere. Here it is mounting the "commands" directory on "/api/v1"
commandsDir must be an absolute path.

    const express = require('express')
    const api = require('rm-rest')

    const app = express()

    app.use('/api/v1', api({
        commandsDir: __dirname+'/commands',
        logger: console,
    }));

    app.get('/', function(req, res, next) {
        res.send('ready');
    });

    var port = process.env.PORT || 3000;
    var server = app.listen(port, (err) => {
        if (err) throw err;

        console.log('> Ready on http://localhost:'+port)
    })

## create the command list : commands/index.js

    module.exports = {
        test: require('./test.js'),
    };

## create a command :

    module.exports = {
        description: 'Create a test',
        path: '/test',
        method: 'get',
        params: {
            name: {
                type: 'string',
                description: 'Name of the test',
                required: true,
            },
            type: {
                type: 'string',
                description: 'test type',
                required: true,
                values: ['appartment', 'house'],
            },
            nbRoom: {
                type: 'int',
                description: 'Number of rooms',
                required: false,
                min: 0,
                default: 1,
            },
        },
        exemples: [
            {
                description: 'should insert a test',
                request: {
                    params: {},
                    headers: {},
                    query: {},
                    body: {
                        name: 'test',
                        type: 'appartment',
                        nbRoom: 1,
                    }
                },
                response: {
                    id: 1,
                    name: 'test',
                    type: 'appartment',
                    nbRoom: 1,
                }
            }
        ],
        handler: handler
    };

    function handler(params, callback) {
        return callback(null, {message: 'ok'});
    }

## run

    $> node server.js

or specify port

    $> PORT=3333 node server.js

## test

    $> curl http://localhost:3000
    ready

    $> curl http://localhost:3000/api/v1
    will display documentation of your api : all commands and exemples.

    $> curl http://localhost:3000/api/v1/api.json
    will display a json representation of the api.

    $> curl http://localhost:3000/api/v1/test?name=test&type=appartment
    {message: 'ok'}
