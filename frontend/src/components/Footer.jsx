import { Link } from 'react-router-dom';
import { SITE } from '../config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="bg-silver py-16">
        <div className="section-container text-center">
          <h2 className="heading-2 max-w-2xl mx-auto mb-6">
            OTM tanlashni {SITE.name} ga qoldiring — siz faqat o&apos;qishga tayyorlaning!
          </h2>
          <Link to="/calculator" className="btn-primary">
            Ball kalkulyatori
          </Link>
        </div>
      </div>

      <div className="bg-secondary text-white py-12">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DTM</span>
                </div>
                <span className="text-lg font-semibold">{SITE.name}</span>
              </div>
              <p className="text-sm text-grey-blue leading-6">
                {SITE.description}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Bo&apos;limlar</h4>
              <ul className="space-y-2 text-sm text-grey-blue">
                <li><Link to="/universities" className="hover:text-primary transition-colors">OTMlar</Link></li>
                <li><Link to="/scores" className="hover:text-primary transition-colors">Kirish ballari</Link></li>
                <li><Link to="/calculator" className="hover:text-primary transition-colors">Kalkulyator</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Aloqa</Link></li>
                <li><Link to="/tests" className="hover:text-primary transition-colors">DTM testlar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Qo&apos;shimcha</h4>
              <ul className="space-y-2 text-sm text-grey-blue">
                <li><Link to="/career-test" className="hover:text-primary transition-colors">Kasbga yo&apos;naltirish</Link></li>
                <li><Link to="/private" className="hover:text-primary transition-colors">Xususiy OTMlar</Link></li>
                <li><Link to="/universities?region=xorazm" className="hover:text-primary transition-colors">Xorazm OTMlari</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Aloqa</h4>
              <ul className="space-y-2 text-sm text-grey-blue">
                <li>
                  <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {SITE.telegramHandle}
                  </a>
                </li>
                <li>
                  <a href={`tel:${SITE.phoneTel}`} className="hover:text-primary transition-colors">
                    {SITE.phone}
                  </a>
                </li>
                <li>Toshkent, O&apos;zbekiston</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-grey-dark pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-grey-blue">
            <p>&copy; {year} {SITE.name}. Barcha huquqlar himoyalangan.</p>
            <div className="flex gap-4">
              <a href={`${SITE.url}/robots.txt`} className="hover:text-primary">Robots</a>
              <a href={`${SITE.url}/sitemap.xml`} className="hover:text-primary">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
