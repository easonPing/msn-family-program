const faunadb = require('faunadb');

/*
 * Persist a survey response in the `responses` collection.  The request
 * body should contain `username` and an `answers` object matching the
 * structure created by the client.  A timestamp is added automatically.
 */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }
  const { username, answers } = payload;
  if (!username || !answers) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing username or answers' }),
    };
  }
  const entry = {
    username,
    timestamp: new Date().toISOString(),
    answers,
  };
  try {
    await client.query(
      q.Create(q.Collection('responses'), {
        data: entry,
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('FaunaDB submit error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};