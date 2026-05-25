import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SITE } from '../config/site';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/universities', label: 'OTMlar' },
  { to: '/scores', label: 'Kirish ballari' },
  { to: '/tests', label: 'DTM testlar' },
  { to: '/calculator', label: 'Kalkulyator' },
  { to: '/news', label: 'Yangiliklar' },
  { to: '/contact', label: 'Aloqa' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="section-container flex items-center justify-between h-[84px]">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label={`${SITE.name} bosh sahifa`}>
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">DTM</span>
          </div>
          <span className="text-xl font-semibold text-secondary">
            {SITE.name.slice(0, 3)}<span className="text-primary">{SITE.name.slice(3)}</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center gap-6" aria-label="Asosiy navigatsiya">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary whitespace-nowrap ${
                  isActive ? 'text-primary' : 'text-grey'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {!loading && (
            user ? (
              <>
                <Link to="/profile" className="text-sm font-medium text-grey hover:text-primary">
                  {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </Link>
                <button type="button" onClick={signOut} className="text-sm text-grey hover:text-error">
                  Chiqish
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-grey hover:text-primary">Kirish</Link>
                <Link to="/register" className="btn-secondary text-sm py-2">Ro&apos;yxatdan o&apos;tish</Link>
              </>
            )
          )}
        </div>

        <button
          type="button"
          className="xl:hidden p-2"
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
        <div className="xl:hidden border-t bg-white px-4 py-4 space-y-3">
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
          <NavLink to="/career-test" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-grey">
            Kasb testi
          </NavLink>
          {!loading && (
            user ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-primary">Profil</Link>
                <button type="button" onClick={() => { signOut(); setOpen(false); }} className="block py-2 text-sm text-error">Chiqish</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">Kirish</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full text-center">Ro&apos;yxatdan o&apos;tish</Link>
              </>
            )
          )}
        </div>
      )}
    </header>
  );
}
