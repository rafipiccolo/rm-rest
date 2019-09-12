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
