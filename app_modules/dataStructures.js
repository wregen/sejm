var request = require('request');
var cheerio = require('cheerio');

function dataStructures(baseUrl) {
    var get = function (url, selectorFunc, structureFunc) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, response, html) {
                if (error) {
                    return reject(error);
                }
                var out = [];
                selectorFunc(html).each(function () {
                    var el = cheerio(this);
                    out.push(structureFunc(el));
                });
                return resolve(out);
            });
        });
    },
            selectVotingSingle = function (html) {
                var $ = cheerio.load(html);
                return $('table tbody tr');
            },
            strucVotingSingle = function (el) {
                return {
                    klub: el.children().first().text(),
                    href: el.children().first().children().first().attr('href'),
                    liczebnosc: el.children().first().next().text(),
                    wazny: el.children().first().next().next().text(),
                    nieobecny: el.children().first().next().next().next().text()
                };
            };
    return {
        baseUrl: baseUrl || 'http://www.sejm.gov.pl/',
        getSingle: function (url) {
            return get(this.baseUrl + url, selectVotingSingle, strucVotingSingle);
        }

    };
}

module.exports = new dataStructures();