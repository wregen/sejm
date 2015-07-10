var url = require('url');
var querystring = require('querystring');

function urlBuilder(baseUrl) {
    var baseUrl = 'http://www.sejm.gov.pl/',
            urlSuffix = 'Sejm7.nsf/agent.xsp';

    return {
        votingStartUrl: function () {
            var p = {
                symbol: 'posglos',
                NrKadencji: 7
            };
            return [baseUrl, urlSuffix, '?', querystring.stringify(p)].join('');
        },
        votingDayUrl: function (IdDnia) {
            var p = {
                symbol: 'listaglos',
                IdDnia: IdDnia
            };
            return [baseUrl, urlSuffix, '?', querystring.stringify(p)].join('');
        },
        votingSingleUrl: function (NrPosiedzenia, NrGlosowania) {
            var p = {
                symbol: 'glosowania',
                NrKadencji: 7,
                NrPosiedzenia: NrPosiedzenia,
                NrGlosowania: NrGlosowania
            };
            return [baseUrl, urlSuffix, '?', querystring.stringify(p)].join('');

        }
    };
}

module.exports = new urlBuilder();