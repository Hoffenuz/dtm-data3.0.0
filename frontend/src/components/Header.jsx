import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SITE } from '../config/site';

const navLinks = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/universities', label: 'OTMlar' },
  { to: '/scores', label: 'Kirish ballari' },
  { to: '/calculator', label: 'Kalkulyator' },
  { to: '/news', label: 'Yangiliklar' },
  { to: '/career-test', label: 'Kasb testi' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="section-container flex items-center justify-between h-[84px]">
        <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} bosh sahifa`}>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">DTM</span>
          </div>
          <span className="text-xl font-semibold text-secondary">
            {SITE.name.slice(0, 3)}<span className="text-primary">{SITE.name.slice(3)}</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Asosiy navigatsiya">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-grey'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <Link to="/calculator" className="hidden lg:inline-flex btn-primary text-sm py-2.5">
          Ball hisoblash
        </Link>

        <button
          type="button"
          className="lg:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Menyu"
          aria-expanded={open}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t bg-white px-4 py-4 space-y-3">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-grey'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <Link to="/calculator" onClick={() => setOpen(false)} className="btn-primary w-full text-center">
            Ball hisoblash
          </Link>
        </div>
      )}
    </header>
  );
}
