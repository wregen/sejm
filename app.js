var dataStructures = require('./modules/dataStructures.js');
var urlBuilder = require('./modules/urlBuilder.js');
var db = require("./modules/db.js");

var url = require('url');
var querystring = require('querystring');


dataStructures.getAll(urlBuilder.votingStartUrl())
        .then(function (a) {
            /**
             * Saving all days
             */
            db.bulkCreate('Day', a.data);
            return a;
        })
        .then(function (a) {
            /**
             * Generating days' votes promises
             */
            return dataStructures.mkPromisseForAllDayVotes(a);
        })
        .then(function (a) {
            /**
             * Generating suitable array of days' votes for bulc create
             */
            return dataStructures.flattenAllDaysResult(a);
        })
        .then(function (a) {
            db.bulkCreate('Vote', a);
        });


