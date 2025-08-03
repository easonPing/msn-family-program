/*
 * We use the global fetch API available in modern Node runtimes to call
 * Supabase's REST endpoints.  Ensure your Netlify environment uses Node 18+.
 */

/*
 * Register a new user using Supabase.  This endpoint expects a POST request
 * with a JSON body containing `username` and `password`.  The Supabase
 * service role key should be supplied via environment variables
 * `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.  A user row is inserted when
 * the username is not already taken.
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

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
    // Check if the user already exists via Supabase REST
    const getRes = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=id`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    const existing = await getRes.json();
    if (Array.isArray(existing) && existing.length > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists' }),
      };
    }
    // Insert the new user
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ username, password }),
    });
    if (!insertRes.ok) {
      const errBody = await insertRes.text();
      return { statusCode: insertRes.status, body: errBody };
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Supabase register error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};