'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CATALOG_PDF } from '@/lib/site';

// "Baixar catálogo": short form (name + e-mail + company + LGPD consent) that registers the lead
// and then releases the PDF. Visitors who already filled it in download directly.
const Ctx = createContext(() => {});
const KEY = 'trr-catalog-lead';

const download = () => {
  const a = document.createElement('a');
  a.href = CATALOG_PDF;
  a.download = 'catalogo-triple-r.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export function CatalogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const openCatalog = useCallback(from => {
    let known = false;
    try {
      known = localStorage.getItem(KEY) === '1';
    } catch {}
    if (known) return download();
    setOrigin(from || window.location.pathname);
    setOpen(true);
  }, []);
  return (
    <Ctx.Provider value={openCatalog}>
      {children}
      {open ? <CatalogDialog origin={origin} onClose={() => setOpen(false)} /> : null}
    </Ctx.Provider>
  );
}

export function CatalogButton({ children = 'Baixar catálogo', className = 'btn btn-ghost', from }) {
  const openCatalog = useContext(Ctx);
  return (
    <button type="button" className={className} onClick={() => openCatalog(from)}>
      {children}
    </button>
  );
}

function CatalogDialog({ origin, onClose }) {
  const ref = useRef(null);
  const [state, setState] = useState('idle');
  const [f, setF] = useState({ nome: '', email: '', empresa: '', consentimento: false, website: '' });
  const set = k => e => setF(v => ({ ...v, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  useEffect(() => {
    const d = ref.current;
    d?.showModal?.();
    const onCancel = e => {
      e.preventDefault();
      onClose();
    };
    d?.addEventListener('cancel', onCancel);
    return () => d?.removeEventListener('cancel', onCancel);
  }, [onClose]);

  const submit = async e => {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, tipo: 'catalogo', assunto: 'Download do catálogo', origem: origin })
      });
      if (res.status === 422) return setState('invalid');
    } catch {
      /* network error: still release the catalogue */
    }
    try {
      localStorage.setItem(KEY, '1');
    } catch {}
    download();
    setState('done');
  };

  return (
    <dialog ref={ref} className="modal" aria-labelledby="catalog-title" onClick={e => e.target === ref.current && onClose()}>
      <div className="modal__box">
        <button type="button" className="modal__close" aria-label="Fechar" onClick={onClose}>
          ×
        </button>
        {state === 'done' ? (
          <div className="modal__done">
            <h2 id="catalog-title">Download iniciado</h2>
            <p>Obrigado! Se o download não começar, <a href={CATALOG_PDF} download>clique aqui para baixar o catálogo</a>.</p>
            <button type="button" className="btn btn-primary" onClick={onClose}>Fechar</button>
          </div>
        ) : (
          <form className="form form--plain" onSubmit={submit}>
            <span className="eyebrow">Catálogo em PDF</span>
            <h2 id="catalog-title" style={{ margin: 0 }}>Baixe o catálogo completo</h2>
            <p className="note" style={{ margin: 0 }}>16 linhas de produto e 79 modelos, com especificações técnicas.</p>
            <label>Nome*<input required value={f.nome} onChange={set('nome')} autoComplete="name" /></label>
            <label>E-mail corporativo*<input required type="email" value={f.email} onChange={set('email')} autoComplete="email" /></label>
            <label>Empresa<input value={f.empresa} onChange={set('empresa')} autoComplete="organization" /></label>
            <input className="hp" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} aria-hidden="true" />
            <label className="check">
              <input type="checkbox" required checked={f.consentimento} onChange={set('consentimento')} />
              <span>Autorizo a Triple R a usar meus dados para enviar o catálogo e entrar em contato sobre soluções, conforme a LGPD. Posso pedir a exclusão a qualquer momento.</span>
            </label>
            {state === 'invalid' ? <p className="form-error">Confira o nome, o e-mail e o consentimento.</p> : null}
            <button className="btn btn-primary" type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Enviando…' : 'Baixar catálogo (PDF)'}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
