const sqlite3 = require('sqlite3').verbose();

class DbConnection {

    constructor() {
        // Connect to SQLite
        // Create tables if they dont exist yet
        this.db = new sqlite3.Database(':memory:');
        this.initializeTables();
    }

    initializeTables() {
        this.db.serialize(() => {
            this.db.run("CREATE TABLE lorem (info TEXT)");
            const stmt = this.db.prepare("INSERT INTO lorem VALUES (?)");
            for (let i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();
        });
    }

    disconnect() {
        console.info('Disconnecting from database.');
        this.db.close();
    }

    async getData() {
        let output = "";
        await new Promise((resolve, reject) => {
            this.db.each("SELECT rowid AS id, info FROM lorem", [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    output += `${row.id}: ${row.info}\n`;
                }
            }, (err,count) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(output);
                }
            });
        });
        return output;
    }
}

class Database {

    constructor() {
        throw new Error('Called constructor on singleton class. Use getConnection() instead.')
    }

    static getConnection() {
        if (!Database.connection) {
            Database.connection = new DbConnection();
        }
        return Database.connection;
    }

}


module.exports = Database;