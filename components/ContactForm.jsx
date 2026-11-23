'use client';

import { useEffect, useState } from 'react';
import { EMAIL, wa } from '@/lib/site';

const EMPTY = { nome: '', email: '', telefone: '', empresa: '', cargo: '', assunto: 'Orçamento', produto: '', maquina: '', volume: '', mensagem: '', consentimento: false, website: '' };

const summary = f =>
  [
    `Assunto: ${f.assunto}`,
    f.produto && `Produto: ${f.produto}`,
    `Nome: ${f.nome}`,
    f.empresa && `Empresa: ${f.empresa}`,
    f.cargo && `Cargo / área: ${f.cargo}`,
    `E-mail: ${f.email}`,
    f.telefone && `Telefone: ${f.telefone}`,
    f.maquina && `Tipo de máquina: ${f.maquina}`,
    f.volume && `Volume de óleo: ${f.volume} L`,
    f.mensagem && `Mensagem: ${f.mensagem}`
  ]
    .filter(Boolean)
    .join('\n');

export default function ContactForm() {
  const [f, setF] = useState(EMPTY);
  const [state, setState] = useState('idle'); // idle | sending | sent | fallback | invalid | error
  const set = k => e => setF(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('produto');
    if (p) setF(v => ({ ...v, produto: p, assunto: 'Orçamento' }));
  }, []);

  const submit = async e => {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, tipo: 'orcamento', origem: window.location.pathname + window.location.search })
      });
      if (res.ok) return setState('sent');
      if (res.status === 422) return setState('invalid');
      setState(res.status === 503 ? 'fallback' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="form form--done" role="status">
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Recebemos seu pedido</h2>
        <p style={{ margin: 0 }}>Obrigado, {f.nome.split(' ')[0]}! Nossa equipe técnica responde por e-mail ou telefone.</p>
      </div>
    );
  }

  const text = `Olá! Vim pelo site da Triple R.\n${summary(f)}`;
  return (
    <form className="form" id="orcamento" onSubmit={submit}>
      <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Pedir orçamento</h2>
      <p className="note" style={{ margin: 0 }}>Respondemos por e-mail ou telefone. Campos com * são obrigatórios.</p>
      <div className="form-row">
        <label>Nome*<input required value={f.nome} onChange={set('nome')} autoComplete="name" /></label>
        <label>Empresa<input value={f.empresa} onChange={set('empresa')} autoComplete="organization" /></label>
      </div>
      <div className="form-row">
        <label>E-mail*<input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label>Telefone / WhatsApp*<input required type="tel" value={f.telefone} onChange={set('telefone')} autoComplete="tel" placeholder="(11) 90000-0000" /></label>
      </div>
      <div className="form-row">
        <label>
          Assunto
          <select value={f.assunto} onChange={set('assunto')}>
            <option>Orçamento</option>
            <option>Dúvida técnica</option>
            <option>Elementos de reposição</option>
            <option>Suporte</option>
            <option>Quero ser parceiro</option>
          </select>
        </label>
        <label>Cargo / área<input value={f.cargo} onChange={set('cargo')} placeholder="Manutenção, engenharia, compras…" /></label>
      </div>
      {f.produto ? <label>Produto de interesse<input value={f.produto} onChange={set('produto')} /></label> : null}
      <div className="form-row">
        <label>Tipo de máquina<input value={f.maquina} onChange={set('maquina')} placeholder="Ex.: injetora, prensa, redutor, turbina" /></label>
        <label>Volume de óleo do sistema (L)<input inputMode="numeric" value={f.volume} onChange={set('volume')} placeholder="Ex.: 600" /></label>
      </div>
      <label>Mensagem<textarea rows={4} value={f.mensagem} onChange={set('mensagem')} placeholder="Tipo de óleo, problema atual (água, verniz, partículas), quantidade de máquinas…" /></label>
      <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} aria-hidden="true" />
      <label className="check">
        <input type="checkbox" required checked={f.consentimento} onChange={set('consentimento')} />
        <span>Autorizo a Triple R a usar estes dados para responder ao meu pedido e entrar em contato sobre soluções, conforme a LGPD (Lei 13.709/2018). Posso pedir a exclusão a qualquer momento por {EMAIL}.</span>
      </label>
      {state === 'invalid' ? <p className="form-error">Confira nome, e-mail, telefone e o consentimento.</p> : null}
      {state === 'fallback' || state === 'error' ? (
        <div className="form-fallback" role="alert">
          <p>Não conseguimos enviar automaticamente. Envie o mesmo pedido por um destes canais:</p>
          <div className="row-gap">
            <a className="btn btn-primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Pedido de orçamento - ${f.nome}`)}&body=${encodeURIComponent(summary(f))}`}>Enviar por e-mail</a>
            <a className="btn btn-wa" href={wa(text)} target="_blank" rel="noopener">Enviar pelo WhatsApp</a>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Enviando…' : 'Enviar pedido'}
        </button>
      )}
    </form>
  );
}
