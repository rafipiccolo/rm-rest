const express = require('express')
const api = require('./index.js')

const app = express()

// debugs & perf
app.use('/api/v1', api({
    commandsDir: __dirname+'/samples',
    logger: console,
}));

app.get('/', function(req, res, next) {
    res.send('root');
});

var port = process.env.PORT || 3000;
var server = app.listen(port, (err) => {
    if (err) throw err;

    console.log('> Ready on http://localhost:'+port)
})
