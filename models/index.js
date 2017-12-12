/**
 * Created by Tech-Team on 11/4/15.
 */

if (!global.hasOwnProperty('db')) {
    var Sequelize = require('sequelize');
    var sq = null;
    var fs = require('fs');
    var path = require('path');
    var PGPASS_FILE = path.join(__dirname, '../.pgpass');

    /* Remote database... Normally Amazon RDS Postgres */
    if (process.env.DATABASE_URL) {
        console.log("We are on Heroku Database...");

        var pgregex = /postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
        var match = process.env.DATABASE_URL.match(pgregex);
        var user = match[1];
        var password = match[2];
        var host = match[3];
        var port = match[4];
        var dbname = match[5];

        //For Running Remotely on Amazon RDS
        /*
         var host = process.env.RDS_HOSTNAME;
         var port = process.env.RDS_PORT;
         var dbname = process.env.RDS_DBNAME;
         var user = process.env.RDS_USERNAME;
         var password = process.env.RDS_PASSWORD;
         */

        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            ssl: true,
            logging:  console.log
        };

        sq = new Sequelize(dbname, user, password, config);
    }
    else if(process.env.RDS_HOSTNAME) {
        console.log("We are on AWS RDS Database...");

        //For Running Remotely on Amazon RDS
         var host = process.env.RDS_HOSTNAME;
         var port = process.env.RDS_PORT;
         var dbname = process.env.RDS_DBNAME;
         var user = process.env.RDS_USERNAME;
         var password = process.env.RDS_PASSWORD;

        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            ssl: true,
            logging:  console.log
        };

        sq = new Sequelize(dbname, user, password, config);
    }
    else {
        /* Local database installed on ec2 - Postgres */
        console.log("We are on Local ec2 Database....");

        var pgtokens = fs.readFileSync(PGPASS_FILE).toString().trimRight().split(':');
        var host = pgtokens[0];
        var port = pgtokens[1];
        var dbname = pgtokens[2];
        var user = pgtokens[3];
        var password = pgtokens[4];

        var config =  {
            dialect:  'postgres',
            protocol: 'postgres',
            port:     port,
            host:     host,
            logging:  console.log
        };
        sq = new Sequelize(dbname, user, password, config);

        sq
            .authenticate()
            .then(function(err) {
                console.log('Connection has been established successfully.');
            }, function (err) {
                console.log('Unable to connect to the database:', err);
            });
    }
    global.db = {
        Sequelize: Sequelize,
        sequelize: sq,
        Rate: sq.import(__dirname + '/rate'),
        User: sq.import(__dirname + '/user'),
        Order: sq.import(__dirname + '/order'),
        Orderproduct: sq.import(__dirname + '/orderproduct'),
        Product: sq.import(__dirname + '/product'),
        Manufacturer: sq.import(__dirname + '/manufacturer'),
        Payment: sq.import(__dirname + '/payment'),
        Card: sq.import(__dirname + '/card'),
        Shipment: sq.import(__dirname + '/shipment')
    };
}
module.exports = global.db;

