import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';
import AuthLayout, { AuthAlert, AuthField } from '../components/AuthLayout';

export default function Login() {
  useSeo({ title: 'Kirish', path: '/login' });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Email yoki parol noto\'g\'ri'
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Tizimga kirish" subtitle="Email va parolingiz bilan kiring">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthAlert type="error">{error}</AuthAlert>}

        <AuthField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          autoComplete="email"
        />

        <AuthField
          id="login-password"
          label="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          minLength={6}
          showToggle
          visible={showPassword}
          onToggleVisible={() => setShowPassword((v) => !v)}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-3 w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Kirish...' : 'Kirish'}
        </button>

        <p className="pt-1 text-center text-sm text-grey">
          Hisobingiz yo&apos;qmi?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Ro&apos;yxatdan o&apos;tish
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
