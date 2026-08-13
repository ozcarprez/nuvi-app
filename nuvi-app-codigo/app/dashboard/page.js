'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const LADA = '52';
const fmt = n => '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const today = () => new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
const waLink = (phone, text) => `https://wa.me/${LADA}${phone}?text=${encodeURIComponent(text)}`;

export default function Dashboard() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [business, setBusiness] = useState(null);
  const [clients, setClients] = useState([]);
  const [selected, setSelected] = useState(null);
  const [moves, setMoves] = useState([]);
  const [search, setSearch] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [amount, setAmount] = useState('');
  const [bonusPct, setBonusPct] = useState(20);
  const [waMsg, setWaMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => { init(); }, []);

  async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { window.location.href = '/login'; return; }

    let { data: biz } = await supabase.from('businesses').select('*').eq('owner_id', session.user.id).maybeSingle();
    if (!biz) {
      const slug = 'negocio-' + Math.random().toString(36).slice(2, 8);
      const { data: created } = await supabase.from('businesses')
        .insert({ owner_id: session.user.id, name: 'Mi negocio', slug }).select().single();
      biz = created;
    }
    setBusiness(biz);
    setBonusPct(biz.bonus_pct);
    await loadClients(biz.id);
    setLoadingAuth(false);
  }

  async function loadClients(businessId) {
    const { data } = await supabase.from('clients').select('*').eq('business_id', businessId).order('name');
    setClients(data || []);
  }

  async function loadMoves(clientId) {
    const { data } = await supabase.from('transactions').select('*').eq('client_id', clientId).order('created_at', { ascending: false }).limit(5);
    setMoves(data || []);
  }

  async function selectClient(c) {
    setSelected(c); setWaMsg(null); setAmount(''); setErr('');
    await loadMoves(c.id);
  }

  async function addClient(e) {
    e.preventDefault();
    setErr('');
    const phone = newPhone.trim();
    if (phone.length < 8 || !newName.trim()) { setErr('Escribe un teléfono válido y un nombre.'); return; }
    const { data, error } = await supabase.from('clients')
      .insert({ business_id: business.id, phone, name: newName.trim(), balance: 0 }).select().single();
    if (error) { setErr(error.message.includes('duplicate') ? 'Ese teléfono ya está registrado.' : 'No se pudo agregar el cliente.'); return; }
    setNewPhone(''); setNewName('');
    await loadClients(business.id);
    selectClient(data);
  }

  async function saveBonus(v) {
    setBonusPct(v);
    await supabase.from('businesses').update({ bonus_pct: v }).eq('id', business.id);
  }

  async function recharge() {
    const v = parseFloat(amount);
    if (!v || v <= 0) return;
    setBusy(true);
    const bonus = v * bonusPct / 100;
    const newBalance = Number(selected.balance) + v + bonus;
    await supabase.from('clients').update({ balance: newBalance }).eq('id', selected.id);
    await supabase.from('transactions').insert({ business_id: business.id, client_id: selected.id, type: 'recarga', amount: v, bonus });
    const updated = { ...selected, balance: newBalance };
    setSelected(updated);
    await loadClients(business.id);
    await loadMoves(selected.id);
    setAmount(''); setBusy(false);
    setWaMsg(`Hola ${updated.name}, cargaste ${fmt(v)} (+${fmt(bonus)} de bono) el ${today()}. Tu nuevo saldo es ${fmt(newBalance)}.`);
  }

  async function consume() {
    const v = parseFloat(amount);
    if (!v || v <= 0 || v > selected.balance) { setErr('El monto no puede ser mayor al saldo disponible.'); return; }
    setBusy(true); setErr('');
    const newBalance = Number(selected.balance) - v;
    await supabase.from('clients').update({ balance: newBalance }).eq('id', selected.id);
    await supabase.from('transactions').insert({ business_id: business.id, client_id: selected.id, type: 'consumo', amount: v });
    const updated = { ...selected, balance: newBalance };
    setSelected(updated);
    await loadClients(business.id);
    await loadMoves(selected.id);
    setAmount(''); setBusy(false);
    setWaMsg(`Hola ${updated.name}, usaste ${fmt(v)} de tu saldo el ${today()}. Te quedan ${fmt(newBalance)} disponibles.`);
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  if (loadingAuth) return <main className="loading">Cargando tu caja…</main>;

  const filtered = clients.filter(c => c.phone.includes(search) || c.name.toLowerCase().includes(search.toLowerCase()));
  const previewBonus = amount ? Number(amount) * bonusPct / 100 : 0;

  return (
    <main className="dash">
      <header className="topbar">
        <span className="biz-name">{business.name}</span>
        <button className="signout" onClick={signOut}>Cerrar sesión</button>
      </header>

      <div className="layout">
        <div className="col">
          <input className="search" placeholder="Buscar por teléfono o nombre" value={search} onChange={e => setSearch(e.target.value)} />

          <form className="panel" onSubmit={addClient}>
            <div className="panel-label">Registrar nuevo cliente</div>
            <input placeholder="Teléfono (10 dígitos)" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
            <input placeholder="Nombre" value={newName} onChange={e => setNewName(e.target.value)} />
            <button type="submit" className="btn-primary full">Agregar cliente</button>
          </form>

          <div className="list">
            {filtered.length === 0 && <div className="empty">Sin clientes todavía</div>}
            {filtered.map(c => (
              <div key={c.id} className={'client-row' + (selected?.id === c.id ? ' active' : '')} onClick={() => selectClient(c)}>
                <div className="client-name">{c.name}</div>
                <div className="client-phone">{c.phone}</div>
                <div className="client-balance">{fmt(c.balance)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col">
          {!selected && <div className="card empty-card">Selecciona o registra un cliente</div>}
          {selected && (
            <div className="card">
              <div className="card-head">
                <span className="card-name">{selected.name}</span>
                <span className="card-phone">{selected.phone}</span>
              </div>
              <div className="balance-block">
                <div className="balance-label">SALDO DISPONIBLE</div>
                <div className="balance-amount">{fmt(selected.balance)}</div>
              </div>

              <div className="bonus-row">
                <label>Bono al cargar</label>
                <input type="number" min="0" max="100" value={bonusPct} onChange={e => saveBonus(parseFloat(e.target.value) || 0)} />
                <span>%</span>
              </div>

              <input type="number" placeholder="Monto en pesos" value={amount} onChange={e => setAmount(e.target.value)} className="amount-input" />
              {amount > 0 && <div className="preview">Bono: {fmt(previewBonus)} · Total a saldo: {fmt(Number(amount) + previewBonus)}</div>}

              <div className="actions">
                <button className="btn-primary" disabled={busy} onClick={recharge}>Cargar efectivo</button>
                <button className="btn-ghost" disabled={busy} onClick={consume}>Descontar consumo</button>
              </div>

              {err && <div className="error">{err}</div>}
              {waMsg && <a className="wa-link" href={waLink(selected.phone, waMsg)} target="_blank" rel="noreferrer">Enviar confirmación por WhatsApp →</a>}

              <div className="history">
                {moves.length === 0 && <div className="empty">Sin movimientos</div>}
                {moves.map(m => (
                  <div className="move" key={m.id}>
                    <span>{m.type === 'recarga' ? 'Recarga + bono' : 'Consumo'} · {new Date(m.created_at).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}</span>
                    <span className={m.type === 'recarga' ? 'move-in' : ''}>{m.type === 'recarga' ? '+' : '-'}{fmt(Number(m.amount) + Number(m.bonus || 0))}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .loading { min-height: 100vh; display: flex; align-items: center; justify-content: center; color: var(--text-dim); }
        .dash { max-width: 960px; margin: 0 auto; padding: 24px; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .biz-name { font-family: var(--display); font-size: 20px; font-weight: 600; }
        .signout { background: none; border: 1px solid var(--border); color: var(--text-dim); border-radius: 8px; padding: 8px 14px; font-size: 13px; }
        .layout { display: grid; grid-template-columns: 300px 1fr; gap: 18px; }
        @media (max-width: 720px) { .layout { grid-template-columns: 1fr; } }
        .search, .panel input, .amount-input, .bonus-row input {
          width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px;
          color: var(--text); padding: 10px 12px; font-size: 14px;
        }
        .search { margin-bottom: 10px; }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 14px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px; }
        .panel-label { font-size: 13px; color: var(--text-dim); margin-bottom: 4px; }
        .full { width: 100%; }
        .btn-primary { background: var(--accent); color: #1A1509; font-weight: 600; border: none; border-radius: 8px; padding: 10px; font-size: 14px; }
        .btn-primary:disabled { opacity: .6; }
        .btn-ghost { background: var(--surface-2); border: 1px solid var(--border); color: var(--text); border-radius: 8px; padding: 10px; font-size: 14px; }
        .list { display: flex; flex-direction: column; gap: 6px; }
        .empty { color: var(--text-dim); font-size: 14px; text-align: center; padding: 2rem 0; }
        .client-row { cursor: pointer; padding: 10px; border-radius: 8px; border: 1px solid var(--border); background: var(--surface); }
        .client-row.active { background: var(--surface-2); border-color: var(--accent); }
        .client-name { font-size: 14px; font-weight: 600; }
        .client-phone { font-size: 12px; color: var(--text-dim); }
        .client-balance { font-size: 13px; color: var(--accent); margin-top: 2px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
        .empty-card { display: flex; align-items: center; justify-content: center; color: var(--text-dim); min-height: 200px; }
        .card-head { display: flex; justify-content: space-between; align-items: baseline; }
        .card-name { font-size: 16px; font-weight: 600; }
        .card-phone { font-size: 13px; color: var(--text-dim); }
        .balance-block { text-align: center; padding: 16px 0; font-family: var(--mono); border-top: 1px dashed var(--border); border-bottom: 1px dashed var(--border); margin: 12px 0; }
        .balance-label { font-size: 11px; letter-spacing: .08em; color: var(--text-dim); }
        .balance-amount { font-size: 32px; font-weight: 600; color: var(--accent); }
        .bonus-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 13px; color: var(--text-dim); }
        .bonus-row input { width: 64px; }
        .amount-input { margin-bottom: 8px; }
        .preview { font-size: 12px; color: var(--text-dim); margin-bottom: 6px; }
        .actions { display: flex; gap: 8px; margin-top: 6px; }
        .actions button { flex: 1; }
        .error { color: var(--danger); font-size: 13px; margin-top: 8px; }
        .wa-link { display: inline-block; color: var(--success); text-decoration: none; font-size: 13px; margin-top: 10px; }
        .history { margin-top: 14px; border-top: 1px solid var(--border); padding-top: 10px; }
        .move { display: flex; justify-content: space-between; font-size: 13px; padding: 5px 0; color: var(--text-dim); }
        .move-in { color: var(--success); }
      `}</style>
    </main>
  );
}
