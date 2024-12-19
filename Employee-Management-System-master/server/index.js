const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());


//database connection
const db = mysql.createConnection({ 
    user: 'root',
    host: 'localhost',
    password: 'Mokesh@2005',
    database: 'employee_management',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.post('/create', (req, res) => {
 const name = req.body.name;
 const email = req.body.email;
 const age = req.body.age;
 const position = req.body.position;
 const ctc = req.body.ctc;
 


 //db queries
 db.query(
    'INSERT INTO users (name, email, age, position, ctc) VALUES (?,?,?,?,?)',
    [name, email, age, position, ctc], 
    (err, result) => {                              
        if(err){
            console.log('Error executing SQL query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('values inserted');
        }
    });
});

app.get('/employees', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if(err){
            console.log('Error executing SQL query (while getting employee list)', err);
        }
        else {
            res.send(result);
        }
    })
})

app.put('/update', (req, res) => {
    const { id, ctc } = req.body;

    db.query("UPDATE users SET ctc = ? WHERE id = ?", [ctc, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: 'Error updating CTC' });
        }
        if (result.affectedRows > 0) {
            return res.send({ message: 'CTC updated successfully' });
        } else {
            return res.status(404).send({ message: 'Employee not found' });
        }
    });
});



app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error deleting employee');
        } else {
            if (result.affectedRows > 0) {
                res.send({ message: 'Employee deleted successfully', id: id });
            } else {
                res.status(404).send({ message: 'Employee not found' });
            }
        }
    });
});



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

