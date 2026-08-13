'use client';

export default function Landing() {
  return (
    <main>
      <nav className="nav">
        <span className="wordmark">Nuvi</span>
        <a href="/login" className="nav-cta">Entrar</a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Para negocios de Tijuana con clientes que regresan</span>
          <h1>
            Tu negocio ya tiene el capital.<br />
            Está en el bolsillo de tus <em>clientes de siempre.</em>
          </h1>
          <p className="lede">
            Con Nuvi, tu cliente carga saldo hoy y tú recibes el efectivo hoy —
            a cambio le das un bono que se va gastando visita tras visita.
            Sin apps que instalar, sin terminal nueva, sin letra chica.
          </p>
          <div className="hero-actions">
            <a href="/login" className="btn-primary">Crear mi cuenta</a>
            <a href="#como-funciona" className="btn-ghost">Ver cómo funciona</a>
          </div>
        </div>

        <div className="receipt" aria-hidden="true">
          <div className="receipt-head">
            <span>NUVI · CAJA</span>
            <span>Ticket #0842</span>
          </div>
          <div className="receipt-row">
            <span>Cliente</span>
            <span>Carlos Ruiz</span>
          </div>
          <div className="receipt-row">
            <span>Recarga</span>
            <span>$500.00</span>
          </div>
          <div className="receipt-row accent">
            <span>Bono (20%)</span>
            <span>+$100.00</span>
          </div>
          <div className="receipt-divider" />
          <div className="receipt-row total">
            <span>Saldo a favor</span>
            <span>$600.00</span>
          </div>
          <div className="receipt-foot">Confirmado por WhatsApp ✓</div>
        </div>
      </section>

      <section className="how" id="como-funciona">
        <h2>Así entra el dinero antes de que lo gastes</h2>
        <div className="how-grid">
          <div className="how-card">
            <span className="how-num">Hoy</span>
            <p>Tu cliente carga $500 en su cuenta Nuvi. Ese efectivo entra a tu caja de inmediato — no es una promesa, es dinero real en tu bolsillo hoy.</p>
          </div>
          <div className="how-card">
            <span className="how-num">A cambio</span>
            <p>Le das un bono que tú decides — por ejemplo 20% extra de saldo. Es más barato que un descuento, porque solo se cobra cuando el cliente regresa.</p>
          </div>
          <div className="how-card">
            <span className="how-num">Después</span>
            <p>El cliente va gastando su saldo en cada visita. Nuvi lleva el control y le manda confirmación por WhatsApp — sin que tengas que anotar nada a mano.</p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Panel de caja simple</h3>
          <p>Buscas al cliente por teléfono o nombre, cargas o descuentas saldo en dos clics. Pensado para usarse parado, en el mostrador, entre pedidos.</p>
        </div>
        <div className="feature">
          <h3>Bono a tu medida</h3>
          <p>Tú decides el porcentaje de bono — 10%, 20%, lo que te haga sentido según tu margen. Lo puedes ajustar cuando quieras.</p>
        </div>
        <div className="feature">
          <h3>Confirmación automática</h3>
          <p>Cada recarga o consumo genera un mensaje de WhatsApp listo para enviar al cliente, con su nuevo saldo. Cero confusión, cero reclamos.</p>
        </div>
      </section>

      <section className="pricing">
        <h2>Un precio, sin sorpresas</h2>
        <div className="price-card">
          <div className="price-top">
            <span className="price-name">Plan Básico</span>
            <span className="price-amount">$349<span className="price-period"> MXN / mes</span></span>
          </div>
          <ul className="price-list">
            <li>Clientes y saldo ilimitados</li>
            <li>Bono configurable</li>
            <li>Confirmaciones por WhatsApp</li>
            <li>Sin anuncios, sin comisión por transacción</li>
            <li>Cancela cuando quieras</li>
          </ul>
          <a href="/login" className="btn-primary" style={{ width: '100%', textAlign: 'center' }}>Empezar ahora</a>
        </div>
      </section>

      <footer className="footer">
        <span>Nuvi · Hecho en Tijuana</span>
      </footer>

      <style jsx>{`
        main { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
        .nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 28px 0;
        }
        .wordmark { font-family: var(--display); font-size: 22px; font-weight: 600; letter-spacing: -0.01em; }
        .nav-cta {
          text-decoration: none; font-size: 14px; color: var(--text-dim);
          border: 1px solid var(--border); border-radius: 8px; padding: 8px 16px;
          transition: color .15s, border-color .15s;
        }
        .nav-cta:hover { color: var(--text); border-color: var(--accent-dim); }

        .hero {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 56px;
          align-items: center; padding: 48px 0 88px;
        }
        @media (max-width: 860px) { .hero { grid-template-columns: 1fr; padding: 24px 0 56px; } }

        .eyebrow {
          display: inline-block; font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 18px;
        }
        h1 {
          font-family: var(--display); font-weight: 600; font-size: clamp(32px, 4.6vw, 52px);
          line-height: 1.08; margin: 0 0 22px; letter-spacing: -0.01em;
        }
        h1 em { font-style: italic; color: var(--accent); }
        .lede { font-size: 17px; line-height: 1.6; color: var(--text-dim); max-width: 46ch; margin: 0 0 32px; }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }

        .btn-primary {
          text-decoration: none; background: var(--accent); color: #1A1509; font-weight: 600;
          padding: 13px 26px; border-radius: 10px; font-size: 15px; display: inline-block;
          transition: opacity .15s;
        }
        .btn-primary:hover { opacity: .88; }
        .btn-ghost {
          text-decoration: none; color: var(--text); padding: 13px 22px; border-radius: 10px;
          font-size: 15px; border: 1px solid var(--border); display: inline-block;
          transition: border-color .15s;
        }
        .btn-ghost:hover { border-color: var(--accent-dim); }

        .receipt {
          background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
          padding: 26px 24px; font-family: var(--mono); font-size: 13px;
          box-shadow: 0 30px 60px -30px rgba(0,0,0,0.6);
        }
        .receipt-head {
          display: flex; justify-content: space-between; color: var(--text-faint);
          font-size: 11px; letter-spacing: .05em; padding-bottom: 14px; border-bottom: 1px dashed var(--border);
          margin-bottom: 14px;
        }
        .receipt-row { display: flex; justify-content: space-between; padding: 6px 0; color: var(--text-dim); }
        .receipt-row.accent { color: var(--success); }
        .receipt-divider { border-top: 1px dashed var(--border); margin: 10px 0; }
        .receipt-row.total { color: var(--text); font-size: 16px; font-weight: 600; }
        .receipt-foot { text-align: center; color: var(--success); font-size: 11px; margin-top: 16px; }

        .how { padding: 40px 0 72px; border-top: 1px solid var(--border); }
        .how h2, .pricing h2 {
          font-family: var(--display); font-size: clamp(24px, 3vw, 32px); font-weight: 600;
          margin: 0 0 36px; letter-spacing: -0.01em;
        }
        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 760px) { .how-grid { grid-template-columns: 1fr; } }
        .how-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px; }
        .how-num {
          font-family: var(--mono); font-size: 12px; color: var(--accent); letter-spacing: .05em;
          text-transform: uppercase; display: block; margin-bottom: 12px;
        }
        .how-card p { color: var(--text-dim); font-size: 14.5px; line-height: 1.6; margin: 0; }

        .features {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; padding: 8px 0 72px;
        }
        @media (max-width: 760px) { .features { grid-template-columns: 1fr; } }
        .feature h3 { font-size: 17px; margin: 0 0 10px; }
        .feature p { color: var(--text-dim); font-size: 14.5px; line-height: 1.6; margin: 0; }

        .pricing { padding: 8px 0 88px; border-top: 1px solid var(--border); text-align: center; }
        .price-card {
          max-width: 380px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border);
          border-radius: 18px; padding: 32px; text-align: left;
        }
        .price-top { display: flex; flex-direction: column; gap: 6px; margin-bottom: 22px; }
        .price-name { color: var(--text-dim); font-size: 13px; }
        .price-amount { font-family: var(--display); font-size: 40px; font-weight: 600; }
        .price-period { font-family: var(--sans); font-size: 14px; color: var(--text-dim); font-weight: 400; }
        .price-list { list-style: none; padding: 0; margin: 0 0 26px; display: flex; flex-direction: column; gap: 10px; }
        .price-list li { color: var(--text-dim); font-size: 14px; padding-left: 20px; position: relative; }
        .price-list li::before { content: '✓'; position: absolute; left: 0; color: var(--success); }

        .footer { padding: 32px 0 48px; color: var(--text-faint); font-size: 13px; border-top: 1px solid var(--border); text-align: center; }
      `}</style>
    </main>
  );
}
