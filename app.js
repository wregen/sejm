var dataStructures = require('./app_modules/dataStructures.js');
var urlBuilder = require('./app_modules/urlBuilder.js');

dataStructures.getAllVotes(urlBuilder.votingStartUrl())
        .then(function (out) {
            console.log(out);
        });


//dataStructures.getDay('agent.xsp?symbol=listaglos&IdDnia=1456')
//        .then(function (out) {
//            console.log(out.url);
//            out.data.forEach(function (el) {
//                console.log(el);
//            });
//        });


//            data.forEach(function (el) {
//                console.log(el.href);
//
//                dataStructures.getSingle(el.href)
//                        .then(function (x) {
//                            console.log(JSON.stringify(x, null, 2));
//                            console.log('--------------------------------------------');
//                        });
//            });
