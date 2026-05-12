export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { symbol, type } = req.query;
  if (!symbol) return res.status(400).json({ error: 'symbol required' });

  const key = process.env.TWELVEDATA_KEY;
  if (!key) return res.status(500).json({ error: 'API key not configured' });

  try {
    const endpoint = type === 'quote' ? 'quote' : 'price';
    const url = `https://api.twelvedata.com/${endpoint}?symbol=${symbol}&apikey=${key}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
