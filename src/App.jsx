import React, { useEffect, useState, useMemo, useRef } from "react";

const SAMPLE_PRODUCTS = [
  { id: "P001", title: "Miel de Montaña 500g",            price: 8.5,   category: "Alimentos",         image: "/imagenes/miel-montana.jpg" },
  { id: "P002", title: "Café Santo Domingo 1lb",          price: 6.75,  category: "Alimentos",         image: "/imagenes/cafe.jpg" },
  { id: "P003", title: "Cacao Orgánico en Polvo 250g",    price: 5.25,  category: "Alimentos",         image: "/imagenes/cacao.jpg" },
  { id: "P004", title: "Chocolate Artesanal 70% Cacao",   price: 4.99,  category: "Alimentos",         image: "/imagenes/chocolate-artesanal.jpg" },
  { id: "P005", title: "Jabón Artesanal de Coco",         price: 3.25,  category: "Cuidado Personal",  image: "/imagenes/jabon-artesanal-coco.jpg" },
  { id: "P006", title: "Aceite de Coco Orgánico 500ml",   price: 7.5,   category: "Cuidado Personal",  image: "/imagenes/aceite-coco.jpg" },
  { id: "P007", title: "Sombrero de Palma",               price: 12.0,  category: "Artesanía",         image: "/imagenes/sombrero-palma.jpg" },
  { id: "P008", title: "Pulsera Artesanal de Ámbar",      price: 9.5,   category: "Artesanía",         image: "/imagenes/pulsera-ambar.jpg" },
  { id: "P009", title: "Collar Artesanal de Larimar",     price: 14.25, category: "Artesanía",         image: "/imagenes/collar-larimar.jpg" },
  { id: "P010", title: "Vela Aromática de Vainilla",      price: 4.5,   category: "Hogar",             image: "/imagenes/vela-vainilla.jpg" },
  { id: "P011", title: "Taza Cerámica Artesanal",         price: 6.0,   category: "Hogar",             image: "/imagenes/taza-artesanal.jpg" },
  { id: "P012", title: "Bolsa Reutilizable de Yute",      price: 3.5,   category: "Hogar",             image: "/imagenes/bolsa-yute.jpg" },
  { id: "P013", title: "Dulce de Coco 250g",              price: 2.99,  category: "Alimentos",         image: "/imagenes/dulce-coco.jpg" },
  { id: "P014", title: "Té de Jengibre Natural",          price: 3.0,   category: "Alimentos",         image: "/imagenes/te-jengibre.jpg" },
  { id: "P015", title: "Arroz Premium 5lb",               price: 4.75,  category: "Alimentos",         image: "/imagenes/arroz-premium.jpg" },
];


const USER_STORAGE_KEY = "caribesupply_user";

const PROVINCIAS = [
  "Santo Domingo",
  "Santiago de los Caballeros",
  "La Vega",
  "Puerto Plata",
  "San Cristóbal",
  "La Romana",
  "Higüey",
  "Barahona",
];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-DO", { style: "currency", currency: "USD" }).format(value);
};

function Header({ user, onLogout, cartCount, cartButtonRef, cartPulse }) {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portal de Pedidos</h1>
        <nav className="flex items-center gap-4" aria-label="Navegación principal">
          <a className="underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded" href="#catalog">Catálogo</a>
          <a className="underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded" href="#checkout">Checkout</a>
          <a className="underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded" href="#apis">APIs</a>
          <a className="underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded" href="/facturas.html">Facturas</a>
          <div className="ml-4">
            <a ref={cartButtonRef} href="/carrito.html" className={`bg-white text-cyan-700 px-3 py-1 rounded-lg font-semibold inline-flex items-center ${cartPulse ? 'cart-count-pulse' : ''}`} aria-label={`Ver carrito con ${cartCount} items`}>Carrito ({cartCount})</a>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">{user.name}</span>
                <button onClick={onLogout} className="bg-white text-emerald-600 px-2 py-1 rounded">Salir</button>
              </div>
            ) : (
              <a className="bg-white text-emerald-600 px-2 py-1 rounded" href="#auth">Ingresar</a>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const liveRef = React.useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function validateRegistration() {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) return "Correo inválido.";
    if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
    if (form.password !== form.confirm) return "Las contraseñas no coinciden.";
    return "";
  }

  function handleRegister(e) {
    e.preventDefault();
    const err = validateRegistration();
    if (err) {
      setError(err);
      liveRef.current && (liveRef.current.textContent = err);
      return;
    }
    const user = { name: form.name, email: form.email };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    onLogin(user);
  }

  function handleLogin(e) {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null");
    if (!stored || stored.email !== form.email) {
      setError("Usuario no encontrado. Regístrese antes.");
      liveRef.current && (liveRef.current.textContent = "Usuario no encontrado. Regístrese antes.");
      return;
    }
    onLogin(stored);
  }

  return (
    <section id="auth" className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded shadow" aria-labelledby="auth-title">
      <h2 id="auth-title" className="text-xl font-semibold">{mode === "login" ? "Iniciar sesión" : "Registro"}</h2>
      <p ref={liveRef} className="sr-only" aria-live="polite"></p>
      {error && <div className="text-red-700" role="alert">{error}</div>}
      <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {mode === "register" && (
          <label className="block">
            <span className="text-sm">Nombre</span>
            <input name="name" value={form.name} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 p-2" required />
          </label>
        )}
        <label className="block">
          <span className="text-sm">Correo</span>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 p-2" required />
        </label>
        <label className="block">
          <span className="text-sm">Contraseña</span>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 p-2" required />
        </label>
        {mode === "register" && (
          <label className="block">
            <span className="text-sm">Confirmar contraseña</span>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 p-2" required />
          </label>
        )}
        <div className="md:col-span-2 flex gap-2 items-center">
          <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">{mode === "login" ? "Entrar" : "Registrarme"}</button>
          <button type="button" className="underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
            {mode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Iniciar"}
          </button>
        </div>
      </form>
    </section>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <article className="bg-white rounded shadow p-3" aria-labelledby={`p-${product.id}`}>
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded" />
      <h3 id={`p-${product.id}`} className="mt-2 font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">Categoría: {product.category}</p>
      <div className="mt-2 flex items-center justify-between">
        <strong>{formatCurrency(product.price)}</strong>
        <button onClick={(e) => onAdd(product, e.currentTarget.closest('article'))} className="bg-cyan-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400" aria-label={`Agregar ${product.title} al carrito`}>Agregar</button>
      </div>
    </article>
  );
}

function Catalog({ products, onAdd }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const categories = useMemo(() => ["Todas", ...Array.from(new Set(products.map(p => p.category)))], [products]);
  const filtered = products.filter(p => (category === "Todas" || p.category === category) && p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="catalog" className="max-w-6xl mx-auto p-6 mt-6" aria-labelledby="catalog-title">
      <h2 id="catalog-title" className="text-xl font-semibold">Catálogo</h2>
      <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
        <input aria-label="Buscar productos" placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} className="p-2 rounded border-gray-300 w-full md:w-1/3" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 rounded border-gray-300">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={onAdd} />)}
      </div>
    </section>
  );
}

function Basket({ cart, onRemove, onUpdateQty, onClear }) {
  const subtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const TAX_RATE = 0.18;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  return (
    <aside className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold">Carrito</h3>
      {cart.length === 0 ? <p className="mt-2">Carrito vacío.</p> : (
        <ul className="mt-2 space-y-2">
          {cart.map(i => (
            <li key={i.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{i.title}</div>
                <div className="text-sm text-gray-600">{formatCurrency(i.price)} x {i.qty}</div>
              </div>
              <div className="flex items-center gap-2">
                <label className="sr-only">Cantidad {i.title}</label>
                <input type="number" min="1" value={i.qty} onChange={(e) => onUpdateQty(i.id, Number(e.target.value))} className="w-16 p-1 border rounded" />
                <button onClick={() => onRemove(i.id)} className="text-red-600">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 border-t pt-3">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="flex justify-between"><span>Impuestos (18%)</span><span>{formatCurrency(taxes)}</span></div>
        <div className="flex justify-between font-bold mt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
        <div className="mt-3 flex gap-2">
          <button className="bg-emerald-600 text-white px-3 py-1 rounded" disabled={cart.length === 0} onClick={() => alert('Simulación: proceso de pago OK')}>Proceder a pagar</button>
          <button className="underline" onClick={onClear}>Vaciar</button>
        </div>
      </div>
    </aside>
  );
}

function CheckoutForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", province: "" });
  const [errors, setErrors] = useState({});
  const liveRef = React.useRef(null);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre requerido.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = "Correo inválido.";
    if (!/^\+?[0-9\s-]{7,15}$/.test(form.phone)) e.phone = "Teléfono inválido.";
    if (!form.address.trim()) e.address = "Dirección requerida.";
    if (!form.province) e.province = "Seleccione provincia.";
    return e;
  }

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      onSubmit(form);
    } else {
      liveRef.current && (liveRef.current.textContent = 'Hay errores en el formulario.');
    }
  }

  return (
    <form id="checkout" className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6" onSubmit={handleSubmit} aria-labelledby="checkout-title">
      <h2 id="checkout-title" className="text-xl font-semibold">Checkout</h2>
      <p ref={liveRef} className="sr-only" aria-live="polite"></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <label className="block">
          <span className="text-sm">Nombre</span>
          <input name="name" value={form.name} onChange={handleChange} className={`mt-1 block w-full p-2 rounded border ${errors.name ? 'border-red-600' : 'border-gray-300'}`} aria-invalid={!!errors.name} />
          {errors.name && <div role="alert" className="text-red-700 text-sm">{errors.name}</div>}
        </label>
        <label className="block">
          <span className="text-sm">Correo</span>
          <input name="email" value={form.email} onChange={handleChange} className={`mt-1 block w-full p-2 rounded border ${errors.email ? 'border-red-600' : 'border-gray-300'}`} aria-invalid={!!errors.email} />
          {errors.email && <div role="alert" className="text-red-700 text-sm">{errors.email}</div>}
        </label>
        <label className="block">
          <span className="text-sm">Teléfono</span>
          <input name="phone" value={form.phone} onChange={handleChange} className={`mt-1 block w-full p-2 rounded border ${errors.phone ? 'border-red-600' : 'border-gray-300'}`} aria-invalid={!!errors.phone} />
          {errors.phone && <div role="alert" className="text-red-700 text-sm">{errors.phone}</div>}
        </label>
        <label className="block">
          <span className="text-sm">Provincia</span>
          <select name="province" value={form.province} onChange={handleChange} className={`mt-1 block w-full p-2 rounded border ${errors.province ? 'border-red-600' : 'border-gray-300'}`} aria-invalid={!!errors.province}>
            <option value="">-- Seleccione --</option>
            {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.province && <div role="alert" className="text-red-700 text-sm">{errors.province}</div>}
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm">Dirección</span>
          <input name="address" value={form.address} onChange={handleChange} className={`mt-1 block w-full p-2 rounded border ${errors.address ? 'border-red-600' : 'border-gray-300'}`} aria-invalid={!!errors.address} />
          {errors.address && <div role="alert" className="text-red-700 text-sm">{errors.address}</div>}
        </label>
      </div>
      <div className="mt-4">
        <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded">Enviar pedido (simulado)</button>
      </div>
    </form>
  );
}

function APIsPanel({ province }) {
  const [weather, setWeather] = useState(null);
  const [rates, setRates] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    async function fetchWeather() {
      try {
        if (!province) return;
        const key = import.meta.env.VITE_OPENWEATHER_KEY || "";
        if (!key) return setWeather({ error: "Falta clave OpenWeather" });

        let city = province;
        if (province === "Santiago") city = "Santiago de los Caballeros";
        if (province === "Higüey") city = "Salvaleón de Higüey";

        const q = encodeURIComponent(`${city},DO`);
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=metric&lang=es&appid=${key}`
        );
        const data = await res.json();
        if (data.cod === 200) {
          setWeather(data);
        } else {
          setWeather({ error: "Ciudad no encontrada", simulated: true });
        }
      } catch {
        setWeather({ error: "Error de conexión", simulated: true });
      }
    }

    async function fetchRates() {
      try {
        const key = import.meta.env.VITE_EXCHANGE_API_KEY || "";
        if (!key) return setRates({ error: "Falta clave Exchange" });

        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/USD?access_key=${key}`);
        const data = await res.json();
        if (!data.error) setRates(data);
        else setRates({ error: "Error en tasas", simulated: true });
      } catch {
        setRates({ error: "Sin conexión", simulated: true });
      }
    }

    function fetchTracking() {
      const estados = [
        { status: "En preparación", location: "Almacén central, Santo Domingo", color: "#f59e0b" },
        { status: "En tránsito", location: "Ruta hacia " + province, color: "#10b981" },
        { status: "En distribución local", location: "Centro de reparto " + province, color: "#3b82f6" },
        { status: "Entregado", location: "Entregado exitosamente", color: "#22c55e" }
      ];

      let index = 0;
      const orderId = "CS" + new Date().getFullYear().toString().slice(-2) + Math.floor(Math.random() * 9999).toString().padStart(4, "0");

      const updateTracking = () => {
        const estado = estados[index];
        setTracking({
          orderId,
          status: estado.status,
          location: estado.location,
          color: estado.color,
          lastUpdate: new Date().toLocaleString("es-DO")
        });
        index = (index + 1) % estados.length;
      };

      updateTracking();
      const interval = setInterval(updateTracking, 8000);
      return () => clearInterval(interval);
    }

    function fetchFaqs() {
      setFaqs([
        { id: 1, title: "¿Cómo realizo un pedido?", body: "Por el sitio web, WhatsApp o visitando nuestra oficina." },
        { id: 2, title: "¿Cuánto tardan las entregas?", body: "Santo Domingo: 1-2 días. Interior: 3-5 días hábiles." },
        { id: 3, title: "¿Qué pagos aceptan?", body: "Tarjetas, transferencias, efectivo contra entrega y pagos móviles." },
        { id: 4, title: "¿Tienen garantía?", body: "Sí, 30 días de devolución y garantía total en todos los productos." },
      ]);
    }

    fetchWeather();
    fetchRates();
    const cleanup = fetchTracking();
    fetchFaqs();

    return cleanup;
  }, [province]);

  return (
    <section id="apis" className="max-w-6xl mx-auto p-6 mt-12" aria-labelledby="apis-title">
      <h2 id="apis-title" className="text-2xl font-bold text-emerald-700 mb-8">APIs en tiempo real</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-cyan-700">Clima actual en {province}</h3>
          {weather ? (
            weather.error ? <p className="text-red-600 mt-4">{weather.error}</p> :
            <div className="mt-6">
              <p className="text-5xl font-bold text-gray-800">{weather.main.temp.toFixed(1)}°C</p>
              <p className="text-xl mt-2 capitalize text-gray-700">{weather.weather[0].description}</p>
              <p className="text-sm text-gray-500 mt-3">Actualizado ahora mismo</p>
            </div>
          ) : <p className="text-gray-500 mt-6">Cargando clima real...</p>}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-cyan-700">Tasas de cambio (USD)</h3>
          {rates ? (
            rates.error ? <p className="text-red-600 mt-4">{rates.error}</p> :
            <div className="mt-6 space-y-4 text-lg">
              <div className="flex justify-between"><span>Peso Dominicano:</span> <strong className="font-mono">{rates.rates.DOP?.toFixed(2)}</strong></div>
              <div className="flex justify-between"><span>Euro:</span> <strong className="font-mono">{rates.rates.EUR?.toFixed(3)}</strong></div>
            </div>
          ) : <p className="text-gray-500 mt-6">Cargando tasas reales...</p>}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-emerald-700">Seguimiento en vivo</h3>
          {tracking ? (
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold" style={{ color: tracking.color }}>
                  {tracking.status}
                </p>
                <p className="text-lg font-mono text-gray-700 mt-2">#{tracking.orderId}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-sm">
                <p className="font-medium">Ubicación actual:</p>
                <p className="text-gray-700">{tracking.location}</p>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Última actualización: {tracking.lastUpdate}
              </p>
              <p className="text-xs text-center text-amber-600 animate-pulse">
                Se actualiza automáticamente cada 8 segundos
              </p>
            </div>
          ) : <p className="text-gray-500 mt-6">Iniciando seguimiento...</p>}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-emerald-700">Preguntas frecuentes</h3>
          <ul className="mt-6 space-y-4 text-sm">
            {faqs.map(f => (
              <li key={f.id}>
                <strong className="text-cyan-700">{f.title}</strong>
                <p className="text-gray-600 mt-1">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || "null"));
  const [route, setRoute] = useState(() => window.location.hash || "#home");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("caribesupply_cart") || "[]"));
  const [products] = useState(SAMPLE_PRODUCTS);
  const [selectedProvince, setSelectedProvince] = useState(PROVINCIAS[0]);
  const [cartPulse, setCartPulse] = useState(false);
  const cartButtonRef = useRef(null);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (route === "#auth" && user) {
      window.location.hash = "#home";
    }
  }, [route, user]);

  useEffect(() => { localStorage.setItem("caribesupply_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); }, [user]);

  function animateAddToCart(sourceElement) {
    if (!sourceElement || !cartButtonRef.current) return;
    const image = sourceElement.querySelector("img");
    if (!image) return;

    const clone = image.cloneNode(true);
    const imageRect = image.getBoundingClientRect();
    const targetRect = cartButtonRef.current.getBoundingClientRect();

    Object.assign(clone.style, {
      position: "fixed",
      top: `${imageRect.top}px`,
      left: `${imageRect.left}px`,
      width: `${imageRect.width}px`,
      height: `${imageRect.height}px`,
      borderRadius: "14px",
      boxShadow: "0 20px 40px rgba(15,23,42,0.15)",
      transition: "transform 0.8s ease, opacity 0.8s ease",
      zIndex: 9999,
      pointerEvents: "none",
    });

    document.body.appendChild(clone);

    requestAnimationFrame(() => {
      const deltaX = targetRect.left + targetRect.width / 2 - (imageRect.left + imageRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (imageRect.top + imageRect.height / 2);
      clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.18)`;
      clone.style.opacity = "0.4";
    });

    clone.addEventListener("transitionend", () => clone.remove(), { once: true });
  }

  function handleAdd(product, cardElement) {
    animateAddToCart(cardElement);
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartPulse(true);
    window.setTimeout(() => setCartPulse(false), 420);
  }

  function handleRemove(id) { setCart(prev => prev.filter(p => p.id !== id)); }
  function handleUpdateQty(id, qty) { if (qty < 1) return; setCart(prev => prev.map(p => p.id === id ? { ...p, qty } : p)); }
  function handleClear() { setCart([]); }
  function handleLogout() { setUser(null); localStorage.removeItem(USER_STORAGE_KEY); }

  function handleCheckoutSubmit(data) {
    alert(`Pedido simulado creado para ${data.name}. Se enviará a ${data.address}, ${data.province}.`);
    setCart([]);
  }

  return (
    <div className="app-shell min-h-screen text-slate-800">
      <Header user={user} onLogout={handleLogout} cartCount={cart.reduce((s, i) => s + i.qty, 0)} cartButtonRef={cartButtonRef} cartPulse={cartPulse} />
      <main className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          {route === "#auth" && !user ? (
            <section className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded shadow">
              <h2 className="text-2xl font-semibold mb-4">Ingresar a tu cuenta</h2>
              <Auth onLogin={(userData) => {
                setUser(userData);
                window.location.hash = "#home";
              }} />
            </section>
          ) : (
            <>
              <section className="rounded-[2rem] bg-white/75 backdrop-blur-md border border-white/80 shadow-2xl p-8 mb-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-cyan-700">Tienda artesanal y natural</p>
                    <h2 className="mt-3 text-3xl font-bold text-slate-900">Añade productos, completa tu compra y revisa tu carrito</h2>
                    <p className="mt-3 max-w-2xl text-slate-700">Un fondo suave y un flujo de compra sencillo para tus productos locales.</p>
                  </div>
                  <div className="rounded-3xl bg-cyan-600 px-6 py-5 text-white shadow-lg">
                    <p className="text-sm font-medium">Productos en carrito</p>
                    <p className="mt-2 text-4xl font-bold">{cart.reduce((s, i) => s + i.qty, 0)}</p>
                    <p className="text-sm opacity-90">items añadidos</p>
                    <a href="/carrito.html" className="mt-4 inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-2 text-cyan-700 font-semibold shadow-sm hover:bg-white">Abrir carrito</a>
                  </div>
                </div>
              </section>
              <Catalog products={products} onAdd={handleAdd} />
              <section className="max-w-6xl mx-auto p-6 mt-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-semibold">El carrito ahora está en otra página</h3>
                  <p className="mt-2 text-slate-600">Haz clic en el botón de carrito del menú para ver y editar tus productos.</p>
                  <a href="/carrito.html" className="mt-4 inline-flex rounded-full bg-cyan-600 px-5 py-3 text-white font-semibold shadow hover:bg-cyan-700">Ver carrito completo</a>
                </div>
              </section>
              <section className="max-w-6xl mx-auto p-6 mt-6 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <CheckoutForm onSubmit={handleCheckoutSubmit} />
                </div>
                <div>
                  <div className="mt-4 bg-white rounded shadow p-4">
                    <h4 className="font-semibold">Preferencias</h4>
                    <label className="block mt-2">
                      <span className="text-sm">Provincia para APIs</span>
                      <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="mt-1 block w-full p-2 rounded border-gray-300">
                        {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              </section>
              <APIsPanel province={selectedProvince} />
            </>
          )}
        </div>
      </main>
      <footer className="bg-slate-800 text-white p-4 mt-8">
        <div className="max-w-6xl mx-auto text-sm space-y-1">
          <p>© {new Date().getFullYear()} Portal de Pedidos Online.</p>
          <p>Autores: Rody Mathis (100581144) y Breilin de la Cruz (100616363).</p>
        </div>
      </footer>
    </div>
  );
}