var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var baseUrl = 'http://www.sejm.gov.pl/Sejm7.nsf/';


function votingDay(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, html) {
            if (error) {
                return reject(error);
            }
            var $ = cheerio.load(html);
            var out = [];
            $('table tbody tr').filter(function () {
                var data = $(this);
                out.push({
                    no: data.children().first().text(),
                    href: data.children().first().children().first().attr('href'),
                    time: data.children().first().next().text(),
                    text: data.children().first().next().next().text()
                });
            });
            return resolve(out);
        });
    });
}

votingDay(baseUrl + 'agent.xsp?symbol=listaglos&IdDnia=1456')
        .then(function (data) {
            console.log(JSON.stringify(data, null, 2));
            console.log('--------------------------------------------');
        })
        .catch(function (error) {
            console.log('--------------------------------------------');
            console.log('ERROR:');
            console.log(error);
            console.log('--------------------------------------------');
        });










//app.get('/', function (req, res) {
//
//    url = 'http://www.imdb.com/title/tt1229340/';
//
//    request(url, function (error, response, html) {
//        if (!error) {
//            var $ = cheerio.load(html);
//
//            var title, release, rating;
//            var json = {title: "", release: "", rating: ""};
//
//            $('.header').filter(function () {
//                var data = $(this);
//                title = data.children().first().text();
//                release = data.children().last().children().text();
//
//                json.title = title;
//                json.release = release;
//            });
//
//            $('.star-box-giga-star').filter(function () {
//                var data = $(this);
//                rating = data.text();
//
//                json.rating = rating;
//            });
//        }
//
//        res.send('OK');
//    });
//});
//
//var server = app.listen(80, function () {
//
//  var host = server.address().address;
//  var port = server.address().port;
//
//  console.log('Example app listening at http://%s:%s', host, port);
//
//});