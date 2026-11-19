'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GooeyNav from './reactbits/GooeyNav/GooeyNav';
import { LOGO, NAV, wa } from '@/lib/site';

const activeFor = path => {
  if (path === '/') return 0;
  if (path.startsWith('/produto')) return 2;
  const i = NAV.findIndex((n, idx) => idx > 0 && path.startsWith(n.href));
  return i < 0 ? 0 : i;
};

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(activeFor(path));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setActive(activeFor(path));
    setOpen(false);
  }, [path]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Triple R - página inicial">
          <img src={LOGO} alt="Triple R" width="176" height="44" />
        </Link>
        <div className="desktop-nav">
          <GooeyNav
            items={NAV}
            activeIndex={active}
            onChange={i => setActive(i)}
            onNavigate={item => setTimeout(() => router.push(item.href), 380)}
            theme="light"
            color="#080059"
            activeTextColor="#ffffff"
            colors={['#080059', '#0086D1']}
            size="sm"
          />
        </div>
        <a className="btn btn-primary header-cta" href={wa('Olá! Vim pelo site da Triple R e gostaria de um orçamento.')} target="_blank" rel="noopener">
          Pedir orçamento
        </a>
        <button className="burger" aria-label="Abrir menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav className={`mobile-nav${open ? ' is-open' : ''}`} aria-label="Menu">
        {NAV.map((n, i) => (
          <Link key={n.href} href={n.href} className={i === active ? 'is-active' : ''}>
            {n.label}
          </Link>
        ))}
        <a className="btn btn-primary" href={wa('Olá! Vim pelo site da Triple R e gostaria de um orçamento.')} target="_blank" rel="noopener">
          Pedir orçamento no WhatsApp
        </a>
      </nav>
    </header>
  );
}
