import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';

export default function NotFound() {
  useSeo({
    title: 'Sahifa topilmadi',
    description: `${SITE.name} — so\'ralgan sahifa mavjud emas.`,
    path: '/404',
  });

  return (
    <div className="section-container py-24 text-center">
      <p className="text-8xl font-bold text-primary mb-4">404</p>
      <h1 className="heading-2 mb-4">Sahifa topilmadi</h1>
      <p className="body-2 mb-8 max-w-md mx-auto">
        Kechirasiz, bu manzil {SITE.name} da mavjud emas. Bosh sahifadan qidiruvni davom ettiring.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/" className="btn-primary">Bosh sahifa</Link>
        <Link to="/universities" className="btn-secondary">OTMlar</Link>
      </div>
    </div>
  );
}
