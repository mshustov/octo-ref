var path = require('path');
var fs = require('fs');

//switch to http://ionicabizau.net/blog/30-how-to-write-a-web-scraper-in-node-js
var request = require('request');
var cheerio = require('cheerio');

var url2file = {
    'github-page': 'https://github.com/restrry/octo-ref/blob/master/tests/fixtures/github-page.js'
}

Object.keys(url2file).forEach(function(fn){
    request(url2file[fn], function(err, response, body){
        var $ = cheerio.load(body);
        var content = $('body');
        fs.writeFileSync(path.resolve('./tests/fixtures/', fn + '.html'), content);
    });
})
