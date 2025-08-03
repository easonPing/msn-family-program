const faunadb = require('faunadb');

/*
 * Authenticate a user by username and password.  This function expects a
 * POST request with JSON containing `username` and `password`.  It looks up
 * the user document using the `users_by_username` index and compares
 * the stored password.  A successful login returns `{ success: true }`.
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
  const { username, password } = payload;
  if (!username || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing username or password' }),
    };
  }
  try {
    const userDoc = await client.query(
      q.Get(q.Match(q.Index('users_by_username'), username))
    );
    const stored = userDoc.data;
    if (stored.password === password) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Incorrect password' }),
      };
    }
  } catch (err) {
    // When no document matches, Fauna throws an error.  In that case, we
    // treat it as an unknown user.
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'User not found' }),
    };
  }
};