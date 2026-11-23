import { Manrope, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFab from '@/components/WhatsAppFab';
import { INDEXABLE, SITE_URL } from '@/lib/site';
import { CatalogProvider } from '@/components/Catalog';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-head', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Triple R | Purificação de óleo industrial', template: '%s | Triple R' },
  description:
    'Tecnologia japonesa de purificação de óleo: remove partículas sólidas, água, borra e verniz em um único elemento. Reduza custos de manutenção em até 80%.',
  icons: { icon: 'https://triple-rrr.com.br/wp-content/uploads/2023/07/cropped-Logo-1-32x32.png' },
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Triple R' }
};

export const viewport = { themeColor: '#080059' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${manrope.variable}`}>
      <body>
        <CatalogProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFab />
        </CatalogProvider>
      </body>
    </html>
  );
}
