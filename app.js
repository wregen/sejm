var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

var baseUrl = 'http://www.sejm.gov.pl/';

function votingSingleDetailsMarszalek(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, response, html) {
            if (error) {
                return reject(error);
            }
            var $ = cheerio.load(html);
            var out = [];
            // second table on page
            $('table').next().children().filter(function () {
                var data = $(this);
                console.log(data.children().first().next().text());
//                out.push({
//                    lp: data.children().first().text(),
//                    name: data.children().first().next().text(),
//                    href: data.children().first().children().first().attr('href'),
//                    wazny: data.children().first().next().next().text(),
//                    nieobecny: data.children().first().next().next().next().text()
//                });
            });
            return resolve(out);
        });
    });
}

//votingSingleDetailsMarszalek(baseUrl + 'SQL2.nsf/InfoForPPIDL?OpenAgent&42885&PO')
//        .then(function (data) {
//            console.log(JSON.stringify(data, null, 2));
//            console.log('--------------------------------------------');
//        });

function votingSingle(url) {
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
                    klub: data.children().first().text(),
                    href: data.children().first().children().first().attr('href'),
                    liczebnosc: data.children().first().next().text(),
                    wazny: data.children().first().next().next().text(),
                    nieobecny: data.children().first().next().next().next().text()
                });
            });
            return resolve(out);
        });
    });
}

votingSingle(baseUrl + 'Sejm7.nsf/agent.xsp?symbol=glosowaniaL&NrKadencji=7&NrPosiedzenia=95&NrGlosowania=1')
        .then(function (data) {
            console.log(JSON.stringify(data, null, 2));
            console.log('--------------------------------------------');
        });



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

//votingDay(baseUrl + 'Sejm7.nsf/agent.xsp?symbol=listaglos&IdDnia=1456')
//        .then(function (data) {
//            console.log(JSON.stringify(data, null, 2));
//            console.log('--------------------------------------------');
//        })
//        .catch(function (error) {
//            console.log('--------------------------------------------');
//            console.log('ERROR:');
//            console.log(error);
//            console.log('--------------------------------------------');
//        });
//
