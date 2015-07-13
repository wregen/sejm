var models = require("../models");

function db() {
    models.sequelize.sync().then(function () {
        console.log('Db synced!');
    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });

    return {
        bulkCreate: function (model, data) {
            return models[model].bulkCreate(data)
                    .then(function () {
                        console.log(model + ' saved');
                    })
                    .then(function () {
                        models[model].findAll().then(function (d) {
                            console.log(d.length);
                        });
                    });


        }
    };
}

module.exports = new db();