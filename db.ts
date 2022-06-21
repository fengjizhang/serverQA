const { Pool, Client } = require('pg');


async function getAll(product_id: number, page: number, count: number) {

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  try {
    await client.connect();

    const result = await client.query(`
    SELECT * FROM questions
    WHERE product_id=${product_id}
    LIMIT ${count}
    `);

    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}

async function getAllAnswers(question_id:number, page:number, count:number) {

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  try {
    await client.connect();

    const result = await client.query(`
    SELECT * FROM answers
    WHERE question_id=${question_id}
    limit ${count}
    `);
    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}

async function addQuestion(product_id: any, body: any, name: any, email:any, photos: any) { //test GetAll

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  const d = new Date();
  const timeNow = d.getTime()

  try {
    await client.connect();
    const num = await client.query(`
    SELECT *
    FROM questions
    ORDER BY id DESC
    limit 1
    `);
    const newId =  num.rows[0].id + 1;

    const result = await client.query(`
      INSERT INTO questions (id, product_id, body, date_written, asker_name, asker_email)
      VALUES (${newId}, ${product_id}, '${body}', 345678765, '${name}', '${email}')
    `);
    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}

async function addAnswer(question_id: any, body: any, name: any, email:any, photos: any) { //test GetAll

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  const d = new Date();
  const timeNow = d.getTime()

  try {
    await client.connect();

    const num = await client.query(`
    SELECT *
    FROM answers
    ORDER BY id DESC
    limit 1
    `);

    const newId =  num.rows[0].id + 1;

    const result = await client.query(`
      INSERT INTO answers (id, question_id, body, date_written, answerer_name, answerer_email)
      VALUES (${newId}, ${question_id}, '${body}', 345678765, '${name}', '${email}')
    `);

    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();
  }
}

async function markQHelpful(question_id: number) {

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  try {
    await client.connect();

    const result = await client.query(`
    SELECT helpful FROM questions WHERE id = ${question_id}
    `);
    const tempNum = result.rows[0].helpful + 1;

    const result1 = await client.query(`
    UPDATE questions
    SET helpful = ${tempNum}
    WHERE id = ${question_id}
    `);

    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}


async function reportQuestion(question_id: number) {

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  try {
    await client.connect();

    const result = await client.query(`
    UPDATE questions
    SET reported = true
    WHERE id = ${question_id}
    `);

    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}

async function markAHelpful(answer_id: number) {

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  try {
    await client.connect();

    const result = await client.query(`
    SELECT helpful
    FROM answers
    WHERE id = ${answer_id}
    `);
    const tempNum = result.rows[0].helpful + 1;

    const result1 = await client.query(`
    UPDATE answers
    SET helpful = ${tempNum}
    WHERE id = ${answer_id}
    `);

    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}


async function reportAnswer(answer_id: number) {

  const client = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASS,
    port: process.env.DBPORT,
  })

  try {
    await client.connect();

    const result = await client.query(`
    UPDATE answers
    SET reported = true
    WHERE id = ${answer_id}
    `);

    await client.end();
    return result;

  } catch (error) {
    console.log(error);
    await client.end();

  }
}

export { getAll, getAllAnswers, addQuestion, markQHelpful, reportQuestion, markAHelpful, reportAnswer, addAnswer }