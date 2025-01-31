const { v4: uuidv4 } = require('uuid'); 
const express = require('express');
const mysql = require('mysql2');
const Joi = require('joi');
const winston = require('winston');
const fs = require('fs');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'nodejs-api' 
  });

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to MySQL database');
  });

  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: 'logs/app.log' }),
      new winston.transports.Console(),
    ],
  });
  
  const validateUser = (user) => {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
      email: Joi.string().email().required(),
      age: Joi.number().integer().min(18).required()
    });
    return schema.validate(user);
  };
  

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  
  app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching users');
      }
      res.json(results);
    });
  });

  app.post('/users', (req, res) => {
    console.log(req.body); 
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    const { name, email, age } = req.body;
    const userId = uuidv4();
  
    db.query('INSERT INTO users (id, name, email, age) VALUES (?, ?, ?, ?)', [userId, name, email, age], (err, results) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).send('Error adding user');
        }
        res.status(201).send(`User added with ID: ${userId}`);
      });
    });
  
    app.get('/users/:id', (req, res) => {
        const { id } = req.params;
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
          if (err) {
            logger.error(err);
            res.status(500).send('Error fetching user');
          } else if (results.length === 0) {
            res.status(404).send('User not found');
          } else {
            res.json(results[0]);
          }
        });
      });

      
      app.put('/users/:id', (req, res) => {
        const { id } = req.params;
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);
      
        const { name, email, age } = req.body;
        db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err, results) => {
          if (err) {
            logger.error(err);
            res.status(500).send('Error updating user');
          } else if (results.affectedRows === 0) {
            res.status(404).send('User not found');
          } else {
            res.send('User updated');
          }
        });
      });
    