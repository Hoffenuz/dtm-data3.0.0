import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useSeo } from '../hooks/useSeo';
import { SITE } from '../config/site';

export default function Contact() {
  useSeo({
    title: 'Aloqa',
    description: 'dtmdata jamoasi bilan bog\'laning — savol va takliflaringizni yuboring.',
    path: '/contact',
  });

  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.sendContact(form);
      setStatus({ type: 'success', text: res.message });
      setForm({ ...form, subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="section-container grid lg:grid-cols-2 gap-12">
        <div>
          <h1 className="heading-2 mb-4">Biz bilan bog&apos;laning</h1>
          <p className="body-2 mb-8">
            Savol, taklif yoki hamkorlik bo&apos;yicha xabar yuboring. {SITE.name} jamoasi tez orada javob beradi.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-silver rounded-lg">
              <span className="text-2xl">✈️</span>
              <div>
                <p className="font-medium">Telegram</p>
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  {SITE.telegramHandle}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-silver rounded-lg">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-medium">Telefon</p>
                <a href={`tel:${SITE.phoneTel}`} className="text-primary text-sm hover:underline">
                  {SITE.phone}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-silver rounded-lg">
              <span className="text-2xl">🌐</span>
              <div>
                <p className="font-medium">Sayt</p>
                <p className="text-grey text-sm">{SITE.url}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 card-shadow space-y-5">
          <h2 className="heading-4">Xabar yuborish</h2>

          {status && (
            <p className={`text-sm p-3 rounded ${status.type === 'success' ? 'bg-primary/10 text-success' : 'bg-error/10 text-error'}`}>
              {status.text}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ism *</label>
              <input required value={form.name} onChange={handleChange('name')}
                className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" required value={form.email} onChange={handleChange('email')}
                className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <input value={form.phone} onChange={handleChange('phone')} placeholder="+998-993333177"
              className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mavzu *</label>
            <input required value={form.subject} onChange={handleChange('subject')}
              className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Xabar *</label>
            <textarea required rows={5} value={form.message} onChange={handleChange('message')}
              className="w-full px-4 py-3 border border-grey-blue rounded-lg focus:ring-2 focus:ring-primary focus:outline-none resize-none" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Yuborilmoqda...' : 'Xabar yuborish'}
          </button>
        </form>
      </div>
    </div>
  );
}
