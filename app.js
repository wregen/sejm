var dataStructures = require('./app_modules/dataStructures.js');
var urlBuilder = require('./app_modules/urlBuilder.js');
var Sequelize = require('sequelize');
var url = require('url');
var querystring = require('querystring');
var sequelize = new Sequelize(null, null, null, {
    storage: __dirname + '/app.sqlite',
    dialect: 'sqlite',
    dialectOptions: {
        charset: 'UTF-8',
    },
    logging: function (str) {
        // do your own logging
    }
});
var Day = sequelize.define('days', {
    nrPosiedzenia: Sequelize.INTEGER,
    idDnia: Sequelize.INTEGER,
    date: Sequelize.DATE,
    liczbaGlosowan: Sequelize.INTEGER
});
var Vote = sequelize.define('votes', {
    no: Sequelize.INTEGER,
    time: Sequelize.STRING,
    text: Sequelize.TEXT,
    idDnia: Sequelize.INTEGER
});
sequelize
        .sync({force: false})
        .then(function () {
            console.log('Db synced!');
        }, function (err) {
            console.log('An error occurred while creating the table:', err);
        });

dataStructures.getAll(urlBuilder.votingStartUrl())
        .then(function (all) {
            /**
             * Saving all days
             */
            Day.bulkCreate(all.data)
                    .then(function () {
                        console.log('Days saved');
                    })
                    .then(function () {
                        Day.findAll().then(function (d) {
                            console.log(d.length);
                        });
                    });

            return all;
        })
        .then(function (all) {
            /**
             * Generating days' votes promises
             */
            var days = [],
                    l = all.data.length;
//            var l = 1;
            for (var i = 0; i < l; i++) {
                days.push(dataStructures.getDay(urlBuilder.votingDayUrl(all.data[i].idDnia, all.data[i].nrPosiedzenia)));
            }
            return Promise.all(days);
        })
        .then(function (allDays) {
            /**
             * Generating suitable array of days' votes for bulc create
             */
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
        })
        .then(function (data) {
            Vote.bulkCreate(data)
                    .then(function () {
                        console.log('Votes saved');
                    })
                    .then(function () {
                        Vote.findAll().then(function (d) {
                            console.log(d.length);
                        });
                    });
        });


