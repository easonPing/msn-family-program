/*
 * Persist a survey response in the `responses` table using Supabase.
 * The request body should contain `username` and an `answers` object.
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
    const res = await fetch(`${supabaseUrl}/rest/v1/responses`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(entry),
    });
    if (!res.ok) {
      const errBody = await res.text();
      return { statusCode: res.status, body: errBody };
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Supabase submit error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};