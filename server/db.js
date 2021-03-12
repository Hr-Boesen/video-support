const mysql = require('mysql');

class Database {

  constructor() {
    this.connection = null;
  }

   connectToDatabase() {
    // create the connection to database
    this.connection = mysql.createConnection({
      host     : 'db-mysql-ams3-47998-do-user-4805626-0.b.db.ondigitalocean.com',
      port     :  25060,
      user     : 'Christian',
      password : 'og72s02q07ubv5a0',
      database : 'support-video'
    });


  }

}
module.exports = new Database;