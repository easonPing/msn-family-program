/*
 * Retrieve all survey responses from the `responses` table using Supabase.
 * Returns an array of response objects with username, timestamp and answers.
 */
/* Use the global fetch API available in Node 18+ */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async function () {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/responses?select=username,timestamp,answers`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });
    if (!res.ok) {
      const errBody = await res.text();
      return { statusCode: res.status, body: errBody };
    }
    const results = await res.json();
    return { statusCode: 200, body: JSON.stringify({ results }) };
  } catch (err) {
    console.error('Supabase get results error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};