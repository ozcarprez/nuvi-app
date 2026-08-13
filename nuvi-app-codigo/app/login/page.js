'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [mode, setMode] = useState('signin');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError('Correo o contraseña incorrectos.'); return; }
    window.location.href = '/dashboard';
  }

  async function handleSignUp(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    if (!businessName.trim()) { setError('Escribe el nombre de tu negocio.'); setLoading(false); return; }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setLoading(false); setError(traducirError(error.message)); return; }

    const userId = data.user?.id;
    if (userId) {
      const slug = businessName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).slice(2, 6);
      const { error: bizError } = await supabase.from('businesses').insert({
        owner_id: userId, name: businessName.trim(), slug,
      });
      if (bizError) { setLoading(false); setError('Tu cuenta se creó, pero hubo un problema guardando el negocio. Intenta iniciar sesión.'); return; }
    }
    setLoading(false);

    if (data.session) {
      window.location.href = '/dashboard';
    } else {
      setError('Cuenta creada. Revisa tu correo para confirmar antes de entrar.');
    }
  }

  function traducirError(msg) {
    if (msg.includes('already registered')) return 'Ese correo ya tiene una cuenta. Inicia sesión.';
    if (msg.includes('Password')) return 'La contraseña debe tener al menos 6 caracteres.';
    return 'No se pudo crear la cuenta. Intenta de nuevo.';
  }

  return (
    <main className="wrap">
      <a href="/" className="back">← Nuvi</a>
      <div className="card">
        <div className="tabs">
          <button className={mode === 'signin' ? 'tab active' : 'tab'} onClick={() => { setMode('signin'); setError(''); }}>Iniciar sesión</button>
          <button className={mode === 'signup' ? 'tab active' : 'tab'} onClick={() => { setMode('signup'); setError(''); }}>Crear cuenta</button>
        </div>

        <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp}>
          {mode === 'signup' && (
            <label className="field">
              Nombre de tu negocio
              <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Sandro's Pizza" required />
            </label>
          )}
          <label className="field">
            Correo
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@negocio.com" required />
          </label>
          <label className="field">
            Contraseña
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
          </label>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Un momento…' : mode === 'signin' ? 'Entrar' : 'Crear mi cuenta'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .wrap { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
        .back { position: absolute; top: 28px; left: 24px; text-decoration: none; font-family: var(--display); font-size: 18px; color: var(--text-dim); }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; width: 100%; max-width: 360px; }
        .tabs { display: flex; gap: 4px; background: var(--surface-2); border-radius: 10px; padding: 4px; margin-bottom: 22px; }
        .tab { flex: 1; background: none; border: none; color: var(--text-dim); padding: 9px; border-radius: 8px; font-size: 14px; }
        .tab.active { background: var(--accent); color: #1A1509; font-weight: 600; }
        .field { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--text-dim); margin-bottom: 14px; }
        .field input {
          background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; color: var(--text);
          padding: 10px 12px; font-size: 14px;
        }
        .error { color: var(--danger); font-size: 13px; margin-bottom: 14px; line-height: 1.5; }
        .submit {
          width: 100%; background: var(--accent); color: #1A1509; font-weight: 600; border: none;
          border-radius: 8px; padding: 12px; font-size: 15px; margin-top: 4px;
        }
        .submit:disabled { opacity: .6; }
      `}</style>
    </main>
  );
}
