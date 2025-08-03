const faunadb = require('faunadb');

/*
 * Retrieve all survey responses from the `responses` collection.  This
 * function returns an array of data objects containing the username,
 * timestamp and answers fields.  Paginate is used with a high size to
 * return all documents.  Adjust the size or implement pagination when
 * working with large datasets.
 */
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
});

exports.handler = async function () {
  try {
    const page = await client.query(
      q.Paginate(q.Documents(q.Collection('responses')), { size: 100000 })
    );
    const refs = page.data;
    const docs = await client.query(
      refs.map((ref) => q.Get(ref))
    );
    const results = docs.map((doc) => doc.data);
    return {
      statusCode: 200,
      body: JSON.stringify({ results }),
    };
  } catch (err) {
    console.error('FaunaDB get results error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};