const faunadb = require('faunadb');

/*
 * Remove all survey responses from the `responses` collection.  This function
 * is intended for use by administrators.  It iterates through all
 * document references and deletes each one.  A POST request is expected
 * but the body is unused.  Note that deleting in bulk may take some time
 * depending on the number of documents.
 */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  try {
    const page = await client.query(
      q.Paginate(q.Documents(q.Collection('responses')), { size: 100000 })
    );
    const refs = page.data;
    // Delete each document individually
    await client.query(
      refs.map((ref) => q.Delete(ref))
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('FaunaDB clear results error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};