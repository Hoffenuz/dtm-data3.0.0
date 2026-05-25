import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';

export default function Profile() {
  useSeo({ title: 'Profil', path: '/profile' });
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: '', phone: '', region: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.getProfile()
        .then((data) => {
          setProfile(data);
          setForm({ full_name: data.full_name || '', phone: data.phone || '', region: data.region || '' });
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (authLoading) return <div className="section-container py-20 text-center">Yuklanmoqda...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const data = await api.updateProfile(form);
      setProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="section-container py-12 max-w-lg mx-auto">
      <h1 className="heading-2 mb-6">Mening profilim</h1>

      <div className="bg-silver rounded-xl p-6 mb-6">
        <p className="text-sm text-grey">Email</p>
        <p className="font-medium">{profile?.email || user.email}</p>
      </div>

      {loading ? (
        <p className="text-grey">Yuklanmoqda...</p>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-xl p-8 card-shadow space-y-5">
          {saved && <p className="text-success text-sm bg-primary/10 p-3 rounded">Saqlandi!</p>}

          <div>
            <label className="block text-sm font-medium mb-1">To&apos;liq ism</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Viloyat</label>
            <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>

          <button type="submit" className="btn-primary w-full">Saqlash</button>
        </form>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link to="/tests" className="btn-secondary text-center">Mening test natijalarim</Link>
        <button onClick={signOut} className="text-error text-sm hover:underline">Chiqish</button>
      </div>
    </div>
  );
}
