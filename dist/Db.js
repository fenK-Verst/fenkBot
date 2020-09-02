"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3 = require('sqlite3').verbose();
class SqDatabase {
    constructor() {
        this.all = async (sql, params = []) => {
            return new Promise((resolve, reject) => {
                this.db.all(sql, params, (err, rows) => {
                    if (err)
                        return reject(err);
                    return resolve(rows);
                });
            });
        };
        this.run = async (sql, params = []) => {
            return new Promise((resolve, reject) => {
                return this.db.run(sql, params, (err, rows) => {
                    if (err)
                        return reject(err);
                    return resolve(rows);
                });
            });
        };
        this.get = async (sql, params = []) => {
            return new Promise((resolve, reject) => {
                this.db.get(sql, params, (err, rows) => {
                    if (err)
                        return reject(err);
                    return resolve(rows);
                });
            });
        };
        this.delete = async (table_name) => {
            return new Promise((resolve, reject) => {
                this.db.run(`DELETE FROM ${table_name}`, [], (err) => {
                    if (err)
                        return reject(err);
                    return resolve(true);
                });
            });
        };
        this.db = new sqlite3.Database("./schedule.db", (err) => {
            if (err) {
                throw new Error(err.message);
            }
        });
    }
}
exports.default = SqDatabase;
//# sourceMappingURL=Db.js.map