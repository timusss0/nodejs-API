const { v4: uuidv4 } = require('uuid'); 
const express = require('express');
const mysql = require('mysql2');
const Joi = require('joi');
const winston = require('winston');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs-api',
  });

  db.connect((err) => {
    if (err) {
      console.error('Database connection failed:', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });