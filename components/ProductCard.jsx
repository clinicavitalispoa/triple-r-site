import Image from 'next/image';
import Link from 'next/link';
import SpotlightCard from './reactbits/SpotlightCard/SpotlightCard';
import { cardImg } from '@/lib/site';

export default function ProductCard({ href, image, title, kicker, text, badge, cta = 'Conheça' }) {
  return (
    <Link href={href} className="pcard-link">
      <SpotlightCard theme="light" spotlightColor="#0086D1" intensity={0.5} spotlightSize={260} className="pcard">
        <div className="pcard__media">
          {image ? <Image src={cardImg(image)} alt="" fill sizes="(max-width: 700px) 90vw, 300px" /> : null}
        </div>
        <div className="pcard__body">
          {kicker ? <span className="kicker">{kicker}</span> : null}
          <h3>{title}</h3>
          {text ? <p>{text}</p> : null}
          {badge ? <span className="pcard__badge">{badge}</span> : null}
          <span className="pcard__cta">
            {cta} <span aria-hidden="true">→</span>
          </span>
        </div>
      </SpotlightCard>
    </Link>
  );
}
