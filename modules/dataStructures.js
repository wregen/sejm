var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var querystring = require('querystring');
var moment = require('moment');
var urlBuilder = require('./urlBuilder.js');

function dataStructures() {
    var get = function (url, selectorFunc, structureFunc) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, response, html) {
                if (error) {
                    return reject(error);
                }
                var out = {
                    url: url,
                    data: []
                };
                selectorFunc(html).each(function () {
                    var el = cheerio(this);
                    out.data.push(structureFunc(el));
                });
                return resolve(out);
            });
        });
    };
    var selectVoting = function (html) {
        var $ = cheerio.load(html);
        return $('table tbody tr');
    };
    var strucVotingSingle = function (el) {
        return {
            klub: el.children().first().text(),
            href: el.children().first().children().first().attr('href'),
            liczebnosc: el.children().first().next().text(),
            wazny: el.children().first().next().next().text(),
            nieobecny: el.children().first().next().next().next().text()
        };
    };
    var strucVotingDay = function (el) {
        return {
            no: el.children().first().text(),
//            href: el.children().first().children().first().attr('href'),
            time: el.children().first().next().text(),
            text: el.children().first().next().next().text()
        };
    };
    var getNrPosiedzenia = function (el) {
        if (el.children().first().text().charCodeAt(0) === 160) {
            if (el.prev().children().first().text().charCodeAt(0) === 160) {
                if (el.prev().prev().children().first().text().charCodeAt(0) === 160) {
                    if (el.prev().prev().prev().children().first().text().charCodeAt(0) === 160) {
                        throw Error('getNrPosiedzenia cannot get NrPosiedzenia!!!');
                    } else {
                        return el.prev().prev().prev().children().first().text();
                    }
                } else {
                    return el.prev().prev().children().first().text();
                }
            } else {
                return el.prev().children().first().text();
            }
        } else {
            return el.children().first().text();
        }
    };
    var strucVoting = function (el) {
        var href = el.children().first().next().children().first().attr('href'),
                parsedQuery = querystring.parse(url.parse(href).query),
                date = moment(parseSejmDate(el.children().first().next().text()), "YYYY-MM-DD");
        return {
            //href: href,
            nrPosiedzenia: Number(getNrPosiedzenia(el)),
            idDnia: parsedQuery.IdDnia,
            date: date.format("YYYY-MM-DD"),
            liczbaGlosowan: Number(el.children().first().next().next().text())
        };
    };
    var parseSejmDate = function (d) {
        var m = {
            stycznia: 1,
            lutego: 2,
            marca: 3,
            kwietnia: 4,
            maja: 5,
            czerwca: 6,
            lipca: 7,
            sierpnia: 8,
            'września': 9,
            'października': 10,
            listopada: 11,
            grudnia: 12
        },
        splitted = d.split(' ');
        return [splitted[2], m[splitted[1]], splitted[0]].join('-');
    };
    var flattenAllDaysResult = function (allDays) {
        var out = [];
        allDays.forEach(function (a) {
            var parsedQuery = querystring.parse(url.parse(a.url).query);
            a.data.forEach(function (b) {
                out.push({
                    no: b.no,
                    time: b.time,
                    text: b.text,
                    idDnia: Number(parsedQuery.IdDnia)
                });
            });
        });
        return out;
    };
    var mkPromisseForAllDayVotes = function (all) {
        var days = [],
                l = all.data.length;
//        var l = 1;
        for (var i = 0; i < l; i++) {
            days.push(getDay(urlBuilder.votingDayUrl(all.data[i].idDnia, all.data[i].nrPosiedzenia)));
        }
        return Promise.all(days);
    };
    var getDay = function (url) {
        return get(url, selectVoting, strucVotingDay);
    };
    return {
        getSingle: function (url) {
            return get(url, selectVoting, strucVotingSingle);
        },
        getDay: function (url) {
            return getDay(url);
        },
        getAll: function (url) {
            return get(url, selectVoting, strucVoting);
        },
        mkPromisseForAllDayVotes: function (all) {
            return mkPromisseForAllDayVotes(all);
        },
        flattenAllDaysResult: function (a) {
            return flattenAllDaysResult(a);
        }
    };
}

module.exports = new dataStructures();