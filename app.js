 var dataStructures  = require('./app_modules/dataStructures.js');
    

dataStructures.getSingle('Sejm7.nsf/agent.xsp?symbol=glosowaniaL&NrKadencji=7&NrPosiedzenia=95&NrGlosowania=1')
        .then(function (data) {
            console.log(JSON.stringify(data, null, 2));
            console.log('--------------------------------------------');
        });



//var request = require('request');
//var cheerio = require('cheerio');
//
//var baseUrl = 'http://www.sejm.gov.pl/';
//
//function getData(url, selectorFunc, structureFunc) {
//    return new Promise(function (resolve, reject) {
//        request(url, function (error, response, html) {
//            if (error) {
//                return reject(error);
//            }
//            var out = [];
//            selectorFunc(html).each(function () {
//                var data = $(this);
//                out.push(structureFunc(data));
//            });
//            return resolve(out);
//        });
//    });
//}
//
//function selectVotingSingle(html) {
//    var $ = cheerio.load(html);
//    return $('table tbody tr');
//}
//
//function strucVotingSingle(el) {
//    return {
//        klub: el.children().first().text(),
//        href: el.children().first().children().first().attr('href'),
//        liczebnosc: el.children().first().next().text(),
//        wazny: el.children().first().next().next().text(),
//        nieobecny: el.children().first().next().next().next().text()
//    };
//}

//votingSingle(baseUrl + 'Sejm7.nsf/agent.xsp?symbol=glosowaniaL&NrKadencji=7&NrPosiedzenia=95&NrGlosowania=1',
//        selectVotingSingle, strucVotingSingle)
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
                out.push(strucVotingSingle(data));
            });
            return resolve(out);
        });
    });
}

//votingSingle(baseUrl + 'Sejm7.nsf/agent.xsp?symbol=glosowaniaL&NrKadencji=7&NrPosiedzenia=95&NrGlosowania=1')
//        .then(function (data) {
//            console.log(JSON.stringify(data, null, 2));
//            console.log('--------------------------------------------');
//        });



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
