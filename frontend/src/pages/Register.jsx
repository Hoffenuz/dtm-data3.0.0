import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSeo } from '../hooks/useSeo';
import AuthLayout, { AuthAlert, AuthField } from '../components/AuthLayout';

export default function Register() {
  useSeo({ title: "Ro'yxatdan o'tish", path: '/register' });
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Parollar mos kelmadi');
      return;
    }
    if (form.password.length < 6) {
      setError('Parol kamida 6 ta belgi bo\'lishi kerak');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signUp(form.email, form.password, form.fullName);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Muvaffaqiyatli!" subtitle="Emailingizni tasdiqlang va tizimga kiring">
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
            ✓
          </div>
          <AuthAlert type="success">
            Tasdiqlash havolasi yuborildi. Tez orada kirish sahifasiga yo&apos;naltirilasiz.
          </AuthAlert>
          <Link to="/login" className="btn-primary inline-flex w-full justify-center py-3 text-sm">
            Hozir kirish
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout wide title="Ro'yxatdan o'tish" subtitle="Bepul hisob oching va barcha imkoniyatlardan foydalaning">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <AuthAlert type="error">{error}</AuthAlert>}

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            id="register-name"
            label="To'liq ism"
            value={form.fullName}
            onChange={handleChange('fullName')}
            placeholder="Ism Familiya"
            autoComplete="name"
          />

          <AuthField
            id="register-email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="email@example.com"
            autoComplete="email"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <AuthField
            id="register-password"
            label="Parol"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Kamida 6 ta belgi"
            autoComplete="new-password"
            minLength={6}
            showToggle
            visible={showPassword}
            onToggleVisible={() => setShowPassword((v) => !v)}
          />

          <AuthField
            id="register-confirm"
            label="Parolni tasdiqlang"
            value={form.confirm}
            onChange={handleChange('confirm')}
            placeholder="Parolni qayta kiriting"
            autoComplete="new-password"
            showToggle
            visible={showConfirm}
            onToggleVisible={() => setShowConfirm((v) => !v)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Yaratilmoqda...' : 'Hisob yaratish'}
        </button>

        <p className="pt-1 text-center text-sm text-grey">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Kirish
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
