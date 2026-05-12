export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { pair, price, high, low, prevClose } = req.body;
  if (!pair) return res.status(400).json({ error: 'pair required' });

  const key = process.env.ANTHROPIC_KEY;
  if (!key) return res.status(500).json({ error: 'Anthropic key not configured' });

  const prompt = `Tu es un expert trader SMC/ICT. Voici les données réelles de ${pair} :
Prix actuel: ${price}
High du jour: ${high}
Low du jour: ${low}
Clôture précédente: ${prevClose}

Génère une analyse SMC/ICT complète. Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "pair": "${pair}",
  "price": "${price}",
  "change_pct": "variation en %",
  "dir": "bull ou bear",
  "trend": "Uptrend/Downtrend/Range/Strong Up/Strong Down",
  "bias": "HAUSSIER ou BAISSIER ou NEUTRE",
  "premium_discount": "PREMIUM ou DISCOUNT",
  "ob": "Bullish/Bearish OB @ prix exact",
  "fvg": "FVG @ prix exact",
  "ifvg": "IFVG @ prix exact",
  "bsl": "BSL @ prix exact",
  "ssl": "SSL @ prix exact",
  "eql": "EQL ou EQH @ prix exact",
  "bos": "description BOS ou CHoCH",
  "signal": "buy ou sell ou wait",
  "entry": "prix d'entrée exact",
  "sl": "prix stop loss exact",
  "tp": "prix take profit exact",
  "rr": "1:X",
  "strategy": "nom de la stratégie SMC recommandée",
  "htf": {"W1":"BULL/BEAR/NEU","D1":"BULL/BEAR/NEU","H4":"BULL/BEAR/NEU","H1":"BULL/BEAR/NEU","M15":"BULL/BEAR/NEU","M5":"BULL/BEAR/NEU"},
  "markets": ["DXY impact", "Or impact", "Taux US 10Y impact", "Indice boursier impact"],
  "summary": "analyse concise en 2 phrases"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1) throw new Error('No JSON in response');
    const parsed = JSON.parse(text.slice(start, end + 1));
    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
