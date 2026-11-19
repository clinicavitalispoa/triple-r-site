import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFab from '@/components/WhatsAppFab';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata = {
  title: { default: 'Triple R | Purificação de óleo industrial', template: '%s | Triple R' },
  description:
    'Tecnologia japonesa de purificação de óleo: remove partículas sólidas, água, borra e verniz em um único elemento. Reduza custos de manutenção em até 80%.',
  icons: { icon: 'https://triple-rrr.com.br/wp-content/uploads/2023/07/cropped-Logo-1-32x32.png' },
  robots: { index: false, follow: false }
};

export const viewport = { themeColor: '#080059' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
