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

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'nodejs-api' 
  });

  conn.connect((err) => {
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
      age: Joi.number().min(18).required(),
    });
    return schema.validate(user);
  };
  

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  
  app.get('/users', (req, res) => {
    conn.query('SELECT * FROM users', (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error fetching users');
      }
      res.json(results);
    });
  });