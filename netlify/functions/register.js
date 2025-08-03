const faunadb = require('faunadb');

/*
 * Register a new user in the FaunaDB users collection.  This function expects
 * a POST request with a JSON body containing a `username` and `password`.
 * It checks for existing users via the `users_by_username` index and
 * creates a new document when the username is unused.  A FaunaDB secret
 * must be provided in the environment under `FAUNADB_SECRET` for the client
 * connection.  The function returns a JSON response indicating success or
 * an error message.
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
    // Determine if a user already exists using the index.  If the index is not
    // present this will throw.  Users should create an index named
    // `users_by_username` in Fauna with terms: `data.username` and unique: true.
    const exists = await client.query(
      q.Exists(q.Match(q.Index('users_by_username'), username))
    );
    if (exists) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists' }),
      };
    }
    // Create the user document.  For security reasons passwords should be
    // hashed before storing; however, for simplicity this example stores the
    // plain text password.  Do not use this approach in production.
    await client.query(
      q.Create(q.Collection('users'), {
        data: {
          username,
          password,
        },
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('FaunaDB register error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};