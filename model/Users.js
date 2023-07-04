const Connection = require('../utilities/connection.js');

class Users {
    constructor() {
        this.connection = new Connection("./BD/database.db");
    }
    async get(id) {
        
      await this.connection.connect();

      const sql = 'SELECT * FROM users WHERE id=?';
      const params = [id];
      const rows = await this.connection.query(sql, params);
      console.log(rows);
      await this.connection.close();       
      
      return rows[0];       
      
  } 
    async authenticate(username, password) {
        
        await this.connection.connect();

        const sql = 'SELECT * FROM users WHERE name = ? AND password = ?  ';
        const params = [username, password];
        const rows = await this.connection.query(sql, params);
        ///console.log(params);
        await this.connection.close();
        
        if (rows.length > 0) {
            console.log('Authentication successful!');
            return rows[0];
        } else {
            console.log('Authentication failed!');
            return false;
        }
        
    }
    async getAll() {
        
        await this.connection.connect();

        const sql = 'SELECT * FROM users WHERE role=1';
        const params = [];
        const rows = await this.connection.query(sql, params);
        ///console.log(params);
        await this.connection.close();       
        
        return rows;       
        
    }
    async getPhoto(id) {
        await this.connection.connect();
    
        const sql = 'SELECT photo FROM users WHERE id = ?';
        const params = [id];
        const result = await this.connection.query(sql, params);
        console.log(result)
        await this.connection.close();
    
        if (result && result.length > 0) {
          return result[0].photo;
        } else {
          return null;
        }
    }
    
    async insert(name, password, photo, address, role) {
        console.log("insert");
        await this.connection.connect();
      
        const sql = 'INSERT INTO users (name, password, photo, adress, role) VALUES (?,?,?,?,?)';
        const params = [name, password, photo, address, role];
        console.log(params);
        const result = await this.connection.exec(sql, params);
        console.log(params);
        console.log(result);
        await this.connection.close();
        console.log(result);
      
        if (result && result.changes > 0) {
          return true;
        } else {
          return false;
        }
    }
      
      
    async update(id, name, password, photo, adress, role) {
        await this.connection.connect();
        const sql = 'UPDATE users SET name=?, password=?, photo=?, adress=?, role=? WHERE id=?';
        const params = [name, password, photo, adress, role, id];
        const result = await this.connection.exec(sql, params);
        //TODO: verificar 
        await this.connection.close();
        if (result && result.changes > 0) {
            return true;
        } else {
        return false;
        }
      }
      
      async delete(id) {
        await this.connection.connect();
        const sql = 'DELETE FROM users WHERE id=?';
        const params = [id];
        const result = await this.connection.exec(sql, params);
        //TODO: verificar 
        await this.connection.close();
        return true;
      }
}


module.exports = Users;
