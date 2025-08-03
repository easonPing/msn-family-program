/*
 * Authenticate a user by username and password using Supabase's REST API.
 * A POST request with JSON `{ username, password }` is expected.  The
 * service role key and project URL must be provided in the environment
 * variables `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
 */
/* Use the global fetch API available in Node 18+ */
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
    // Fetch the user by username
    const res = await fetch(`${supabaseUrl}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=username,password`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const user = data[0];
      if (user.password === password) {
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
    }
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'User not found' }),
    };
  } catch (err) {
    console.error('Supabase login error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};