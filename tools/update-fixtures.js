var path = require('path');
var fs = require('fs');

var request = require('request');
var cheerio = require('cheerio');

var url2file = {
    'github-page': 'https://github.com/restrry/octo-ref/blob/master/test/fixtures/github-page.js'
}

Object.keys(url2file).forEach(function(fn){
    request(url2file[fn], function(err, response, body){
        var $ = cheerio.load(body);
        var content = $('body');
        fs.writeFileSync(path.resolve('./tests/fixtures/', fn + '.html'), content);
    });
})
