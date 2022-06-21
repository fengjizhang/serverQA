require('dotenv').config();
import { getAll, getAllAnswers, addQuestion, markQHelpful, reportQuestion, markAHelpful, reportAnswer, addAnswer } from '../db/db';

const express = require('express');
const port = process.env.PORT;

const app = express();

app.use(express.json());

//Retrieves a list of questions for a particular product.
//localhost:5655/qa/questions?product_id=2&count=10
app.get('/qa/questions', async (req: any, res: any) => {

  let id = 0
  let page = 1;
  let count = 5;

  req.query.product_id ? id = req.query.product_id : res.sendStatus(400);

  if (req.query.product_id < 1) {
    res.sendStatus(400);
    return;
  }

  req.query.count ? count = req.query.count : count = count;

  const result = await getAll(id, page, count);
  res.send(result.rows);
})

//Returns answers for a given question.
//testing
//localhost:5655/qa/questions/:question_id/answers?question_id=5
app.get('/qa/questions/:question_id/answers', async (req: any, res: any) => {

  let page = 1;
  let count = 5;
  let question_id = 0;

  req.query.question_id ? question_id = req.query.question_id : res.sendStatus(400);

  req.query.count ? count = req.query.count: count = 5;

  const result = await getAllAnswers(question_id, page, count);
  res.send(result.rows);
})


// //Adds a question for the given product ERROR EDIT.
app.post('/qa/questions', async (req: any, res: any) => {
  console.log(req);
  if (!req.body.product_id || !req.body.body || !req.body.name || !req.body.email) {
    res.sendStatus(400);
    return;
  }

  let product_id = req.body.product_id;
  let body = req.body.body;
  let name = req.body.name;
  let email = req.body.email;
  let photos = [];

  if (req.body.photos) {
    photos = req.body.photos;
  }

  const result = await addQuestion(product_id, body, name, email, photos);

  res.sendStatus(201);
})

app.post('/qa/questions/:question_id/answers', async (req: any, res: any) => {

  if (!req.query.question_id || !req.body.body || !req.body.name || !req.body.email) {
    res.sendStatus(400);
    return;
  }

  const result = await addAnswer(req.query.question_id, req.body.body, req.body.name, req.body.email, req.body.photos);

  res.sendStatus(201);




})


//Updates a question to show it was found helpful.
app.put('/qa/questions/:question_id/helpful', async (req: any, res: any) => {

  if (!req.query.question_id) {
    res.sendStatus(400);
    return null;
  }

  const result = await markQHelpful(req.query.question_id);
  res.sendStatus(204);
})

//Updates a question to show it was reported.
app.put('/qa/questions/:question_id/report', async (req: any, res: any) => {

  if (!req.query.question_id) {
    res.sendStatus(400);
    return null;
  }

  const result = await reportQuestion(req.query.question_id);
  res.send(204);
})

//Updates an answer to show it was found helpful.
app.put('/qa/answers/:answer_id/helpful', async (req: any, res: any) => {

  if (!req.query.answer_id) {
    res.sendStatus(400);
    return null;
  }
  const result = await markAHelpful(req.query.answer_id);
  res.sendStatus(204);
})

//Updates a question to show it was reported.
app.put('/qa/answers/:answer_id/report', async (req: any, res: any) => {

  if (!req.query.answer_id) {
    res.sendStatus(400);
    return null;
  }

  const result = await reportAnswer(req.query.answer_id);
  res.sendStatus(204);
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

export default app ;