const { Pool, Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASS,
  port: process.env.DBPORT,
})

client.connect();

console.log('connected! Begin importing...');

client.query(
  `CREATE TABLE IF NOT EXISTS questions (
  id INTEGER NOT NULL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  body VARCHAR(255) NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name VARCHAR(50),
  asker_email VARCHAR(50) NOT NULL,
  reported BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0
)`, (err, res) => {
  err ? console.log(err): console.log('done! table created.');
})

client.query(
  `CREATE TABLE IF NOT EXISTS answers (
  id INTEGER NOT NULL PRIMARY KEY,
  question_id INTEGER NOT NULL,
  body VARCHAR(255) NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name VARCHAR(50),
  answerer_email VARCHAR(50),
  reported BOOLEAN DEFAULT FALSE,
  helpful INTEGER DEFAULT 0
)`, (err, res) => {
  err ? console.log(err): console.log('done! table created.');
})

client.query(`CREATE TABLE IF NOT EXISTS photos (
  id INTEGER NOT NULL PRIMARY KEY,
  answer_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL
)`, (err, res) => {
  err ? console.log(err): console.log('done! table created.');
})

//IMPORTING

client.query(
  `COPY questions(id,product_id,body,date_written,asker_name,asker_email,reported,helpful)
  FROM '/Users/fengjizhang/Desktop/HR/serverQA/csvData/questions.csv'
  DELIMITER ','
  CSV HEADER;`
  , (err, res) => {
  err ? console.log(err): console.log(res);
})

client.query(
  `COPY answers(id,question_id,body,date_written,answerer_name,answerer_email,reported,helpful)
  FROM '/Users/fengjizhang/Desktop/HR/serverQA/csvData/answers.csv'
  DELIMITER ','
  CSV HEADER;`
  , (err, res) => {
  err ? console.log(err): console.log(res);
})

client.query(
  `COPY photos(id,answer_id,url)
  FROM '/Users/fengjizhang/Desktop/HR/serverQA/csvData/answers_photos.csv'
  DELIMITER ','
  CSV HEADER;`
  , (err, res) => {
  err ? console.log(err): console.log(res);
})

//INDEXING
client.query(
  'CREATE INDEX product_id_idx ON questions (product_id);'
  , (err, res) => {
    err ? console.log(err): console.log(res);
})

client.query(
  'CREATE INDEX question_id_idx ON answers (question_id);'
  , (err, res) => {
    err ? console.log(err): console.log(res);
})