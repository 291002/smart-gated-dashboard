/* Simulated data model for the Smart Gated Industrial Community demo.
   Everything here is generated sample data; nothing is read from a live system. */
const D = (() => {
const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = seed => { let a = typeof seed === 'number' ? seed : hash(seed); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const pick = (r, a) => a[Math.floor(r() * a.length)];
const pad = n => String(n).padStart(2, '0');
const sum = a => a.reduce((x, y) => x + (y || 0), 0);

/* ---------- Cairo clock ---------- */
const cairo = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second };
};
const today = () => { const c = cairo(); return new Date(Date.UTC(c.y, c.mo - 1, c.d)); };
const addDays = (dt, n) => new Date(dt.getTime() + n * 864e5);
const dmy = dt => `${pad(dt.getUTCDate())}/${pad(dt.getUTCMonth() + 1)}/${dt.getUTCFullYear()}`;
const dShort = dt => dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', timeZone: 'UTC' });
const hourNow = () => { const c = cairo(); return c.h + c.mi / 60 + c.s / 3600; };
const hm = (h, m) => `${pad(h)}:${pad(m)}`;
const clockAgo = sec => { const c = cairo(); let t = c.h * 3600 + c.mi * 60 + c.s - sec; t = (t + 86400) % 86400; return hm(Math.floor(t / 3600), Math.floor(t / 60) % 60); };
const isWeekend = dt => { const w = dt.getUTCDay(); return w === 5 || w === 6; };   // Egypt: Friday & Saturday

/* ---------- factories / tenants ---------- */
const FACTORIES = [
  { id: 'A', name: 'Factory A', tenant: 'Nile Textiles', sector: 'Textiles & garments', auth: 250, inside: 87, emp: 420, con: 55, vis: 18, mw: 0.92, product: 'Fabric', unit: 'k m', plan: 46, oee: 83.1, water: 576, wbase: 570, mwBase: 0.91, gas: 0 },
  { id: 'B', name: 'Factory B', tenant: 'Delta Food Industries', sector: 'Food processing', auth: 180, inside: 142, emp: 380, con: 48, vis: 22, mw: 1.05, product: 'Packaged food', unit: 't', plan: 118, oee: 79.6, water: 920, wbase: 905, mwBase: 0.89, gas: 260 },
  { id: 'C', name: 'Factory C', tenant: 'Sinai Steel Works', sector: 'Steel fabrication', auth: 320, inside: 210, emp: 610, con: 120, vis: 25, mw: 2.31, product: 'Steel sections', unit: 't', plan: 264, oee: 76.2, water: 384, wbase: 380, mwBase: 2.3, gas: 420 },
  { id: 'D', name: 'Factory D', tenant: 'Pharaoh Pharma', sector: 'Pharmaceuticals', auth: 150, inside: 64, emp: 300, con: 40, vis: 20, mw: 0.74, product: 'Tablets', unit: 'M units', plan: 3.8, oee: 86.4, water: 744, wbase: 641, mwBase: 0.73, gas: 0 },
  { id: 'E', name: 'Factory E', tenant: 'Red Sea Plastics', sector: 'Plastics & packaging', auth: 140, inside: 51, emp: 260, con: 52, vis: 12, mw: 0.83, product: 'PET preforms', unit: 'M pcs', plan: 2.6, oee: 80.9, water: 488, wbase: 480, mwBase: 0.82, gas: 180 },
  { id: 'F', name: 'Factory F', tenant: 'Cairo Auto Components', sector: 'Automotive parts', auth: 130, inside: 47, emp: 250, con: 45, vis: 11, mw: 0.62, product: 'Components', unit: 'k pcs', plan: 18.5, oee: 82.7, water: 312, wbase: 308, mwBase: 0.62, gas: 60 },
  { id: 'S', name: 'Community Services', tenant: 'Utilities, admin & security', sector: 'Services', auth: 80, inside: 22, emp: 98, con: 52, vis: 8, mw: 0.40, product: null, water: 480, wbase: 478, mwBase: 0.4, gas: 0 },
];
const fac = id => FACTORIES.find(f => f.id === id);
const CARRIERS = ['Nile Freight Logistics', 'Pyramids Express Transport', 'Delta Haulage', 'Al-Amal Contracting', 'Horus Facility Services'];
const FIRST = ['Ahmed', 'Mohamed', 'Mahmoud', 'Omar', 'Youssef', 'Karim', 'Mostafa', 'Tarek', 'Hany', 'Sherif', 'Amr', 'Walid', 'Hossam', 'Islam', 'Ayman', 'Sayed', 'Ehab', 'Nader', 'Khaled', 'Ibrahim', 'Hassan', 'Ali', 'Samir', 'Adel', 'Ramy', 'Bassem', 'Wael', 'Hesham', 'Sameh', 'Fady'];
const LAST = ['Hassan', 'Ali', 'Saleh', 'Farouk', 'Adel', 'Nabil', 'Ibrahim', 'Samir', 'Fathy', 'Mansour', 'Khaled', 'Zaki', 'Gamal', 'Reda', 'Fouad', 'Ramadan', 'Lotfy', 'Wahba', 'Abdelaziz', 'Shaker', 'Soliman', 'Emam', 'Hegazy', 'Morsy', 'Naguib'];

/* ---------- gates ---------- */
const GATES = [
  { id: 'G01', name: 'Gate 01 · Main North', use: 'Cars & vans', status: 'OPEN', inShare: .333, outShare: .344, waiting: 2, wait: 1.8, anpr: 'Online', barrier: 'OK', cams: [4, 4], lanes: 4, x: 302, y: 497 },
  { id: 'G02', name: 'Gate 02 · Truck & Weighbridge', use: 'Trucks', status: 'OPEN', inShare: .262, outShare: .256, waiting: 5, wait: 6.4, anpr: 'Online', barrier: 'OK', cams: [4, 4], lanes: 2 },
  { id: 'G03', name: 'Gate 03 · Logistics West', use: 'Trucks & vans', status: 'BUSY', inShare: .188, outShare: .192, waiting: 9, wait: 9.2, anpr: 'Online', barrier: 'OK', cams: [3, 3], lanes: 2 },
  { id: 'G04', name: 'Gate 04 · East', use: 'Mixed', status: 'OFFLINE', inShare: 0, outShare: 0, waiting: 0, wait: 0, anpr: 'Offline', barrier: 'Fault', cams: [2, 3], lanes: 2, note: 'Controller GC-04 lost communication at 09:12. Manual guard post active.' },
  { id: 'G05', name: 'Gate 05 · Staff South', use: 'Staff cars', status: 'OPEN', inShare: .150, outShare: .139, waiting: 1, wait: 1.2, anpr: 'Online', barrier: 'OK', cams: [3, 3], lanes: 2 },
  { id: 'G06', name: 'Gate 06 · Visitors', use: 'Visitors', status: 'OPEN', inShare: .047, outShare: .051, waiting: 1, wait: 3.5, anpr: 'Online', barrier: 'OK', cams: [2, 2], lanes: 1 },
  { id: 'G07', name: 'Gate 07 · Service', use: 'Service & utilities', status: 'OPEN', inShare: .020, outShare: .018, waiting: 0, wait: 0.9, anpr: 'Online', barrier: 'OK', cams: [2, 2], lanes: 1 },
  { id: 'G08', name: 'Gate 08 · Emergency', use: 'Emergency only', status: 'STANDBY', inShare: 0, outShare: 0, waiting: 0, wait: 0, anpr: 'Online', barrier: 'Closed', cams: [2, 2], lanes: 1 },
];

/* ---------- traffic profiles (vehicles per hour weights) ---------- */
const PROF_IN = [2, 1, 1, 1, 2, 6, 18, 26, 16, 10, 8, 8, 9, 10, 14, 12, 9, 7, 5, 4, 3, 3, 2, 2];
const PROF_OUT = [3, 2, 1, 1, 2, 8, 16, 14, 10, 9, 9, 9, 10, 11, 16, 18, 20, 12, 8, 5, 4, 3, 3, 2];
const DAY_TOTAL = 1160;
const cum = (prof, hf) => { const tot = sum(prof); let s = 0; for (let h = 0; h < 24; h++) { if (hf >= h + 1) s += prof[h]; else if (hf > h) s += prof[h] * (hf - h); } return s / tot; };
const traffic = () => { const hf = hourNow(); return { entries: Math.round(DAY_TOTAL * cum(PROF_IN, hf)), exits: Math.round(DAY_TOTAL * cum(PROF_OUT, hf)) }; };

/* ---------- vehicle register ---------- */
const VEH = [];
(() => {
  const r = rng('vehicles-v1');
  const nums = []; for (let n = 1000; n < 10000; n++) nums.push(n);
  for (let i = nums.length - 1; i > 0; i--) { const k = Math.floor(r() * (i + 1)); [nums[i], nums[k]] = [nums[k], nums[i]]; }
  const reserved = new Set([4827, 9134, 7721]); let ni = 0;
  const plate = () => { let n; do { n = nums[ni++]; } while (reserved.has(n)); return 'EG-' + n; };
  const t0 = today();
  const typeFor = f => { const x = r(); const truck = f.id === 'C' ? .38 : f.id === 'B' ? .3 : f.id === 'S' ? .1 : .2; return x < truck ? 'Truck' : x < truck + .15 ? 'Van' : x < truck + .19 ? 'Bus' : 'Car'; };
  const driver = () => `${pick(r, FIRST)} ${pick(r, LAST)}`;
  const authFor = () => { const x = r(); return x < .45 ? 'Permanent' : x < .7 ? 'Annual' : x < .85 ? 'Contractor' : 'Temporary'; };
  const expiryFor = a => a === 'Permanent' ? new Date(Date.UTC(2026, 11, 31)) : a === 'Annual' ? addDays(t0, 30 + Math.floor(r() * 330)) : a === 'Contractor' ? addDays(t0, 5 + Math.floor(r() * 115)) : addDays(t0, 1 + Math.floor(r() * 44));
  const insideLoc = (v, f) => v.type === 'Truck' ? pick(r, [`${f.name} loading dock`, 'Truck yard T1', 'Container yard A', 'Weighbridge WB-1']) : v.type === 'Bus' ? 'Bus bay B1' : pick(r, [`${f.name} parking`, 'Staff parking P2', 'Staff parking P3', 'Visitor parking P1']);
  const gateFor = v => v.type === 'Truck' ? pick(r, ['G02', 'G02', 'G03']) : v.type === 'Van' ? pick(r, ['G01', 'G03']) : pick(r, ['G01', 'G01', 'G05', 'G06']);
  const company = (v, f) => (v.type === 'Truck' && r() < .55) || (v.type !== 'Truck' && r() < .12) ? pick(r, CARRIERS) : f.tenant;
  const make = (f, status, inside) => {
    const v = { plate: plate(), type: typeFor(f), factory: f.id, driver: driver(), status, inside };
    v.company = company(v, f);
    v.auth = status === 'Pending' ? pick(r, ['Annual', 'Contractor', 'Temporary']) : authFor();
    if (status === 'Active') v.expiry = expiryFor(v.auth);
    else if (status === 'Expired') v.expiry = addDays(t0, -1 - Math.floor(r() * 120));
    else if (status === 'Blocked') { v.expiry = expiryFor(v.auth); v.reason = pick(r, ['Safety violation on site', 'Forged permit detected', 'Repeated speeding (> 30 km/h)', 'Unpaid site fines']); }
    else { v.expiry = null; v.requested = addDays(t0, -Math.floor(r() * 6)); }
    v.gate = gateFor(v);
    if (inside) { v.location = insideLoc(v, f); v.lastSeen = `In ${hm(6 + Math.floor(r() * 5), Math.floor(r() * 60))}`; }
    else { v.location = 'Outside'; v.lastSeen = r() < .5 ? `Out ${hm(7 + Math.floor(r() * 4), Math.floor(r() * 60))}` : `Out ${dShort(addDays(t0, -1 - Math.floor(r() * 9)))}`; }
    return v;
  };
  FACTORIES.forEach(f => { for (let i = 0; i < f.auth; i++) VEH.push(make(f, 'Active', i < f.inside)); });
  const extra = [['Pending', 34], ['Expired', 57], ['Blocked', 12]];
  extra.forEach(([st, n]) => { for (let i = 0; i < n; i++) VEH.push(make(FACTORIES[Math.floor(r() * 6)], st, false)); });
  // reference records used in the brief
  const a = VEH.find(v => v.factory === 'A' && v.inside);
  Object.assign(a, { plate: 'EG-4827', type: 'Truck', company: 'Nile Textiles', driver: 'Ahmed Hassan', auth: 'Permanent', expiry: new Date(Date.UTC(2026, 11, 31)), location: 'Factory A loading dock', gate: 'G03', lastSeen: 'In 10:42' });
  const b = VEH.find(v => v.factory === 'B' && v.inside && v.plate !== 'EG-4827');
  Object.assign(b, { plate: 'EG-9134', type: 'Car', driver: 'Omar Farouk', company: 'Delta Food Industries', location: 'Staff parking P2', gate: 'G01', lastSeen: 'In 10:40' });
  const c = VEH.find(v => v.status === 'Expired');
  Object.assign(c, { plate: 'EG-7721', type: 'Van', driver: 'Sayed Ramadan', company: 'Al-Amal Contracting', gate: 'G02', lastSeen: 'Denied 10:37' });
})();
const vehStats = () => {
  const act = VEH.filter(v => v.status === 'Active');
  return { authorized: act.length, inside: act.filter(v => v.inside).length, pending: VEH.filter(v => v.status === 'Pending').length,
    expired: VEH.filter(v => v.status === 'Expired').length, blocked: VEH.filter(v => v.status === 'Blocked').length,
    trucksInside: act.filter(v => v.inside && v.type === 'Truck').length };
};
const facStats = f => { const act = VEH.filter(v => v.factory === f.id && v.status === 'Active'); const ins = act.filter(v => v.inside).length; return { authorized: act.length, inside: ins, slots: act.length - ins }; };

/* ---------- ANPR live stream ---------- */
const ANPR = [];
const er = rng('anpr-stream');
const makeEvent = (secAgo) => {
  const x = er(); let v, status;
  if (x < .88) { v = pick(er, VEH.filter(q => q.status === 'Active')); status = 'Authorized'; }
  else if (x < .95) { v = { plate: 'EG-' + (1000 + Math.floor(er() * 9000)), type: pick(er, ['Car', 'Car', 'Van', 'Truck']), company: '—' }; status = 'Unknown'; }
  else if (x < .99) { v = pick(er, VEH.filter(q => q.status === 'Expired' || q.status === 'Pending')); status = 'Unauthorized'; }
  else { v = pick(er, VEH.filter(q => q.status === 'Blocked')); status = 'Blacklisted'; }
  const gate = v.type === 'Truck' ? pick(er, ['G02', 'G03']) : pick(er, ['G01', 'G01', 'G05', 'G06', 'G03']);
  return { time: clockAgo(secAgo), plate: v.plate, type: v.type, gate, dir: er() < .55 ? 'In' : 'Out', status, conf: status === 'Unknown' ? 82 + Math.floor(er() * 12) : 95 + Math.floor(er() * 5) };
};
for (let i = 40; i > 3; i--) ANPR.push(makeEvent(i * 70 + Math.floor(er() * 40)));
ANPR.push({ time: clockAgo(300), plate: 'EG-7721', type: 'Van', gate: 'G02', dir: 'In', status: 'Unauthorized', conf: 98 });
ANPR.push({ time: clockAgo(120), plate: 'EG-9134', type: 'Car', gate: 'G01', dir: 'In', status: 'Authorized', conf: 99 });
ANPR.push({ time: clockAgo(20), plate: 'EG-4827', type: 'Truck', gate: 'G03', dir: 'In', status: 'Authorized', conf: 99 });
ANPR.reverse();
const pushEvent = () => { const e = makeEvent(0); ANPR.unshift(e); if (ANPR.length > 80) ANPR.pop(); return e; };

/* ---------- alarms ---------- */
const OPS = ['Eng. Karim Nabil', 'Op. Sara Mahmoud', 'Op. Youssef Adel', 'Safety Off. Mona Adel', 'Eng. Hany Fathy'];
const ALARMS = [];
(() => {
  const t0 = today();
  const A = (time, pri, system, facility, asset, alarm, value, limit, status, ackBy, extra) => ALARMS.push(Object.assign({ id: 'ALM-' + (24710 + ALARMS.length), date: t0, time, pri, system, facility, asset, alarm, value, limit, status, ackBy: ackBy || '—' }, extra || {}));
  A('11:46', 'crit', 'Production', 'Factory C', 'Compressor C-12', 'High vibration', '7.4 mm/s', '4.5 mm/s', 'Active · Unack', null, { action: 'Reduce load to 60%, dispatch vibration analyst, plan bearing replacement within 6 days.' });
  A('09:12', 'crit', 'Access Control', 'Gate 04 · East', 'Gate controller GC-04', 'Gate offline · communication lost', 'No response', 'Heartbeat 30 s', 'Active · Ack', 'Eng. Karim Nabil', { action: 'Guard post manned. Technician on site, controller replacement in progress.' });
  A('11:58', 'warn', 'Fire & Gas', 'Factory F', 'Gas detector GD-14', 'Flammable gas above warning level', '18% LEL', '10% LEL', 'Active · Ack', 'Safety Off. Mona Adel', { action: 'Paint shop ventilation boosted; area restricted. Alarm escalates at 20% LEL.' });
  A('11:21', 'warn', 'Water', 'Water plant', 'Pump P-04', 'Pump tripped · motor overload', '0 bar', '4.2 bar', 'Active · Unack', null, { action: 'Standby pump P-05 running. Inspect motor and overload relay.' });
  A('11:52', 'warn', 'Access Control', 'Gate 03 · Logistics West', 'Lane 3A queue', 'Gate queue above limit', '9 vehicles', '8 vehicles', 'Active · Unack', null, { action: 'Open lane 3B; redirect trucks to Gate 02.' });
  A('10:34', 'warn', 'Power', 'Substation SS-3', 'Transformer TX-5', 'Oil temperature high', '84 °C', '80 °C', 'Active · Ack', 'Eng. Hany Fathy', { action: 'Fans on stage 2. Shift 300 kW from feeder F-7 if above 88 °C.' });
  A('10:05', 'warn', 'Production', 'Factory E', 'Line 3 extruder', 'Vibration above warning level', '3.6 mm/s', '3.5 mm/s', 'Active · Unack', null, { action: 'Schedule inspection at next planned stop.' });
  A('09:47', 'warn', 'Water', 'Water plant', 'Storage tank T-2', 'Tank level low', '34%', '35%', 'Active · Unack', null, { action: 'Increase transfer from T-1; check P-04 status.' });
  A('08:40', 'warn', 'Environment', 'Air quality station AQ-2', 'PM10 sensor', 'PM10 near daily limit', '68 µg/m³', '70 µg/m³', 'Active · Ack', 'Op. Sara Mahmoud', { action: 'Water spraying on unpaved yard; notify Factory C.' });
  const info = [
    ['11:55', 'Security', 'Gate 01 · Main North', 'ANPR camera A-01', 'Unknown vehicle read at gate', 'EG-3318', 'Not registered'],
    ['11:40', 'Access Control', 'Gate 06 · Visitors', 'Visitor desk', 'Visitor overstayed pass', '35 min', 'Pass expiry'],
    ['11:33', 'Security', 'Factory B', 'CCTV cam 112', 'Camera restored', 'Online', '—'],
    ['11:12', 'Logistics', 'Truck yard T1', 'Parking sensors', 'Truck parking 87% full', '52/60', '90%'],
    ['10:58', 'Energy', 'Rooftop solar', 'Inverter INV-3', 'Inverter restarted after grid dip', 'OK', '—'],
    ['10:44', 'Network', 'Community Services', 'Core switch CS-2', 'Fiber ring switched to path B', 'OK', '—'],
    ['10:30', 'HVAC', 'Factory D', 'AHU-07', 'Filter differential pressure high', '240 Pa', '250 Pa'],
    ['10:12', 'Access Control', 'Gate 05 · Staff South', 'Turnstile T-5', 'Turnstile reset', 'OK', '—'],
    ['09:58', 'Fire & Gas', 'Factory A', 'Fire panel FP-A', 'Routine detector test completed', '32 tested', '—'],
    ['09:41', 'Security', 'Perimeter zone Z-07', 'Fence sensor', 'Fence vibration (wind)', '2 events', 'Verified'],
    ['09:20', 'Power', 'Substation SS-2', 'Feeder F-3', 'Load returned to normal', '71%', '85%'],
    ['09:05', 'Logistics', 'Weighbridge WB-1', 'Scale controller', 'Calibration check passed', '±0.1%', '±0.25%'],
    ['08:52', 'Lighting', 'Zone South', 'Lighting controller LC-14', 'Dimming schedule changed', '30%', '—'],
    ['08:30', 'Workforce', 'Factory C', 'Attendance', 'Shift A attendance below target', '92.8%', '95%'],
    ['08:10', 'Access Control', 'Gate 02 · Truck', 'Barrier B-02', 'Barrier cycle count service due', '48,900', '50,000'],
    ['07:45', 'HVAC', 'Admin building', 'Chiller CH-2', 'Chiller started (schedule)', 'Running', '—'],
    ['07:15', 'Network', 'LoRaWAN', 'Gateway LG-09', 'Packet loss elevated', '2.1%', '2%'],
    ['06:30', 'Security', 'Operations Center', 'VMS', 'Shift handover completed', 'OK', '—'],
  ];
  info.forEach(([t, s, f, a, al, v, l], i) => A(t, 'info', s, f, a, al, v, l, i % 3 === 0 ? 'Active · Ack' : 'Active · Unack', i % 3 === 0 ? pick(rng('i' + i), OPS) : null));
  // cleared history (30 days)
  const r = rng('alarm-history');
  const hist = [
    ['crit', 'Fire & Gas', 'Factory C', 'Smoke detector SD-C-114', 'Fire alarm · confirmed small fire', '—', '—'],
    ['crit', 'Power', 'Substation SS-1', 'Breaker Q-12', 'Feeder trip', 'Open', 'Closed'],
    ['warn', 'Water', 'Water plant', 'Pump P-07', 'High motor temperature', '96 °C', '90 °C'],
    ['warn', 'Access Control', 'Gate 02 · Truck', 'ANPR camera A-04', 'Recognition rate low', '91%', '95%'],
    ['warn', 'Production', 'Factory B', 'Cold room CR-2', 'Temperature above setpoint', '6.8 °C', '5 °C'],
    ['warn', 'HVAC', 'Factory D', 'Clean room CR-D1', 'Humidity high', '58% RH', '55% RH'],
    ['warn', 'Security', 'Perimeter zone Z-03', 'PIDS', 'Intrusion alarm (verified animal)', '1', '0'],
    ['info', 'Logistics', 'Gate 03 · Logistics West', 'Lane 3A', 'Queue cleared', '0', '—'],
    ['info', 'Energy', 'Rooftop solar', 'Array S-2', 'Panel cleaning completed', 'OK', '—'],
    ['warn', 'Power', 'Substation SS-2', 'Transformer TX-3', 'Oil temperature high', '82 °C', '80 °C'],
  ];
  for (let i = 0; i < 64; i++) {
    const [p, s, f, a, al, v, l] = hist[Math.floor(r() * hist.length)];
    const d = 1 + Math.floor(r() * 29);
    A(hm(Math.floor(r() * 24), Math.floor(r() * 60)), p, s, f, a, al, v, l, 'Cleared', pick(r, OPS), { date: addDays(t0, -d) });
  }
})();
const activeAlarms = () => ALARMS.filter(a => a.status !== 'Cleared');
const alarmCounts = () => { const a = activeAlarms(); return { crit: a.filter(x => x.pri === 'crit').length, warn: a.filter(x => x.pri === 'warn').length, info: a.filter(x => x.pri === 'info').length }; };

/* ---------- connected systems ---------- */
const SYSTEMS = [
  ['CCTV & video analytics', 'Security', 146, 4], ['Access control & turnstiles', 'Access Control', 64, 3], ['ANPR cameras', 'Access Control', 14, 2],
  ['Perimeter intrusion detection', 'Security', 38, 0], ['Power SCADA', 'Power', 96, 0], ['Water & wastewater SCADA', 'Water', 88, 1],
  ['BMS / HVAC', 'HVAC', 212, 3], ['Fire alarm panels', 'Fire & Gas', 24, 0], ['Gas detection', 'Fire & Gas', 164, 0],
  ['Street lighting controllers', 'Lighting', 186, 3], ['Fleet GPS trackers', 'Logistics', 118, 1], ['Energy meters', 'Energy', 84, 0], ['Network & comms', 'Network', 50, 0],
].map(([name, sys, total, off]) => ({ name, sys, total, off, online: total - off, avail: (total - off) / total * 100 }));

/* ---------- machines ---------- */
const MACHINES = [
  { id: 'C-12', name: 'Compressor C-12', f: 'C', type: 'Compressor', temp: 71, vib: 7.4, amp: 212, pres: 7.9, run: 18420, health: 41, rul: 6, st: 'crit' },
  { id: 'E-L3', name: 'Line 3 extruder', f: 'E', type: 'Extruder', temp: 188, vib: 3.6, amp: 340, pres: 210, run: 22650, health: 68, rul: 28, st: 'warn' },
  { id: 'M-07', name: 'Motor M-07', f: 'A', type: 'Motor', temp: 42, vib: 2.8, amp: 118, pres: null, run: 9230, health: 88, rul: 46, st: 'ok' },
  { id: 'P-11', name: 'Pump P-11', f: 'B', type: 'Pump', temp: 38, vib: 1.9, amp: 64, pres: 5.1, run: 12840, health: 93, rul: 120, st: 'ok' },
  { id: 'C-03', name: 'Rolling mill C-03', f: 'C', type: 'Rolling mill', temp: 96, vib: 3.1, amp: 820, pres: null, run: 30110, health: 74, rul: 38, st: 'ok' },
  { id: 'B-04', name: 'Retort sterilizer B-04', f: 'B', type: 'Sterilizer', temp: 121, vib: 0.9, amp: 46, pres: 2.1, run: 8740, health: 90, rul: 95, st: 'ok' },
  { id: 'D-02', name: 'Tablet press D-02', f: 'D', type: 'Press', temp: 34, vib: 1.4, amp: 38, pres: 18, run: 6420, health: 95, rul: 160, st: 'ok' },
  { id: 'D-05', name: 'Coating pan D-05', f: 'D', type: 'Coater', temp: 45, vib: 1.1, amp: 29, pres: null, run: 7110, health: 91, rul: 140, st: 'ok' },
  { id: 'E-07', name: 'Injection molder E-07', f: 'E', type: 'Molder', temp: 64, vib: 2.2, amp: 152, pres: 140, run: 19880, health: 82, rul: 61, st: 'ok' },
  { id: 'F-09', name: 'CNC cell F-09', f: 'F', type: 'CNC', temp: 39, vib: 1.7, amp: 58, pres: 6.2, run: 11320, health: 89, rul: 88, st: 'ok' },
  { id: 'F-14', name: 'Paint booth fan F-14', f: 'F', type: 'Fan', temp: 47, vib: 2.6, amp: 74, pres: null, run: 15600, health: 79, rul: 52, st: 'ok' },
  { id: 'A-21', name: 'Loom line A-21', f: 'A', type: 'Loom', temp: 36, vib: 2.0, amp: 41, pres: null, run: 20450, health: 86, rul: 70, st: 'ok' },
  { id: 'C-08', name: 'Overhead crane C-08', f: 'C', type: 'Crane', temp: 52, vib: 2.4, amp: 166, pres: null, run: 14200, health: 84, rul: 64, st: 'ok' },
  { id: 'S-AC1', name: 'Air compressor S-AC1', f: 'S', type: 'Compressor', temp: 68, vib: 2.9, amp: 132, pres: 8.1, run: 26780, health: 77, rul: 44, st: 'ok' },
];

/* ---------- generic series helpers ---------- */
const days = range => range.days;
const series = (key, n, base, amp, opts = {}) => { const r = rng(key); const out = []; let v = base; for (let i = 0; i < n; i++) { v = base + (r() * 2 - 1) * amp + (opts.drift || 0) * i; out.push(+v.toFixed(opts.dec ?? 1)); } return out; };
const dayLabels = (end, n) => { const a = []; for (let i = n - 1; i >= 0; i--) a.push(addDays(end, -i)); return a; };
const solarAt = h => (h < 6 || h > 18.5) ? 0 : Math.max(0, Math.sin((h - 6) / 12.5 * Math.PI)) * 2.32;
const loadAt = h => 4.6 + 2.4 * Math.exp(-((h - 12.5) ** 2) / 18) + (h > 6 && h < 22 ? .5 : 0);

return { rng, hash, pick, pad, sum, cairo, today, addDays, dmy, dShort, hm, clockAgo, hourNow, isWeekend,
  FACTORIES, fac, CARRIERS, GATES, PROF_IN, PROF_OUT, DAY_TOTAL, traffic, VEH, vehStats, facStats,
  ANPR, pushEvent, ALARMS, OPS, activeAlarms, alarmCounts, SYSTEMS, MACHINES, series, dayLabels, solarAt, loadAt, days };
})();
