const sql = require('./db');

const Users = function(users) {
    this.name = users.name
    this.email = users.email
    this.password = users.password
    this.role = users.role
}

Users.create = (newUsers, result) => {
    sql.query("INSERT INTO users SET ?", newUsers, (err, res) => {
        if (err) {
            console.log(err)
            result(err, null)
            return
        }

        result(null, {id: res.insertId, ...newUsers})
    })
}

module.exports = Users