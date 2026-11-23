// Receives leads from the quote form and the catalogue download form.
// Delivery (configure in Vercel → Settings → Environment Variables):
//   LEAD_WEBHOOK_URL   – any webhook (Make, Zapier, n8n, Google Apps Script, CRM) receives the JSON
//   RESEND_API_KEY + LEAD_TO_EMAIL (+ optional LEAD_FROM_EMAIL) – sends an e-mail via resend.com
// With neither set, the API answers 503 and the form offers e-mail/WhatsApp as a fallback.
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const FIELDS = ['tipo', 'nome', 'email', 'telefone', 'empresa', 'cargo', 'assunto', 'produto', 'maquina', 'volume', 'mensagem', 'origem'];
const LABELS = {
  tipo: 'Tipo',
  nome: 'Nome',
  email: 'E-mail',
  telefone: 'Telefone',
  empresa: 'Empresa',
  cargo: 'Cargo / área',
  assunto: 'Assunto',
  produto: 'Produto',
  maquina: 'Tipo de máquina',
  volume: 'Volume de óleo (L)',
  mensagem: 'Mensagem',
  origem: 'Página de origem'
};
const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot filled → bot
  const lead = Object.fromEntries(FIELDS.map(k => [k, String(body[k] ?? '').trim().slice(0, 2000)]));
  if (!lead.nome || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email) || body.consentimento !== true) {
    return NextResponse.json({ ok: false, error: 'missing' }, { status: 422 });
  }
  lead.recebido_em = new Date().toISOString();
  lead.consentimento_lgpd = true;

  const tasks = [];
  if (process.env.LEAD_WEBHOOK_URL) {
    tasks.push(fetch(process.env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) }));
  }
  if (process.env.RESEND_API_KEY && process.env.LEAD_TO_EMAIL) {
    const rows = FIELDS.filter(k => lead[k]).map(k => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${LABELS[k]}</b></td><td>${esc(lead[k]).replace(/\n/g, '<br>')}</td></tr>`);
    tasks.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || 'Site Triple R <onboarding@resend.dev>',
          to: process.env.LEAD_TO_EMAIL.split(',').map(s => s.trim()),
          reply_to: lead.email,
          subject: `[Site] ${lead.tipo === 'catalogo' ? 'Download do catálogo' : 'Pedido de orçamento'} - ${lead.nome}${lead.empresa ? ` (${lead.empresa})` : ''}`,
          html: `<table style="font:14px Arial,sans-serif">${rows.join('')}</table>`
        })
      })
    );
  }
  if (!tasks.length) return NextResponse.json({ ok: false, configured: false }, { status: 503 });
  const results = await Promise.allSettled(tasks);
  const delivered = results.some(r => r.status === 'fulfilled' && r.value.ok);
  if (!delivered) console.error('[lead] delivery failed', results.map(r => (r.status === 'fulfilled' ? r.value.status : r.reason?.message)));
  return NextResponse.json({ ok: delivered }, { status: delivered ? 200 : 502 });
}
