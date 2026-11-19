'use client';

import { useState } from 'react';
import { wa } from '@/lib/site';

export default function ContactForm() {
  const [f, setF] = useState({ nome: '', empresa: '', assunto: 'Orçamento', mensagem: '' });
  const set = k => e => setF(v => ({ ...v, [k]: e.target.value }));
  const submit = e => {
    e.preventDefault();
    const text = [`Olá! Vim pelo site da Triple R.`, `Assunto: ${f.assunto}`, `Nome: ${f.nome}`, f.empresa && `Empresa: ${f.empresa}`, f.mensagem && `Mensagem: ${f.mensagem}`].filter(Boolean).join('\n');
    window.open(wa(text), '_blank', 'noopener');
  };
  return (
    <form className="form" onSubmit={submit}>
      <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Envie sua mensagem</h2>
      <p className="note" style={{ margin: 0 }}>Ao enviar, abrimos uma conversa no WhatsApp com a sua mensagem pronta.</p>
      <div className="form-row">
        <label>Nome<input required value={f.nome} onChange={set('nome')} autoComplete="name" /></label>
        <label>Empresa<input value={f.empresa} onChange={set('empresa')} autoComplete="organization" /></label>
      </div>
      <label>
        Assunto
        <select value={f.assunto} onChange={set('assunto')}>
          <option>Orçamento</option>
          <option>Catálogo</option>
          <option>Vendas</option>
          <option>Compras</option>
          <option>Suporte técnico</option>
          <option>Quero ser parceiro</option>
        </select>
      </label>
      <label>Mensagem<textarea rows={4} value={f.mensagem} onChange={set('mensagem')} placeholder="Conte sobre a máquina, o tipo de óleo e o volume do sistema" /></label>
      <button className="btn btn-wa" type="submit">Enviar pelo WhatsApp</button>
    </form>
  );
}
