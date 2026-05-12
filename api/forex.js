export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const key = process.env.TWELVEDATA_KEY;
  const { symbol } = req.query;
  const url = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${key}`;
  const r = await fetch(url);
  const data = await r.json();
  res.status(200).json(data);
}
