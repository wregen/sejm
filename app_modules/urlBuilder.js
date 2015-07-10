
function urlBuilder(baseUrl) {
    baseUrl = 'http://www.sejm.gov.pl/';
    urlSuffix = 'Sejm7.nsf/';
    startUrl = baseUrl + urlSuffix + 'agent.xsp?symbol=posglos&NrKadencji=7';
    dayUrlPart = baseUrl + urlSuffix + 'agent.xsp?symbol=listaglos&IdDnia=';
    
    
//    http://www.sejm.gov.pl/Sejm7.nsf/agent.xsp?symbol=posglos&NrKadencji=7
//    http://www.sejm.gov.pl/Sejm7.nsf/agent.xsp?symbol=listaglos&IdDnia=1453
//    http://www.sejm.gov.pl/Sejm7.nsf/agent.xsp?symbol=glosowania&NrKadencji=7&NrPosiedzenia=96&NrGlosowania=1
    
    
    ;
    return {
        votingDayUrl: function (IdDnia) {
            
        },
        votingSingleUrl: function (NrPosiedzenia, NrGlosowania) {
            
        },
        baseUrl: baseUrl || 'http://www.sejm.gov.pl/',
        baseUrlSuffix: 'Sejm7.nsf/',
        getBaseUrl: function (url) {
            var fixedUrl = url.substring(0,1);
            if (fixedUrl === "/") {
                return this.baseUrl + url;
            } else {
                return this.baseUrl + this.baseUrlSuffix + url;
            }
        },
        getSingle: function (url) {
            return get(this.getBaseUrl(url), selectVoting, strucVotingSingle);
        },
        getDay:function (url) {
            return get(this.getBaseUrl(url), selectVoting, strucVotingDay);
        }

    };
}

module.exports = new urlBuilder();