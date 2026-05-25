import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const AUTH_PATHS = ['/login', '/register'];

export default function Layout() {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={isAuthPage ? 'flex-1 flex flex-col' : 'flex-1'}>
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
