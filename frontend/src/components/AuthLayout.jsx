export function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = true,
  minLength,
  autoComplete,
  showToggle,
  visible,
  onToggleVisible,
  className = '',
}) {
  const inputType = showToggle ? (visible ? 'text' : 'password') : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-secondary">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          required={required}
          minLength={minLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-grey-blue/70 bg-white px-4 py-3 text-sm text-secondary shadow-sm transition-all placeholder:text-grey-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleVisible}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-grey hover:text-primary"
            aria-label={visible ? 'Parolni yashirish' : 'Parolni ko\'rsatish'}
          >
            {visible ? 'Yashirish' : 'Ko\'rish'}
          </button>
        )}
      </div>
    </div>
  );
}

export function AuthAlert({ type = 'error', children }) {
  const styles = {
    error: 'border-error/20 bg-error/5 text-error',
    success: 'border-primary/20 bg-primary/5 text-success',
  };

  return (
    <p className={`rounded-xl border px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {children}
    </p>
  );
}

export default function AuthLayout({ title, subtitle, children, wide = false }) {
  return (
    <section className="relative flex min-h-[calc(100vh-84px)] items-center justify-center bg-silver px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -left-16 bottom-1/4 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className={`relative w-full ${wide ? 'max-w-[540px]' : 'max-w-[440px]'}`}>
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-grey-blue/20">
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary to-primary-dark" aria-hidden="true" />

          <div className="border-b border-silver/80 bg-silver/30 px-7 py-5">
            <h1 className="text-xl font-semibold tracking-tight text-secondary">{title}</h1>
            {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-grey">{subtitle}</p>}
          </div>

          <div className="px-7 py-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
