/*
 * Remove all survey responses from the `responses` table using Supabase.
 * This function should be triggered via POST or DELETE.  It sends a DELETE
 * request with a filter to remove all rows (id greater than 0).  Adjust
 * the filter if your table uses a different primary key.
 */
/* Use the global fetch API available in Node 18+ */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  try {
    // Delete all rows where id > 0.  This assumes id is an integer primary key.
    const res = await fetch(`${supabaseUrl}/rest/v1/responses?id=gt.0`, {
      method: 'DELETE',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=representation',
      },
    });
    if (!res.ok) {
      const errBody = await res.text();
      return { statusCode: res.status, body: errBody };
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Supabase clear results error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};