var Kr = Object.defineProperty;
var zr = (n, e, t) => e in n ? Kr(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var B = (n, e, t) => (zr(n, typeof e != "symbol" ? e + "" : e, t), t), Yt = (n, e, t) => {
  if (!e.has(n))
    throw TypeError("Cannot " + t);
};
var N = (n, e, t) => (Yt(n, e, "read from private field"), t ? t.call(n) : e.get(n)), R = (n, e, t) => {
  if (e.has(n))
    throw TypeError("Cannot add the same private member more than once");
  e instanceof WeakSet ? e.add(n) : e.set(n, t);
}, A = (n, e, t, c) => (Yt(n, e, "write to private field"), c ? c.call(n, t) : e.set(n, t), t);
var Z = (n, e, t) => (Yt(n, e, "access private method"), t);
const Oc = "6.6.3";
function Vr(n, e, t) {
  const c = e.split("|").map((a) => a.trim());
  for (let a = 0; a < c.length; a++)
    switch (e) {
      case "any":
        return;
      case "bigint":
      case "boolean":
      case "number":
      case "string":
        if (typeof n === e)
          return;
    }
  const r = new Error(`invalid value for type ${e}`);
  throw r.code = "INVALID_ARGUMENT", r.argument = `value.${t}`, r.value = n, r;
}
async function An(n) {
  const e = Object.keys(n);
  return (await Promise.all(e.map((c) => Promise.resolve(n[c])))).reduce((c, r, a) => (c[e[a]] = r, c), {});
}
function fe(n, e, t) {
  for (let c in e) {
    let r = e[c];
    const a = t ? t[c] : null;
    a && Vr(r, a, c), Object.defineProperty(n, c, { enumerable: !0, value: r, writable: !1 });
  }
}
function d0(n) {
  if (n == null)
    return "null";
  if (Array.isArray(n))
    return "[ " + n.map(d0).join(", ") + " ]";
  if (n instanceof Uint8Array) {
    const e = "0123456789abcdef";
    let t = "0x";
    for (let c = 0; c < n.length; c++)
      t += e[n[c] >> 4], t += e[n[c] & 15];
    return t;
  }
  if (typeof n == "object" && typeof n.toJSON == "function")
    return d0(n.toJSON());
  switch (typeof n) {
    case "boolean":
    case "symbol":
      return n.toString();
    case "bigint":
      return BigInt(n).toString();
    case "number":
      return n.toString();
    case "string":
      return JSON.stringify(n);
    case "object": {
      const e = Object.keys(n);
      return e.sort(), "{ " + e.map((t) => `${d0(t)}: ${d0(n[t])}`).join(", ") + " }";
    }
  }
  return "[ COULD NOT SERIALIZE ]";
}
function jr(n, e, t) {
  {
    const r = [];
    if (t) {
      if ("message" in t || "code" in t || "name" in t)
        throw new Error(`value will overwrite populated values: ${d0(t)}`);
      for (const a in t) {
        const x = t[a];
        r.push(a + "=" + d0(x));
      }
    }
    r.push(`code=${e}`), r.push(`version=${Oc}`), r.length && (n += " (" + r.join(", ") + ")");
  }
  let c;
  switch (e) {
    case "INVALID_ARGUMENT":
      c = new TypeError(n);
      break;
    case "NUMERIC_FAULT":
    case "BUFFER_OVERRUN":
      c = new RangeError(n);
      break;
    default:
      c = new Error(n);
  }
  return fe(c, { code: e }), t && Object.assign(c, t), c;
}
function T(n, e, t, c) {
  if (!n)
    throw jr(e, t, c);
}
function b(n, e, t, c) {
  T(n, e, "INVALID_ARGUMENT", { argument: t, value: c });
}
const Wr = ["NFD", "NFC", "NFKD", "NFKC"].reduce((n, e) => {
  try {
    if ("test".normalize(e) !== "test")
      throw new Error("bad");
    if (e === "NFD") {
      const t = String.fromCharCode(233).normalize("NFD"), c = String.fromCharCode(101, 769);
      if (t !== c)
        throw new Error("broken");
    }
    n.push(e);
  } catch {
  }
  return n;
}, []);
function Bc(n) {
  T(Wr.indexOf(n) >= 0, "platform missing String.prototype.normalize", "UNSUPPORTED_OPERATION", {
    operation: "String.prototype.normalize",
    info: { form: n }
  });
}
function zt(n, e, t) {
  if (t == null && (t = ""), n !== e) {
    let c = t, r = "new";
    t && (c += ".", r += " " + t), T(!1, `private constructor; use ${c}from* methods`, "UNSUPPORTED_OPERATION", {
      operation: r
    });
  }
}
function Cc(n, e, t) {
  if (n instanceof Uint8Array)
    return t ? new Uint8Array(n) : n;
  if (typeof n == "string" && n.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
    const c = new Uint8Array((n.length - 2) / 2);
    let r = 2;
    for (let a = 0; a < c.length; a++)
      c[a] = parseInt(n.substring(r, r + 2), 16), r += 2;
    return c;
  }
  b(!1, "invalid BytesLike value", e || "value", n);
}
function g(n, e) {
  return Cc(n, e, !1);
}
function Ye(n, e) {
  return Cc(n, e, !0);
}
function He(n, e) {
  return !(typeof n != "string" || !n.match(/^0x[0-9A-Fa-f]*$/) || typeof e == "number" && n.length !== 2 + 2 * e || e === !0 && n.length % 2 !== 0);
}
function Uc(n) {
  return He(n, !0) || n instanceof Uint8Array;
}
const Gn = "0123456789abcdef";
function m(n) {
  const e = g(n);
  let t = "0x";
  for (let c = 0; c < e.length; c++) {
    const r = e[c];
    t += Gn[(r & 240) >> 4] + Gn[r & 15];
  }
  return t;
}
function W(n) {
  return "0x" + n.map((e) => m(e).substring(2)).join("");
}
function J0(n) {
  return He(n, !0) ? (n.length - 2) / 2 : g(n).length;
}
function En(n, e, t) {
  const c = g(n);
  return t != null && t > c.length && T(!1, "cannot slice beyond data bounds", "BUFFER_OVERRUN", {
    buffer: c,
    length: c.length,
    offset: t
  }), m(c.slice(e ?? 0, t ?? c.length));
}
function Zr(n, e, t) {
  const c = g(n);
  T(e >= c.length, "padding exceeds data length", "BUFFER_OVERRUN", {
    buffer: new Uint8Array(c),
    length: e,
    offset: e + 1
  });
  const r = new Uint8Array(e);
  return r.fill(0), t ? r.set(c, e - c.length) : r.set(c, 0), m(r);
}
function L0(n, e) {
  return Zr(n, e, !0);
}
const In = BigInt(0), Xe = BigInt(1), b0 = 9007199254740991;
function Yr(n, e) {
  let t = H(n, "value");
  const c = BigInt(Ae(e, "width")), r = Xe << c - Xe;
  if (t < In) {
    t = -t, T(t <= r, "too low", "NUMERIC_FAULT", {
      operation: "toTwos",
      fault: "overflow",
      value: n
    });
    const a = (Xe << c) - Xe;
    return (~t & a) + Xe;
  } else
    T(t < r, "too high", "NUMERIC_FAULT", {
      operation: "toTwos",
      fault: "overflow",
      value: n
    });
  return t;
}
function Xr(n, e) {
  const t = Sn(n, "value"), c = BigInt(Ae(e, "bits"));
  return t & (Xe << c) - Xe;
}
function H(n, e) {
  switch (typeof n) {
    case "bigint":
      return n;
    case "number":
      return b(Number.isInteger(n), "underflow", e || "value", n), b(n >= -b0 && n <= b0, "overflow", e || "value", n), BigInt(n);
    case "string":
      try {
        if (n === "")
          throw new Error("empty string");
        return n[0] === "-" && n[1] !== "-" ? -BigInt(n.substring(1)) : BigInt(n);
      } catch (t) {
        b(!1, `invalid BigNumberish string: ${t.message}`, e || "value", n);
      }
  }
  b(!1, "invalid BigNumberish value", e || "value", n);
}
function Sn(n, e) {
  const t = H(n, e);
  return T(t >= In, "unsigned value cannot be negative", "NUMERIC_FAULT", {
    fault: "overflow",
    operation: "getUint",
    value: n
  }), t;
}
const _n = "0123456789abcdef";
function Lc(n) {
  if (n instanceof Uint8Array) {
    let e = "0x0";
    for (const t of n)
      e += _n[t >> 4], e += _n[t & 15];
    return BigInt(e);
  }
  return H(n);
}
function Ae(n, e) {
  switch (typeof n) {
    case "bigint":
      return b(n >= -b0 && n <= b0, "overflow", e || "value", n), Number(n);
    case "number":
      return b(Number.isInteger(n), "underflow", e || "value", n), b(n >= -b0 && n <= b0, "overflow", e || "value", n), n;
    case "string":
      try {
        if (n === "")
          throw new Error("empty string");
        return Ae(BigInt(n), e);
      } catch (t) {
        b(!1, `invalid numeric string: ${t.message}`, e || "value", n);
      }
  }
  b(!1, "invalid numeric value", e || "value", n);
}
function F0(n, e) {
  let c = Sn(n, "value").toString(16);
  if (e == null)
    c.length % 2 && (c = "0" + c);
  else {
    const r = Ae(e, "width");
    for (T(r * 2 >= c.length, `value exceeds width (${r} bits)`, "NUMERIC_FAULT", {
      operation: "toBeHex",
      fault: "overflow",
      value: n
    }); c.length < r * 2; )
      c = "0" + c;
  }
  return "0x" + c;
}
function ie(n) {
  const e = Sn(n, "value");
  if (e === In)
    return new Uint8Array([]);
  let t = e.toString(16);
  t.length % 2 && (t = "0" + t);
  const c = new Uint8Array(t.length / 2);
  for (let r = 0; r < c.length; r++) {
    const a = r * 2;
    c[r] = parseInt(t.substring(a, a + 2), 16);
  }
  return c;
}
function Jr(n) {
  let e = m(Uc(n) ? n : ie(n)).substring(2);
  for (; e.startsWith("0"); )
    e = e.substring(1);
  return e === "" && (e = "0"), "0x" + e;
}
const fn = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
let ut = null;
function qr(n) {
  if (ut == null) {
    ut = {};
    for (let t = 0; t < fn.length; t++)
      ut[fn[t]] = BigInt(t);
  }
  const e = ut[n];
  return b(e != null, "invalid base58 value", "letter", n), e;
}
const Qr = BigInt(0), on = BigInt(58);
function ea(n) {
  let e = Lc(g(n)), t = "";
  for (; e; )
    t = fn[Number(e % on)] + t, e /= on;
  return t;
}
function ta(n) {
  let e = Qr;
  for (let t = 0; t < n.length; t++)
    e *= on, e += qr(n[t]);
  return e;
}
function n0(n, e) {
  e != null && (Bc(e), n = n.normalize(e));
  let t = [];
  for (let c = 0; c < n.length; c++) {
    const r = n.charCodeAt(c);
    if (r < 128)
      t.push(r);
    else if (r < 2048)
      t.push(r >> 6 | 192), t.push(r & 63 | 128);
    else if ((r & 64512) == 55296) {
      c++;
      const a = n.charCodeAt(c);
      b(c < n.length && (a & 64512) === 56320, "invalid surrogate pair", "str", n);
      const x = 65536 + ((r & 1023) << 10) + (a & 1023);
      t.push(x >> 18 | 240), t.push(x >> 12 & 63 | 128), t.push(x >> 6 & 63 | 128), t.push(x & 63 | 128);
    } else
      t.push(r >> 12 | 224), t.push(r >> 6 & 63 | 128), t.push(r & 63 | 128);
  }
  return new Uint8Array(t);
}
function na(n) {
  let e = n.toString(16);
  for (; e.length < 2; )
    e = "0" + e;
  return "0x" + e;
}
function Mn(n, e, t) {
  let c = 0;
  for (let r = 0; r < t; r++)
    c = c * 256 + n[e + r];
  return c;
}
function Kn(n, e, t, c) {
  const r = [];
  for (; t < e + 1 + c; ) {
    const a = Fc(n, t);
    r.push(a.result), t += a.consumed, T(t <= e + 1 + c, "child data too short", "BUFFER_OVERRUN", {
      buffer: n,
      length: c,
      offset: e
    });
  }
  return { consumed: 1 + c, result: r };
}
function Fc(n, e) {
  T(n.length !== 0, "data too short", "BUFFER_OVERRUN", {
    buffer: n,
    length: 0,
    offset: 1
  });
  const t = (c) => {
    T(c <= n.length, "data short segment too short", "BUFFER_OVERRUN", {
      buffer: n,
      length: n.length,
      offset: c
    });
  };
  if (n[e] >= 248) {
    const c = n[e] - 247;
    t(e + 1 + c);
    const r = Mn(n, e + 1, c);
    return t(e + 1 + c + r), Kn(n, e, e + 1 + c, c + r);
  } else if (n[e] >= 192) {
    const c = n[e] - 192;
    return t(e + 1 + c), Kn(n, e, e + 1, c);
  } else if (n[e] >= 184) {
    const c = n[e] - 183;
    t(e + 1 + c);
    const r = Mn(n, e + 1, c);
    t(e + 1 + c + r);
    const a = m(n.slice(e + 1 + c, e + 1 + c + r));
    return { consumed: 1 + c + r, result: a };
  } else if (n[e] >= 128) {
    const c = n[e] - 128;
    t(e + 1 + c);
    const r = m(n.slice(e + 1, e + 1 + c));
    return { consumed: 1 + c, result: r };
  }
  return { consumed: 1, result: na(n[e]) };
}
function Pn(n) {
  const e = g(n, "data"), t = Fc(e, 0);
  return b(t.consumed === e.length, "unexpected junk after rlp payload", "data", n), t.result;
}
function zn(n) {
  const e = [];
  for (; n; )
    e.unshift(n & 255), n >>= 8;
  return e;
}
function Dc(n) {
  if (Array.isArray(n)) {
    let c = [];
    if (n.forEach(function(a) {
      c = c.concat(Dc(a));
    }), c.length <= 55)
      return c.unshift(192 + c.length), c;
    const r = zn(c.length);
    return r.unshift(247 + r.length), r.concat(c);
  }
  const e = Array.prototype.slice.call(g(n, "object"));
  if (e.length === 1 && e[0] <= 127)
    return e;
  if (e.length <= 55)
    return e.unshift(128 + e.length), e;
  const t = zn(e.length);
  return t.unshift(183 + t.length), t.concat(e);
}
const Vn = "0123456789abcdef";
function Rt(n) {
  let e = "0x";
  for (const t of Dc(n))
    e += Vn[t >> 4], e += Vn[t & 15];
  return e;
}
function ca(n) {
  const e = g(n, "randomBytes");
  e[6] = e[6] & 15 | 64, e[8] = e[8] & 63 | 128;
  const t = m(e);
  return [
    t.substring(2, 10),
    t.substring(10, 14),
    t.substring(14, 18),
    t.substring(18, 22),
    t.substring(22, 34)
  ].join("-");
}
function dn(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error(`Wrong positive integer: ${n}`);
}
function ra(n) {
  if (typeof n != "boolean")
    throw new Error(`Expected boolean, not ${n}`);
}
function $c(n, ...e) {
  if (!(n instanceof Uint8Array))
    throw new TypeError("Expected Uint8Array");
  if (e.length > 0 && !e.includes(n.length))
    throw new TypeError(`Expected Uint8Array of length ${e}, not of length=${n.length}`);
}
function aa(n) {
  if (typeof n != "function" || typeof n.create != "function")
    throw new Error("Hash should be wrapped by utils.wrapConstructor");
  dn(n.outputLen), dn(n.blockLen);
}
function xa(n, e = !0) {
  if (n.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (e && n.finished)
    throw new Error("Hash#digest() has already been called");
}
function sa(n, e) {
  $c(n);
  const t = e.outputLen;
  if (n.length < t)
    throw new Error(`digestInto() expects output buffer of length at least ${t}`);
}
const F = {
  number: dn,
  bool: ra,
  bytes: $c,
  hash: aa,
  exists: xa,
  output: sa
};
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const Pt = (n) => new Uint32Array(n.buffer, n.byteOffset, Math.floor(n.byteLength / 4)), Nt = (n) => new DataView(n.buffer, n.byteOffset, n.byteLength), pe = (n, e) => n << 32 - e | n >>> e, ia = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
if (!ia)
  throw new Error("Non little-endian hardware is not supported");
Array.from({ length: 256 }, (n, e) => e.toString(16).padStart(2, "0"));
const fa = async () => {
};
async function jn(n, e, t) {
  let c = Date.now();
  for (let r = 0; r < n; r++) {
    t(r);
    const a = Date.now() - c;
    a >= 0 && a < e || (await fa(), c += a);
  }
}
function oa(n) {
  if (typeof n != "string")
    throw new TypeError(`utf8ToBytes expected string, got ${typeof n}`);
  return new TextEncoder().encode(n);
}
function r0(n) {
  if (typeof n == "string" && (n = oa(n)), !(n instanceof Uint8Array))
    throw new TypeError(`Expected input type is Uint8Array (got ${typeof n})`);
  return n;
}
class Ot {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
const da = (n) => Object.prototype.toString.call(n) === "[object Object]" && n.constructor === Object;
function Hc(n, e) {
  if (e !== void 0 && (typeof e != "object" || !da(e)))
    throw new TypeError("Options should be object or undefined");
  return Object.assign(n, e);
}
function _0(n) {
  const e = (c) => n().update(r0(c)).digest(), t = n();
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = () => n(), e;
}
function ba(n) {
  const e = (c, r) => n(r).update(r0(c)).digest(), t = n({});
  return e.outputLen = t.outputLen, e.blockLen = t.blockLen, e.create = (c) => n(c), e;
}
class Gc extends Ot {
  constructor(e, t) {
    super(), this.finished = !1, this.destroyed = !1, F.hash(e);
    const c = r0(t);
    if (this.iHash = e.create(), !(this.iHash instanceof Ot))
      throw new TypeError("Expected instance of class which extends utils.Hash");
    const r = this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const a = new Uint8Array(r);
    a.set(c.length > this.iHash.blockLen ? e.create().update(c).digest() : c);
    for (let x = 0; x < a.length; x++)
      a[x] ^= 54;
    this.iHash.update(a), this.oHash = e.create();
    for (let x = 0; x < a.length; x++)
      a[x] ^= 106;
    this.oHash.update(a), a.fill(0);
  }
  update(e) {
    return F.exists(this), this.iHash.update(e), this;
  }
  digestInto(e) {
    F.exists(this), F.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy();
  }
  digest() {
    const e = new Uint8Array(this.oHash.outputLen);
    return this.digestInto(e), e;
  }
  _cloneInto(e) {
    e || (e = Object.create(Object.getPrototypeOf(this), {}));
    const { oHash: t, iHash: c, finished: r, destroyed: a, blockLen: x, outputLen: s } = this;
    return e = e, e.finished = r, e.destroyed = a, e.blockLen = x, e.outputLen = s, e.oHash = t._cloneInto(e.oHash), e.iHash = c._cloneInto(e.iHash), e;
  }
  destroy() {
    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy();
  }
}
const Nn = (n, e, t) => new Gc(n, e).update(t).digest();
Nn.create = (n, e) => new Gc(n, e);
function la(n, e, t, c) {
  F.hash(n);
  const r = Hc({ dkLen: 32, asyncTick: 10 }, c), { c: a, dkLen: x, asyncTick: s } = r;
  if (F.number(a), F.number(x), F.number(s), a < 1)
    throw new Error("PBKDF2: iterations (c) should be >= 1");
  const i = r0(e), f = r0(t), o = new Uint8Array(x), d = Nn.create(n, i), l = d._cloneInto().update(f);
  return { c: a, dkLen: x, asyncTick: s, DK: o, PRF: d, PRFSalt: l };
}
function ua(n, e, t, c, r) {
  return n.destroy(), e.destroy(), c && c.destroy(), r.fill(0), t;
}
function Tn(n, e, t, c) {
  const { c: r, dkLen: a, DK: x, PRF: s, PRFSalt: i } = la(n, e, t, c);
  let f;
  const o = new Uint8Array(4), d = Nt(o), l = new Uint8Array(s.outputLen);
  for (let u = 1, y = 0; y < a; u++, y += s.outputLen) {
    const p = x.subarray(y, y + s.outputLen);
    d.setInt32(0, u, !1), (f = i._cloneInto(f)).update(o).digestInto(l), p.set(l.subarray(0, p.length));
    for (let I = 1; I < r; I++) {
      s._cloneInto(f).update(l).digestInto(l);
      for (let S = 0; S < p.length; S++)
        p[S] ^= l[S];
    }
  }
  return ua(s, i, x, f, l);
}
function ha(n, e, t, c) {
  if (typeof n.setBigUint64 == "function")
    return n.setBigUint64(e, t, c);
  const r = BigInt(32), a = BigInt(4294967295), x = Number(t >> r & a), s = Number(t & a), i = c ? 4 : 0, f = c ? 0 : 4;
  n.setUint32(e + i, x, c), n.setUint32(e + f, s, c);
}
class kn extends Ot {
  constructor(e, t, c, r) {
    super(), this.blockLen = e, this.outputLen = t, this.padOffset = c, this.isLE = r, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = Nt(this.buffer);
  }
  update(e) {
    F.exists(this);
    const { view: t, buffer: c, blockLen: r } = this;
    e = r0(e);
    const a = e.length;
    for (let x = 0; x < a; ) {
      const s = Math.min(r - this.pos, a - x);
      if (s === r) {
        const i = Nt(e);
        for (; r <= a - x; x += r)
          this.process(i, x);
        continue;
      }
      c.set(e.subarray(x, x + s), this.pos), this.pos += s, x += s, this.pos === r && (this.process(t, 0), this.pos = 0);
    }
    return this.length += e.length, this.roundClean(), this;
  }
  digestInto(e) {
    F.exists(this), F.output(e, this), this.finished = !0;
    const { buffer: t, view: c, blockLen: r, isLE: a } = this;
    let { pos: x } = this;
    t[x++] = 128, this.buffer.subarray(x).fill(0), this.padOffset > r - x && (this.process(c, 0), x = 0);
    for (let i = x; i < r; i++)
      t[i] = 0;
    ha(c, r - 8, BigInt(this.length * 8), a), this.process(c, 0);
    const s = Nt(e);
    this.get().forEach((i, f) => s.setUint32(4 * f, i, a));
  }
  digest() {
    const { buffer: e, outputLen: t } = this;
    this.digestInto(e);
    const c = e.slice(0, t);
    return this.destroy(), c;
  }
  _cloneInto(e) {
    e || (e = new this.constructor()), e.set(...this.get());
    const { blockLen: t, buffer: c, length: r, finished: a, destroyed: x, pos: s } = this;
    return e.length = r, e.pos = s, e.finished = a, e.destroyed = x, r % t && e.buffer.set(c), e;
  }
}
const ya = (n, e, t) => n & e ^ ~n & t, pa = (n, e, t) => n & e ^ n & t ^ e & t, ga = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), ve = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]), Re = new Uint32Array(64);
class ma extends kn {
  constructor() {
    super(64, 32, 8, !1), this.A = ve[0] | 0, this.B = ve[1] | 0, this.C = ve[2] | 0, this.D = ve[3] | 0, this.E = ve[4] | 0, this.F = ve[5] | 0, this.G = ve[6] | 0, this.H = ve[7] | 0;
  }
  get() {
    const { A: e, B: t, C: c, D: r, E: a, F: x, G: s, H: i } = this;
    return [e, t, c, r, a, x, s, i];
  }
  // prettier-ignore
  set(e, t, c, r, a, x, s, i) {
    this.A = e | 0, this.B = t | 0, this.C = c | 0, this.D = r | 0, this.E = a | 0, this.F = x | 0, this.G = s | 0, this.H = i | 0;
  }
  process(e, t) {
    for (let d = 0; d < 16; d++, t += 4)
      Re[d] = e.getUint32(t, !1);
    for (let d = 16; d < 64; d++) {
      const l = Re[d - 15], u = Re[d - 2], y = pe(l, 7) ^ pe(l, 18) ^ l >>> 3, p = pe(u, 17) ^ pe(u, 19) ^ u >>> 10;
      Re[d] = p + Re[d - 7] + y + Re[d - 16] | 0;
    }
    let { A: c, B: r, C: a, D: x, E: s, F: i, G: f, H: o } = this;
    for (let d = 0; d < 64; d++) {
      const l = pe(s, 6) ^ pe(s, 11) ^ pe(s, 25), u = o + l + ya(s, i, f) + ga[d] + Re[d] | 0, p = (pe(c, 2) ^ pe(c, 13) ^ pe(c, 22)) + pa(c, r, a) | 0;
      o = f, f = i, i = s, s = x + u | 0, x = a, a = r, r = c, c = u + p | 0;
    }
    c = c + this.A | 0, r = r + this.B | 0, a = a + this.C | 0, x = x + this.D | 0, s = s + this.E | 0, i = i + this.F | 0, f = f + this.G | 0, o = o + this.H | 0, this.set(c, r, a, x, s, i, f, o);
  }
  roundClean() {
    Re.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0);
  }
}
const ot = _0(() => new ma()), ht = BigInt(2 ** 32 - 1), bn = BigInt(32);
function _c(n, e = !1) {
  return e ? { h: Number(n & ht), l: Number(n >> bn & ht) } : { h: Number(n >> bn & ht) | 0, l: Number(n & ht) | 0 };
}
function wa(n, e = !1) {
  let t = new Uint32Array(n.length), c = new Uint32Array(n.length);
  for (let r = 0; r < n.length; r++) {
    const { h: a, l: x } = _c(n[r], e);
    [t[r], c[r]] = [a, x];
  }
  return [t, c];
}
const Aa = (n, e) => BigInt(n >>> 0) << bn | BigInt(e >>> 0), Ea = (n, e, t) => n >>> t, Ia = (n, e, t) => n << 32 - t | e >>> t, Sa = (n, e, t) => n >>> t | e << 32 - t, Pa = (n, e, t) => n << 32 - t | e >>> t, Na = (n, e, t) => n << 64 - t | e >>> t - 32, Ta = (n, e, t) => n >>> t - 32 | e << 64 - t, ka = (n, e) => e, va = (n, e) => n, Ra = (n, e, t) => n << t | e >>> 32 - t, Oa = (n, e, t) => e << t | n >>> 32 - t, Ba = (n, e, t) => e << t - 32 | n >>> 64 - t, Ca = (n, e, t) => n << t - 32 | e >>> 64 - t;
function Ua(n, e, t, c) {
  const r = (e >>> 0) + (c >>> 0);
  return { h: n + t + (r / 2 ** 32 | 0) | 0, l: r | 0 };
}
const La = (n, e, t) => (n >>> 0) + (e >>> 0) + (t >>> 0), Fa = (n, e, t, c) => e + t + c + (n / 2 ** 32 | 0) | 0, Da = (n, e, t, c) => (n >>> 0) + (e >>> 0) + (t >>> 0) + (c >>> 0), $a = (n, e, t, c, r) => e + t + c + r + (n / 2 ** 32 | 0) | 0, Ha = (n, e, t, c, r) => (n >>> 0) + (e >>> 0) + (t >>> 0) + (c >>> 0) + (r >>> 0), Ga = (n, e, t, c, r, a) => e + t + c + r + a + (n / 2 ** 32 | 0) | 0, E = {
  fromBig: _c,
  split: wa,
  toBig: Aa,
  shrSH: Ea,
  shrSL: Ia,
  rotrSH: Sa,
  rotrSL: Pa,
  rotrBH: Na,
  rotrBL: Ta,
  rotr32H: ka,
  rotr32L: va,
  rotlSH: Ra,
  rotlSL: Oa,
  rotlBH: Ba,
  rotlBL: Ca,
  add: Ua,
  add3L: La,
  add3H: Fa,
  add4L: Da,
  add4H: $a,
  add5H: Ga,
  add5L: Ha
}, [_a, Ma] = E.split([
  "0x428a2f98d728ae22",
  "0x7137449123ef65cd",
  "0xb5c0fbcfec4d3b2f",
  "0xe9b5dba58189dbbc",
  "0x3956c25bf348b538",
  "0x59f111f1b605d019",
  "0x923f82a4af194f9b",
  "0xab1c5ed5da6d8118",
  "0xd807aa98a3030242",
  "0x12835b0145706fbe",
  "0x243185be4ee4b28c",
  "0x550c7dc3d5ffb4e2",
  "0x72be5d74f27b896f",
  "0x80deb1fe3b1696b1",
  "0x9bdc06a725c71235",
  "0xc19bf174cf692694",
  "0xe49b69c19ef14ad2",
  "0xefbe4786384f25e3",
  "0x0fc19dc68b8cd5b5",
  "0x240ca1cc77ac9c65",
  "0x2de92c6f592b0275",
  "0x4a7484aa6ea6e483",
  "0x5cb0a9dcbd41fbd4",
  "0x76f988da831153b5",
  "0x983e5152ee66dfab",
  "0xa831c66d2db43210",
  "0xb00327c898fb213f",
  "0xbf597fc7beef0ee4",
  "0xc6e00bf33da88fc2",
  "0xd5a79147930aa725",
  "0x06ca6351e003826f",
  "0x142929670a0e6e70",
  "0x27b70a8546d22ffc",
  "0x2e1b21385c26c926",
  "0x4d2c6dfc5ac42aed",
  "0x53380d139d95b3df",
  "0x650a73548baf63de",
  "0x766a0abb3c77b2a8",
  "0x81c2c92e47edaee6",
  "0x92722c851482353b",
  "0xa2bfe8a14cf10364",
  "0xa81a664bbc423001",
  "0xc24b8b70d0f89791",
  "0xc76c51a30654be30",
  "0xd192e819d6ef5218",
  "0xd69906245565a910",
  "0xf40e35855771202a",
  "0x106aa07032bbd1b8",
  "0x19a4c116b8d2d0c8",
  "0x1e376c085141ab53",
  "0x2748774cdf8eeb99",
  "0x34b0bcb5e19b48a8",
  "0x391c0cb3c5c95a63",
  "0x4ed8aa4ae3418acb",
  "0x5b9cca4f7763e373",
  "0x682e6ff3d6b2b8a3",
  "0x748f82ee5defb2fc",
  "0x78a5636f43172f60",
  "0x84c87814a1f0ab72",
  "0x8cc702081a6439ec",
  "0x90befffa23631e28",
  "0xa4506cebde82bde9",
  "0xbef9a3f7b2c67915",
  "0xc67178f2e372532b",
  "0xca273eceea26619c",
  "0xd186b8c721c0c207",
  "0xeada7dd6cde0eb1e",
  "0xf57d4f7fee6ed178",
  "0x06f067aa72176fba",
  "0x0a637dc5a2c898a6",
  "0x113f9804bef90dae",
  "0x1b710b35131c471b",
  "0x28db77f523047d84",
  "0x32caab7b40c72493",
  "0x3c9ebe0a15c9bebc",
  "0x431d67c49c100d4c",
  "0x4cc5d4becb3e42b6",
  "0x597f299cfc657e2a",
  "0x5fcb6fab3ad6faec",
  "0x6c44198c4a475817"
].map((n) => BigInt(n))), Oe = new Uint32Array(80), Be = new Uint32Array(80);
class vn extends kn {
  constructor() {
    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209;
  }
  // prettier-ignore
  get() {
    const { Ah: e, Al: t, Bh: c, Bl: r, Ch: a, Cl: x, Dh: s, Dl: i, Eh: f, El: o, Fh: d, Fl: l, Gh: u, Gl: y, Hh: p, Hl: I } = this;
    return [e, t, c, r, a, x, s, i, f, o, d, l, u, y, p, I];
  }
  // prettier-ignore
  set(e, t, c, r, a, x, s, i, f, o, d, l, u, y, p, I) {
    this.Ah = e | 0, this.Al = t | 0, this.Bh = c | 0, this.Bl = r | 0, this.Ch = a | 0, this.Cl = x | 0, this.Dh = s | 0, this.Dl = i | 0, this.Eh = f | 0, this.El = o | 0, this.Fh = d | 0, this.Fl = l | 0, this.Gh = u | 0, this.Gl = y | 0, this.Hh = p | 0, this.Hl = I | 0;
  }
  process(e, t) {
    for (let w = 0; w < 16; w++, t += 4)
      Oe[w] = e.getUint32(t), Be[w] = e.getUint32(t += 4);
    for (let w = 16; w < 80; w++) {
      const D = Oe[w - 15] | 0, P = Be[w - 15] | 0, M = E.rotrSH(D, P, 1) ^ E.rotrSH(D, P, 8) ^ E.shrSH(D, P, 7), q = E.rotrSL(D, P, 1) ^ E.rotrSL(D, P, 8) ^ E.shrSL(D, P, 7), K = Oe[w - 2] | 0, z = Be[w - 2] | 0, ee = E.rotrSH(K, z, 19) ^ E.rotrBH(K, z, 61) ^ E.shrSH(K, z, 6), oe = E.rotrSL(K, z, 19) ^ E.rotrBL(K, z, 61) ^ E.shrSL(K, z, 6), te = E.add4L(q, oe, Be[w - 7], Be[w - 16]), de = E.add4H(te, M, ee, Oe[w - 7], Oe[w - 16]);
      Oe[w] = de | 0, Be[w] = te | 0;
    }
    let { Ah: c, Al: r, Bh: a, Bl: x, Ch: s, Cl: i, Dh: f, Dl: o, Eh: d, El: l, Fh: u, Fl: y, Gh: p, Gl: I, Hh: S, Hl: U } = this;
    for (let w = 0; w < 80; w++) {
      const D = E.rotrSH(d, l, 14) ^ E.rotrSH(d, l, 18) ^ E.rotrBH(d, l, 41), P = E.rotrSL(d, l, 14) ^ E.rotrSL(d, l, 18) ^ E.rotrBL(d, l, 41), M = d & u ^ ~d & p, q = l & y ^ ~l & I, K = E.add5L(U, P, q, Ma[w], Be[w]), z = E.add5H(K, S, D, M, _a[w], Oe[w]), ee = K | 0, oe = E.rotrSH(c, r, 28) ^ E.rotrBH(c, r, 34) ^ E.rotrBH(c, r, 39), te = E.rotrSL(c, r, 28) ^ E.rotrBL(c, r, 34) ^ E.rotrBL(c, r, 39), de = c & a ^ c & s ^ a & s, Ee = r & x ^ r & i ^ x & i;
      S = p | 0, U = I | 0, p = u | 0, I = y | 0, u = d | 0, y = l | 0, { h: d, l } = E.add(f | 0, o | 0, z | 0, ee | 0), f = s | 0, o = i | 0, s = a | 0, i = x | 0, a = c | 0, x = r | 0;
      const ye = E.add3L(ee, te, Ee);
      c = E.add3H(ye, z, oe, de), r = ye | 0;
    }
    ({ h: c, l: r } = E.add(this.Ah | 0, this.Al | 0, c | 0, r | 0)), { h: a, l: x } = E.add(this.Bh | 0, this.Bl | 0, a | 0, x | 0), { h: s, l: i } = E.add(this.Ch | 0, this.Cl | 0, s | 0, i | 0), { h: f, l: o } = E.add(this.Dh | 0, this.Dl | 0, f | 0, o | 0), { h: d, l } = E.add(this.Eh | 0, this.El | 0, d | 0, l | 0), { h: u, l: y } = E.add(this.Fh | 0, this.Fl | 0, u | 0, y | 0), { h: p, l: I } = E.add(this.Gh | 0, this.Gl | 0, p | 0, I | 0), { h: S, l: U } = E.add(this.Hh | 0, this.Hl | 0, S | 0, U | 0), this.set(c, r, a, x, s, i, f, o, d, l, u, y, p, I, S, U);
  }
  roundClean() {
    Oe.fill(0), Be.fill(0);
  }
  destroy() {
    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  }
}
class Ka extends vn {
  constructor() {
    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32;
  }
}
class za extends vn {
  constructor() {
    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48;
  }
}
const Rn = _0(() => new vn());
_0(() => new Ka());
_0(() => new za());
function Va() {
  if (typeof self < "u")
    return self;
  if (typeof window < "u")
    return window;
  if (typeof global < "u")
    return global;
  throw new Error("unable to locate global object");
}
const Wn = Va(), Zn = Wn.crypto || Wn.msCrypto;
function ja(n) {
  switch (n) {
    case "sha256":
      return ot.create();
    case "sha512":
      return Rn.create();
  }
  b(!1, "invalid hashing algorithm name", "algorithm", n);
}
function Wa(n, e) {
  const t = { sha256: ot, sha512: Rn }[n];
  return b(t != null, "invalid hmac algorithm", "algorithm", n), Nn.create(t, e);
}
function Za(n, e, t, c, r) {
  const a = { sha256: ot, sha512: Rn }[r];
  return b(a != null, "invalid pbkdf2 algorithm", "algorithm", r), Tn(a, n, e, { c: t, dkLen: c });
}
function Ya(n) {
  T(Zn != null, "platform does not support secure random numbers", "UNSUPPORTED_OPERATION", {
    operation: "randomBytes"
  }), b(Number.isInteger(n) && n > 0 && n <= 1024, "invalid length", "length", n);
  const e = new Uint8Array(n);
  return Zn.getRandomValues(e), e;
}
let Mc = !1;
const Kc = function(n, e, t) {
  return Wa(n, e).update(t).digest();
};
let zc = Kc;
function x0(n, e, t) {
  const c = g(e, "key"), r = g(t, "data");
  return m(zc(n, c, r));
}
x0._ = Kc;
x0.lock = function() {
  Mc = !0;
};
x0.register = function(n) {
  if (Mc)
    throw new Error("computeHmac is locked");
  zc = n;
};
Object.freeze(x0);
const [Vc, jc, Wc] = [[], [], []], Xa = BigInt(0), V0 = BigInt(1), Ja = BigInt(2), qa = BigInt(7), Qa = BigInt(256), ex = BigInt(113);
for (let n = 0, e = V0, t = 1, c = 0; n < 24; n++) {
  [t, c] = [c, (2 * t + 3 * c) % 5], Vc.push(2 * (5 * c + t)), jc.push((n + 1) * (n + 2) / 2 % 64);
  let r = Xa;
  for (let a = 0; a < 7; a++)
    e = (e << V0 ^ (e >> qa) * ex) % Qa, e & Ja && (r ^= V0 << (V0 << BigInt(a)) - V0);
  Wc.push(r);
}
const [tx, nx] = E.split(Wc, !0), Yn = (n, e, t) => t > 32 ? E.rotlBH(n, e, t) : E.rotlSH(n, e, t), Xn = (n, e, t) => t > 32 ? E.rotlBL(n, e, t) : E.rotlSL(n, e, t);
function cx(n, e = 24) {
  const t = new Uint32Array(10);
  for (let c = 24 - e; c < 24; c++) {
    for (let x = 0; x < 10; x++)
      t[x] = n[x] ^ n[x + 10] ^ n[x + 20] ^ n[x + 30] ^ n[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const s = (x + 8) % 10, i = (x + 2) % 10, f = t[i], o = t[i + 1], d = Yn(f, o, 1) ^ t[s], l = Xn(f, o, 1) ^ t[s + 1];
      for (let u = 0; u < 50; u += 10)
        n[x + u] ^= d, n[x + u + 1] ^= l;
    }
    let r = n[2], a = n[3];
    for (let x = 0; x < 24; x++) {
      const s = jc[x], i = Yn(r, a, s), f = Xn(r, a, s), o = Vc[x];
      r = n[o], a = n[o + 1], n[o] = i, n[o + 1] = f;
    }
    for (let x = 0; x < 50; x += 10) {
      for (let s = 0; s < 10; s++)
        t[s] = n[x + s];
      for (let s = 0; s < 10; s++)
        n[x + s] ^= ~t[(s + 2) % 10] & t[(s + 4) % 10];
    }
    n[0] ^= tx[c], n[1] ^= nx[c];
  }
  t.fill(0);
}
class Vt extends Ot {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(e, t, c, r = !1, a = 24) {
    if (super(), this.blockLen = e, this.suffix = t, this.outputLen = c, this.enableXOF = r, this.rounds = a, this.pos = 0, this.posOut = 0, this.finished = !1, this.destroyed = !1, F.number(c), 0 >= this.blockLen || this.blockLen >= 200)
      throw new Error("Sha3 supports only keccak-f1600 function");
    this.state = new Uint8Array(200), this.state32 = Pt(this.state);
  }
  keccak() {
    cx(this.state32, this.rounds), this.posOut = 0, this.pos = 0;
  }
  update(e) {
    F.exists(this);
    const { blockLen: t, state: c } = this;
    e = r0(e);
    const r = e.length;
    for (let a = 0; a < r; ) {
      const x = Math.min(t - this.pos, r - a);
      for (let s = 0; s < x; s++)
        c[this.pos++] ^= e[a++];
      this.pos === t && this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished)
      return;
    this.finished = !0;
    const { state: e, suffix: t, pos: c, blockLen: r } = this;
    e[c] ^= t, t & 128 && c === r - 1 && this.keccak(), e[r - 1] ^= 128, this.keccak();
  }
  writeInto(e) {
    F.exists(this, !1), F.bytes(e), this.finish();
    const t = this.state, { blockLen: c } = this;
    for (let r = 0, a = e.length; r < a; ) {
      this.posOut >= c && this.keccak();
      const x = Math.min(c - this.posOut, a - r);
      e.set(t.subarray(this.posOut, this.posOut + x), r), this.posOut += x, r += x;
    }
    return e;
  }
  xofInto(e) {
    if (!this.enableXOF)
      throw new Error("XOF is not possible for this instance");
    return this.writeInto(e);
  }
  xof(e) {
    return F.number(e), this.xofInto(new Uint8Array(e));
  }
  digestInto(e) {
    if (F.output(e, this), this.finished)
      throw new Error("digest() was already called");
    return this.writeInto(e), this.destroy(), e;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = !0, this.state.fill(0);
  }
  _cloneInto(e) {
    const { blockLen: t, suffix: c, outputLen: r, rounds: a, enableXOF: x } = this;
    return e || (e = new Vt(t, c, r, x, a)), e.state32.set(this.state32), e.pos = this.pos, e.posOut = this.posOut, e.finished = this.finished, e.rounds = a, e.suffix = c, e.outputLen = r, e.enableXOF = x, e.destroyed = this.destroyed, e;
  }
}
const Ge = (n, e, t) => _0(() => new Vt(e, n, t));
Ge(6, 144, 224 / 8);
Ge(6, 136, 256 / 8);
Ge(6, 104, 384 / 8);
Ge(6, 72, 512 / 8);
Ge(1, 144, 224 / 8);
const rx = Ge(1, 136, 256 / 8);
Ge(1, 104, 384 / 8);
Ge(1, 72, 512 / 8);
const Zc = (n, e, t) => ba((c = {}) => new Vt(e, n, c.dkLen === void 0 ? t : c.dkLen, !0));
Zc(31, 168, 128 / 8);
Zc(31, 136, 256 / 8);
let Yc = !1;
const Xc = function(n) {
  return rx(n);
};
let Jc = Xc;
function G(n) {
  const e = g(n, "data");
  return m(Jc(e));
}
G._ = Xc;
G.lock = function() {
  Yc = !0;
};
G.register = function(n) {
  if (Yc)
    throw new TypeError("keccak256 is locked");
  Jc = n;
};
Object.freeze(G);
const ax = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]), qc = Uint8Array.from({ length: 16 }, (n, e) => e), xx = qc.map((n) => (9 * n + 5) % 16);
let On = [qc], Bn = [xx];
for (let n = 0; n < 4; n++)
  for (let e of [On, Bn])
    e.push(e[n].map((t) => ax[t]));
const Qc = [
  [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
  [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
  [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
  [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
  [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
].map((n) => new Uint8Array(n)), sx = On.map((n, e) => n.map((t) => Qc[e][t])), ix = Bn.map((n, e) => n.map((t) => Qc[e][t])), fx = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]), ox = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]), yt = (n, e) => n << e | n >>> 32 - e;
function Jn(n, e, t, c) {
  return n === 0 ? e ^ t ^ c : n === 1 ? e & t | ~e & c : n === 2 ? (e | ~t) ^ c : n === 3 ? e & c | t & ~c : e ^ (t | ~c);
}
const pt = new Uint32Array(16);
class dx extends kn {
  constructor() {
    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776;
  }
  get() {
    const { h0: e, h1: t, h2: c, h3: r, h4: a } = this;
    return [e, t, c, r, a];
  }
  set(e, t, c, r, a) {
    this.h0 = e | 0, this.h1 = t | 0, this.h2 = c | 0, this.h3 = r | 0, this.h4 = a | 0;
  }
  process(e, t) {
    for (let u = 0; u < 16; u++, t += 4)
      pt[u] = e.getUint32(t, !0);
    let c = this.h0 | 0, r = c, a = this.h1 | 0, x = a, s = this.h2 | 0, i = s, f = this.h3 | 0, o = f, d = this.h4 | 0, l = d;
    for (let u = 0; u < 5; u++) {
      const y = 4 - u, p = fx[u], I = ox[u], S = On[u], U = Bn[u], w = sx[u], D = ix[u];
      for (let P = 0; P < 16; P++) {
        const M = yt(c + Jn(u, a, s, f) + pt[S[P]] + p, w[P]) + d | 0;
        c = d, d = f, f = yt(s, 10) | 0, s = a, a = M;
      }
      for (let P = 0; P < 16; P++) {
        const M = yt(r + Jn(y, x, i, o) + pt[U[P]] + I, D[P]) + l | 0;
        r = l, l = o, o = yt(i, 10) | 0, i = x, x = M;
      }
    }
    this.set(this.h1 + s + o | 0, this.h2 + f + l | 0, this.h3 + d + r | 0, this.h4 + c + x | 0, this.h0 + a + i | 0);
  }
  roundClean() {
    pt.fill(0);
  }
  destroy() {
    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0);
  }
}
const bx = _0(() => new dx());
let er = !1;
const tr = function(n) {
  return bx(n);
};
let nr = tr;
function M0(n) {
  const e = g(n, "data");
  return m(nr(e));
}
M0._ = tr;
M0.lock = function() {
  er = !0;
};
M0.register = function(n) {
  if (er)
    throw new TypeError("ripemd160 is locked");
  nr = n;
};
Object.freeze(M0);
let cr = !1;
const rr = function(n, e, t, c, r) {
  return Za(n, e, t, c, r);
};
let ar = rr;
function _e(n, e, t, c, r) {
  const a = g(n, "password"), x = g(e, "salt");
  return m(ar(a, x, t, c, r));
}
_e._ = rr;
_e.lock = function() {
  cr = !0;
};
_e.register = function(n) {
  if (cr)
    throw new Error("pbkdf2 is locked");
  ar = n;
};
Object.freeze(_e);
let xr = !1;
const sr = function(n) {
  return new Uint8Array(Ya(n));
};
let ir = sr;
function Te(n) {
  return ir(n);
}
Te._ = sr;
Te.lock = function() {
  xr = !0;
};
Te.register = function(n) {
  if (xr)
    throw new Error("randomBytes is locked");
  ir = n;
};
Object.freeze(Te);
const v = (n, e) => n << e | n >>> 32 - e;
function qn(n, e, t, c, r, a) {
  let x = n[e++] ^ t[c++], s = n[e++] ^ t[c++], i = n[e++] ^ t[c++], f = n[e++] ^ t[c++], o = n[e++] ^ t[c++], d = n[e++] ^ t[c++], l = n[e++] ^ t[c++], u = n[e++] ^ t[c++], y = n[e++] ^ t[c++], p = n[e++] ^ t[c++], I = n[e++] ^ t[c++], S = n[e++] ^ t[c++], U = n[e++] ^ t[c++], w = n[e++] ^ t[c++], D = n[e++] ^ t[c++], P = n[e++] ^ t[c++], M = x, q = s, K = i, z = f, ee = o, oe = d, te = l, de = u, Ee = y, ye = p, Me = I, Ke = S, ze = U, Ve = w, je = D, We = P;
  for (let Hn = 0; Hn < 8; Hn += 2)
    ee ^= v(M + ze | 0, 7), Ee ^= v(ee + M | 0, 9), ze ^= v(Ee + ee | 0, 13), M ^= v(ze + Ee | 0, 18), ye ^= v(oe + q | 0, 7), Ve ^= v(ye + oe | 0, 9), q ^= v(Ve + ye | 0, 13), oe ^= v(q + Ve | 0, 18), je ^= v(Me + te | 0, 7), K ^= v(je + Me | 0, 9), te ^= v(K + je | 0, 13), Me ^= v(te + K | 0, 18), z ^= v(We + Ke | 0, 7), de ^= v(z + We | 0, 9), Ke ^= v(de + z | 0, 13), We ^= v(Ke + de | 0, 18), q ^= v(M + z | 0, 7), K ^= v(q + M | 0, 9), z ^= v(K + q | 0, 13), M ^= v(z + K | 0, 18), te ^= v(oe + ee | 0, 7), de ^= v(te + oe | 0, 9), ee ^= v(de + te | 0, 13), oe ^= v(ee + de | 0, 18), Ke ^= v(Me + ye | 0, 7), Ee ^= v(Ke + Me | 0, 9), ye ^= v(Ee + Ke | 0, 13), Me ^= v(ye + Ee | 0, 18), ze ^= v(We + je | 0, 7), Ve ^= v(ze + We | 0, 9), je ^= v(Ve + ze | 0, 13), We ^= v(je + Ve | 0, 18);
  r[a++] = x + M | 0, r[a++] = s + q | 0, r[a++] = i + K | 0, r[a++] = f + z | 0, r[a++] = o + ee | 0, r[a++] = d + oe | 0, r[a++] = l + te | 0, r[a++] = u + de | 0, r[a++] = y + Ee | 0, r[a++] = p + ye | 0, r[a++] = I + Me | 0, r[a++] = S + Ke | 0, r[a++] = U + ze | 0, r[a++] = w + Ve | 0, r[a++] = D + je | 0, r[a++] = P + We | 0;
}
function l0(n, e, t, c, r) {
  let a = c + 0, x = c + 16 * r;
  for (let s = 0; s < 16; s++)
    t[x + s] = n[e + (2 * r - 1) * 16 + s];
  for (let s = 0; s < r; s++, a += 16, e += 16)
    qn(t, x, n, e, t, a), s > 0 && (x += 16), qn(t, a, n, e += 16, t, x);
}
function fr(n, e, t) {
  const c = Hc({
    dkLen: 32,
    asyncTick: 10,
    maxmem: 1073742848
  }, t), { N: r, r: a, p: x, dkLen: s, asyncTick: i, maxmem: f, onProgress: o } = c;
  if (F.number(r), F.number(a), F.number(x), F.number(s), F.number(i), F.number(f), o !== void 0 && typeof o != "function")
    throw new Error("progressCb should be function");
  const d = 128 * a, l = d / 4;
  if (r <= 1 || r & r - 1 || r >= 2 ** (d / 8) || r > 2 ** 32)
    throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");
  if (x < 0 || x > (2 ** 32 - 1) * 32 / d)
    throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");
  if (s < 0 || s > (2 ** 32 - 1) * 32)
    throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");
  const u = d * (r + x);
  if (u > f)
    throw new Error(`Scrypt: parameters too large, ${u} (128 * r * (N + p)) > ${f} (maxmem)`);
  const y = Tn(ot, n, e, { c: 1, dkLen: d * x }), p = Pt(y), I = Pt(new Uint8Array(d * r)), S = Pt(new Uint8Array(d));
  let U = () => {
  };
  if (o) {
    const w = 2 * r * x, D = Math.max(Math.floor(w / 1e4), 1);
    let P = 0;
    U = () => {
      P++, o && (!(P % D) || P === w) && o(P / w);
    };
  }
  return { N: r, r: a, p: x, dkLen: s, blockSize32: l, V: I, B32: p, B: y, tmp: S, blockMixCb: U, asyncTick: i };
}
function or(n, e, t, c, r) {
  const a = Tn(ot, n, t, { c: 1, dkLen: e });
  return t.fill(0), c.fill(0), r.fill(0), a;
}
function lx(n, e, t) {
  const { N: c, r, p: a, dkLen: x, blockSize32: s, V: i, B32: f, B: o, tmp: d, blockMixCb: l } = fr(n, e, t);
  for (let u = 0; u < a; u++) {
    const y = s * u;
    for (let p = 0; p < s; p++)
      i[p] = f[y + p];
    for (let p = 0, I = 0; p < c - 1; p++)
      l0(i, I, i, I += s, r), l();
    l0(i, (c - 1) * s, f, y, r), l();
    for (let p = 0; p < c; p++) {
      const I = f[y + s - 16] % c;
      for (let S = 0; S < s; S++)
        d[S] = f[y + S] ^ i[I * s + S];
      l0(d, 0, f, y, r), l();
    }
  }
  return or(n, x, o, i, d);
}
async function ux(n, e, t) {
  const { N: c, r, p: a, dkLen: x, blockSize32: s, V: i, B32: f, B: o, tmp: d, blockMixCb: l, asyncTick: u } = fr(n, e, t);
  for (let y = 0; y < a; y++) {
    const p = s * y;
    for (let S = 0; S < s; S++)
      i[S] = f[p + S];
    let I = 0;
    await jn(c - 1, u, (S) => {
      l0(i, I, i, I += s, r), l();
    }), l0(i, (c - 1) * s, f, p, r), l(), await jn(c, u, (S) => {
      const U = f[p + s - 16] % c;
      for (let w = 0; w < s; w++)
        d[w] = f[p + w] ^ i[U * s + w];
      l0(d, 0, f, p, r), l();
    });
  }
  return or(n, x, o, i, d);
}
let dr = !1, br = !1;
const lr = async function(n, e, t, c, r, a, x) {
  return await ux(n, e, { N: t, r: c, p: r, dkLen: a, onProgress: x });
}, ur = function(n, e, t, c, r, a) {
  return lx(n, e, { N: t, r: c, p: r, dkLen: a });
};
let hr = lr, yr = ur;
async function K0(n, e, t, c, r, a, x) {
  const s = g(n, "passwd"), i = g(e, "salt");
  return m(await hr(s, i, t, c, r, a, x));
}
K0._ = lr;
K0.lock = function() {
  br = !0;
};
K0.register = function(n) {
  if (br)
    throw new Error("scrypt is locked");
  hr = n;
};
Object.freeze(K0);
function z0(n, e, t, c, r, a) {
  const x = g(n, "passwd"), s = g(e, "salt");
  return m(yr(x, s, t, c, r, a));
}
z0._ = ur;
z0.lock = function() {
  dr = !0;
};
z0.register = function(n) {
  if (dr)
    throw new Error("scryptSync is locked");
  yr = n;
};
Object.freeze(z0);
const pr = function(n) {
  return ja("sha256").update(n).digest();
};
let gr = pr, mr = !1;
function he(n) {
  const e = g(n, "data");
  return m(gr(e));
}
he._ = pr;
he.lock = function() {
  mr = !0;
};
he.register = function(n) {
  if (mr)
    throw new Error("sha256 is locked");
  gr = n;
};
Object.freeze(he);
Object.freeze(he);
const hx = {}, yx = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: hx
}, Symbol.toStringTag, { value: "Module" }));
/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
const k = BigInt(0), L = BigInt(1), Le = BigInt(2), q0 = BigInt(3), Qn = BigInt(8), _ = Object.freeze({
  a: k,
  b: BigInt(7),
  P: BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
  n: BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
  h: L,
  Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
  Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee")
}), ec = (n, e) => (n + e / Le) / e, gt = {
  beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
  splitScalar(n) {
    const { n: e } = _, t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"), c = -L * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"), r = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"), a = t, x = BigInt("0x100000000000000000000000000000000"), s = ec(a * n, e), i = ec(-c * n, e);
    let f = h(n - s * t - i * r, e), o = h(-s * c - i * a, e);
    const d = f > x, l = o > x;
    if (d && (f = e - f), l && (o = e - o), f > x || o > x)
      throw new Error("splitScalarEndo: Endomorphism failed, k=" + n);
    return { k1neg: d, k1: f, k2neg: l, k2: o };
  }
}, ue = 32, D0 = 32, px = 32, Bt = ue + 1, Ct = 2 * ue + 1;
function tc(n) {
  const { a: e, b: t } = _, c = h(n * n), r = h(c * n);
  return h(r + e * n + t);
}
const mt = _.a === k;
class wr extends Error {
  constructor(e) {
    super(e);
  }
}
function nc(n) {
  if (!(n instanceof O))
    throw new TypeError("JacobianPoint expected");
}
class O {
  constructor(e, t, c) {
    this.x = e, this.y = t, this.z = c;
  }
  static fromAffine(e) {
    if (!(e instanceof C))
      throw new TypeError("JacobianPoint#fromAffine: expected Point");
    return e.equals(C.ZERO) ? O.ZERO : new O(e.x, e.y, L);
  }
  static toAffineBatch(e) {
    const t = Ex(e.map((c) => c.z));
    return e.map((c, r) => c.toAffine(t[r]));
  }
  static normalizeZ(e) {
    return O.toAffineBatch(e).map(O.fromAffine);
  }
  equals(e) {
    nc(e);
    const { x: t, y: c, z: r } = this, { x: a, y: x, z: s } = e, i = h(r * r), f = h(s * s), o = h(t * f), d = h(a * i), l = h(h(c * s) * f), u = h(h(x * r) * i);
    return o === d && l === u;
  }
  negate() {
    return new O(this.x, h(-this.y), this.z);
  }
  double() {
    const { x: e, y: t, z: c } = this, r = h(e * e), a = h(t * t), x = h(a * a), s = e + a, i = h(Le * (h(s * s) - r - x)), f = h(q0 * r), o = h(f * f), d = h(o - Le * i), l = h(f * (i - d) - Qn * x), u = h(Le * t * c);
    return new O(d, l, u);
  }
  add(e) {
    nc(e);
    const { x: t, y: c, z: r } = this, { x: a, y: x, z: s } = e;
    if (a === k || x === k)
      return this;
    if (t === k || c === k)
      return e;
    const i = h(r * r), f = h(s * s), o = h(t * f), d = h(a * i), l = h(h(c * s) * f), u = h(h(x * r) * i), y = h(d - o), p = h(u - l);
    if (y === k)
      return p === k ? this.double() : O.ZERO;
    const I = h(y * y), S = h(y * I), U = h(o * I), w = h(p * p - S - Le * U), D = h(p * (U - w) - l * S), P = h(r * s * y);
    return new O(w, D, P);
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiplyUnsafe(e) {
    const t = O.ZERO;
    if (typeof e == "bigint" && e === k)
      return t;
    let c = ac(e);
    if (c === L)
      return this;
    if (!mt) {
      let d = t, l = this;
      for (; c > k; )
        c & L && (d = d.add(l)), l = l.double(), c >>= L;
      return d;
    }
    let { k1neg: r, k1: a, k2neg: x, k2: s } = gt.splitScalar(c), i = t, f = t, o = this;
    for (; a > k || s > k; )
      a & L && (i = i.add(o)), s & L && (f = f.add(o)), o = o.double(), a >>= L, s >>= L;
    return r && (i = i.negate()), x && (f = f.negate()), f = new O(h(f.x * gt.beta), f.y, f.z), i.add(f);
  }
  precomputeWindow(e) {
    const t = mt ? 128 / e + 1 : 256 / e + 1, c = [];
    let r = this, a = r;
    for (let x = 0; x < t; x++) {
      a = r, c.push(a);
      for (let s = 1; s < 2 ** (e - 1); s++)
        a = a.add(r), c.push(a);
      r = a.double();
    }
    return c;
  }
  wNAF(e, t) {
    !t && this.equals(O.BASE) && (t = C.BASE);
    const c = t && t._WINDOW_SIZE || 1;
    if (256 % c)
      throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");
    let r = t && ln.get(t);
    r || (r = this.precomputeWindow(c), t && c !== 1 && (r = O.normalizeZ(r), ln.set(t, r)));
    let a = O.ZERO, x = O.BASE;
    const s = 1 + (mt ? 128 / c : 256 / c), i = 2 ** (c - 1), f = BigInt(2 ** c - 1), o = 2 ** c, d = BigInt(c);
    for (let l = 0; l < s; l++) {
      const u = l * i;
      let y = Number(e & f);
      e >>= d, y > i && (y -= o, e += L);
      const p = u, I = u + Math.abs(y) - 1, S = l % 2 !== 0, U = y < 0;
      y === 0 ? x = x.add(wt(S, r[p])) : a = a.add(wt(U, r[I]));
    }
    return { p: a, f: x };
  }
  multiply(e, t) {
    let c = ac(e), r, a;
    if (mt) {
      const { k1neg: x, k1: s, k2neg: i, k2: f } = gt.splitScalar(c);
      let { p: o, f: d } = this.wNAF(s, t), { p: l, f: u } = this.wNAF(f, t);
      o = wt(x, o), l = wt(i, l), l = new O(h(l.x * gt.beta), l.y, l.z), r = o.add(l), a = d.add(u);
    } else {
      const { p: x, f: s } = this.wNAF(c, t);
      r = x, a = s;
    }
    return O.normalizeZ([r, a])[0];
  }
  toAffine(e) {
    const { x: t, y: c, z: r } = this, a = this.equals(O.ZERO);
    e == null && (e = a ? Qn : dt(r));
    const x = e, s = h(x * x), i = h(s * x), f = h(t * s), o = h(c * i), d = h(r * x);
    if (a)
      return C.ZERO;
    if (d !== L)
      throw new Error("invZ was invalid");
    return new C(f, o);
  }
}
O.BASE = new O(_.Gx, _.Gy, L);
O.ZERO = new O(k, L, k);
function wt(n, e) {
  const t = e.negate();
  return n ? t : e;
}
const ln = /* @__PURE__ */ new WeakMap();
class C {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
  _setWindowSize(e) {
    this._WINDOW_SIZE = e, ln.delete(this);
  }
  hasEvenY() {
    return this.y % Le === k;
  }
  static fromCompressedHex(e) {
    const t = e.length === 32, c = De(t ? e : e.subarray(1));
    if (!Xt(c))
      throw new Error("Point is not on curve");
    const r = tc(c);
    let a = Ax(r);
    const x = (a & L) === L;
    t ? x && (a = h(-a)) : (e[0] & 1) === 1 !== x && (a = h(-a));
    const s = new C(c, a);
    return s.assertValidity(), s;
  }
  static fromUncompressedHex(e) {
    const t = De(e.subarray(1, ue + 1)), c = De(e.subarray(ue + 1, ue * 2 + 1)), r = new C(t, c);
    return r.assertValidity(), r;
  }
  static fromHex(e) {
    const t = tt(e), c = t.length, r = t[0];
    if (c === ue)
      return this.fromCompressedHex(t);
    if (c === Bt && (r === 2 || r === 3))
      return this.fromCompressedHex(t);
    if (c === Ct && r === 4)
      return this.fromUncompressedHex(t);
    throw new Error(`Point.fromHex: received invalid point. Expected 32-${Bt} compressed bytes or ${Ct} uncompressed bytes, not ${c}`);
  }
  static fromPrivateKey(e) {
    return C.BASE.multiply(ct(e));
  }
  static fromSignature(e, t, c) {
    const { r, s: a } = Tx(t);
    if (![0, 1, 2, 3].includes(c))
      throw new Error("Cannot recover: invalid recovery bit");
    const x = Ar(tt(e)), { n: s } = _, i = c === 2 || c === 3 ? r + s : r, f = dt(i, s), o = h(-x * f, s), d = h(a * f, s), l = c & 1 ? "03" : "02", u = C.fromHex(l + h0(i)), y = C.BASE.multiplyAndAddUnsafe(u, o, d);
    if (!y)
      throw new Error("Cannot recover signature: point at infinify");
    return y.assertValidity(), y;
  }
  toRawBytes(e = !1) {
    return c0(this.toHex(e));
  }
  toHex(e = !1) {
    const t = h0(this.x);
    return e ? `${this.hasEvenY() ? "02" : "03"}${t}` : `04${t}${h0(this.y)}`;
  }
  toHexX() {
    return this.toHex(!0).slice(2);
  }
  toRawX() {
    return this.toRawBytes(!0).slice(1);
  }
  assertValidity() {
    const e = "Point is not on elliptic curve", { x: t, y: c } = this;
    if (!Xt(t) || !Xt(c))
      throw new Error(e);
    const r = h(c * c), a = tc(t);
    if (h(r - a) !== k)
      throw new Error(e);
  }
  equals(e) {
    return this.x === e.x && this.y === e.y;
  }
  negate() {
    return new C(this.x, h(-this.y));
  }
  double() {
    return O.fromAffine(this).double().toAffine();
  }
  add(e) {
    return O.fromAffine(this).add(O.fromAffine(e)).toAffine();
  }
  subtract(e) {
    return this.add(e.negate());
  }
  multiply(e) {
    return O.fromAffine(this).multiply(e, this).toAffine();
  }
  multiplyAndAddUnsafe(e, t, c) {
    const r = O.fromAffine(this), a = t === k || t === L || this !== C.BASE ? r.multiplyUnsafe(t) : r.multiply(t), x = O.fromAffine(e).multiplyUnsafe(c), s = a.add(x);
    return s.equals(O.ZERO) ? void 0 : s.toAffine();
  }
}
C.BASE = new C(_.Gx, _.Gy);
C.ZERO = new C(k, k);
function cc(n) {
  return Number.parseInt(n[0], 16) >= 8 ? "00" + n : n;
}
function rc(n) {
  if (n.length < 2 || n[0] !== 2)
    throw new Error(`Invalid signature integer tag: ${$0(n)}`);
  const e = n[1], t = n.subarray(2, e + 2);
  if (!e || t.length !== e)
    throw new Error("Invalid signature integer: wrong length");
  if (t[0] === 0 && t[1] <= 127)
    throw new Error("Invalid signature integer: trailing length");
  return { data: De(t), left: n.subarray(e + 2) };
}
function gx(n) {
  if (n.length < 2 || n[0] != 48)
    throw new Error(`Invalid signature tag: ${$0(n)}`);
  if (n[1] !== n.length - 2)
    throw new Error("Invalid signature: incorrect length");
  const { data: e, left: t } = rc(n.subarray(2)), { data: c, left: r } = rc(t);
  if (r.length)
    throw new Error(`Invalid signature: left bytes after parsing: ${$0(r)}`);
  return { r: e, s: c };
}
let u0 = class Tt {
  constructor(e, t) {
    this.r = e, this.s = t, this.assertValidity();
  }
  static fromCompact(e) {
    const t = e instanceof Uint8Array, c = "Signature.fromCompact";
    if (typeof e != "string" && !t)
      throw new TypeError(`${c}: Expected string or Uint8Array`);
    const r = t ? $0(e) : e;
    if (r.length !== 128)
      throw new Error(`${c}: Expected 64-byte hex`);
    return new Tt(Ut(r.slice(0, 64)), Ut(r.slice(64, 128)));
  }
  static fromDER(e) {
    const t = e instanceof Uint8Array;
    if (typeof e != "string" && !t)
      throw new TypeError("Signature.fromDER: Expected string or Uint8Array");
    const { r: c, s: r } = gx(t ? e : c0(e));
    return new Tt(c, r);
  }
  static fromHex(e) {
    return this.fromDER(e);
  }
  assertValidity() {
    const { r: e, s: t } = this;
    if (!nt(e))
      throw new Error("Invalid Signature: r must be 0 < r < n");
    if (!nt(t))
      throw new Error("Invalid Signature: s must be 0 < s < n");
  }
  hasHighS() {
    const e = _.n >> L;
    return this.s > e;
  }
  normalizeS() {
    return this.hasHighS() ? new Tt(this.r, h(-this.s, _.n)) : this;
  }
  toDERRawBytes() {
    return c0(this.toDERHex());
  }
  toDERHex() {
    const e = cc(j0(this.s)), t = cc(j0(this.r)), c = e.length / 2, r = t.length / 2, a = j0(c), x = j0(r);
    return `30${j0(r + c + 4)}02${x}${t}02${a}${e}`;
  }
  toRawBytes() {
    return this.toDERRawBytes();
  }
  toHex() {
    return this.toDERHex();
  }
  toCompactRawBytes() {
    return c0(this.toCompactHex());
  }
  toCompactHex() {
    return h0(this.r) + h0(this.s);
  }
};
function Ue(...n) {
  if (!n.every((c) => c instanceof Uint8Array))
    throw new Error("Uint8Array list expected");
  if (n.length === 1)
    return n[0];
  const e = n.reduce((c, r) => c + r.length, 0), t = new Uint8Array(e);
  for (let c = 0, r = 0; c < n.length; c++) {
    const a = n[c];
    t.set(a, r), r += a.length;
  }
  return t;
}
const mx = Array.from({ length: 256 }, (n, e) => e.toString(16).padStart(2, "0"));
function $0(n) {
  if (!(n instanceof Uint8Array))
    throw new Error("Expected Uint8Array");
  let e = "";
  for (let t = 0; t < n.length; t++)
    e += mx[n[t]];
  return e;
}
const wx = BigInt("0x10000000000000000000000000000000000000000000000000000000000000000");
function h0(n) {
  if (typeof n != "bigint")
    throw new Error("Expected bigint");
  if (!(k <= n && n < wx))
    throw new Error("Expected number 0 <= n < 2^256");
  return n.toString(16).padStart(64, "0");
}
function un(n) {
  const e = c0(h0(n));
  if (e.length !== 32)
    throw new Error("Error: expected 32 bytes");
  return e;
}
function j0(n) {
  const e = n.toString(16);
  return e.length & 1 ? `0${e}` : e;
}
function Ut(n) {
  if (typeof n != "string")
    throw new TypeError("hexToNumber: expected string, got " + typeof n);
  return BigInt(`0x${n}`);
}
function c0(n) {
  if (typeof n != "string")
    throw new TypeError("hexToBytes: expected string, got " + typeof n);
  if (n.length % 2)
    throw new Error("hexToBytes: received invalid unpadded hex" + n.length);
  const e = new Uint8Array(n.length / 2);
  for (let t = 0; t < e.length; t++) {
    const c = t * 2, r = n.slice(c, c + 2), a = Number.parseInt(r, 16);
    if (Number.isNaN(a) || a < 0)
      throw new Error("Invalid byte sequence");
    e[t] = a;
  }
  return e;
}
function De(n) {
  return Ut($0(n));
}
function tt(n) {
  return n instanceof Uint8Array ? Uint8Array.from(n) : c0(n);
}
function ac(n) {
  if (typeof n == "number" && Number.isSafeInteger(n) && n > 0)
    return BigInt(n);
  if (typeof n == "bigint" && nt(n))
    return n;
  throw new TypeError("Expected valid private scalar: 0 < scalar < curve.n");
}
function h(n, e = _.P) {
  const t = n % e;
  return t >= k ? t : e + t;
}
function ne(n, e) {
  const { P: t } = _;
  let c = n;
  for (; e-- > k; )
    c *= c, c %= t;
  return c;
}
function Ax(n) {
  const { P: e } = _, t = BigInt(6), c = BigInt(11), r = BigInt(22), a = BigInt(23), x = BigInt(44), s = BigInt(88), i = n * n * n % e, f = i * i * n % e, o = ne(f, q0) * f % e, d = ne(o, q0) * f % e, l = ne(d, Le) * i % e, u = ne(l, c) * l % e, y = ne(u, r) * u % e, p = ne(y, x) * y % e, I = ne(p, s) * p % e, S = ne(I, x) * y % e, U = ne(S, q0) * f % e, w = ne(U, a) * u % e, D = ne(w, t) * i % e, P = ne(D, Le);
  if (P * P % e !== n)
    throw new Error("Cannot find square root");
  return P;
}
function dt(n, e = _.P) {
  if (n === k || e <= k)
    throw new Error(`invert: expected positive integers, got n=${n} mod=${e}`);
  let t = h(n, e), c = e, r = k, a = L;
  for (; t !== k; ) {
    const s = c / t, i = c % t, f = r - a * s;
    c = t, t = i, r = a, a = f;
  }
  if (c !== L)
    throw new Error("invert: does not exist");
  return h(r, e);
}
function Ex(n, e = _.P) {
  const t = new Array(n.length), c = n.reduce((a, x, s) => x === k ? a : (t[s] = a, h(a * x, e)), L), r = dt(c, e);
  return n.reduceRight((a, x, s) => x === k ? a : (t[s] = h(a * t[s], e), h(a * x, e)), r), t;
}
function Ix(n) {
  const e = n.length * 8 - D0 * 8, t = De(n);
  return e > 0 ? t >> BigInt(e) : t;
}
function Ar(n, e = !1) {
  const t = Ix(n);
  if (e)
    return t;
  const { n: c } = _;
  return t >= c ? t - c : t;
}
let y0, Q0;
class Sx {
  constructor(e, t) {
    if (this.hashLen = e, this.qByteLen = t, typeof e != "number" || e < 2)
      throw new Error("hashLen must be a number");
    if (typeof t != "number" || t < 2)
      throw new Error("qByteLen must be a number");
    this.v = new Uint8Array(e).fill(1), this.k = new Uint8Array(e).fill(0), this.counter = 0;
  }
  hmac(...e) {
    return Fe.hmacSha256(this.k, ...e);
  }
  hmacSync(...e) {
    return Q0(this.k, ...e);
  }
  checkSync() {
    if (typeof Q0 != "function")
      throw new wr("hmacSha256Sync needs to be set");
  }
  incr() {
    if (this.counter >= 1e3)
      throw new Error("Tried 1,000 k values for sign(), all were invalid");
    this.counter += 1;
  }
  async reseed(e = new Uint8Array()) {
    this.k = await this.hmac(this.v, Uint8Array.from([0]), e), this.v = await this.hmac(this.v), e.length !== 0 && (this.k = await this.hmac(this.v, Uint8Array.from([1]), e), this.v = await this.hmac(this.v));
  }
  reseedSync(e = new Uint8Array()) {
    this.checkSync(), this.k = this.hmacSync(this.v, Uint8Array.from([0]), e), this.v = this.hmacSync(this.v), e.length !== 0 && (this.k = this.hmacSync(this.v, Uint8Array.from([1]), e), this.v = this.hmacSync(this.v));
  }
  async generate() {
    this.incr();
    let e = 0;
    const t = [];
    for (; e < this.qByteLen; ) {
      this.v = await this.hmac(this.v);
      const c = this.v.slice();
      t.push(c), e += this.v.length;
    }
    return Ue(...t);
  }
  generateSync() {
    this.checkSync(), this.incr();
    let e = 0;
    const t = [];
    for (; e < this.qByteLen; ) {
      this.v = this.hmacSync(this.v);
      const c = this.v.slice();
      t.push(c), e += this.v.length;
    }
    return Ue(...t);
  }
}
function nt(n) {
  return k < n && n < _.n;
}
function Xt(n) {
  return k < n && n < _.P;
}
function Px(n, e, t, c = !0) {
  const { n: r } = _, a = Ar(n, !0);
  if (!nt(a))
    return;
  const x = dt(a, r), s = C.BASE.multiply(a), i = h(s.x, r);
  if (i === k)
    return;
  const f = h(x * h(e + t * i, r), r);
  if (f === k)
    return;
  let o = new u0(i, f), d = (s.x === o.r ? 0 : 2) | Number(s.y & L);
  return c && o.hasHighS() && (o = o.normalizeS(), d ^= 1), { sig: o, recovery: d };
}
function ct(n) {
  let e;
  if (typeof n == "bigint")
    e = n;
  else if (typeof n == "number" && Number.isSafeInteger(n) && n > 0)
    e = BigInt(n);
  else if (typeof n == "string") {
    if (n.length !== 2 * D0)
      throw new Error("Expected 32 bytes of private key");
    e = Ut(n);
  } else if (n instanceof Uint8Array) {
    if (n.length !== D0)
      throw new Error("Expected 32 bytes of private key");
    e = De(n);
  } else
    throw new TypeError("Expected valid private key");
  if (!nt(e))
    throw new Error("Expected private key: 0 < key < n");
  return e;
}
function Nx(n) {
  return n instanceof C ? (n.assertValidity(), n) : C.fromHex(n);
}
function Tx(n) {
  if (n instanceof u0)
    return n.assertValidity(), n;
  try {
    return u0.fromDER(n);
  } catch {
    return u0.fromCompact(n);
  }
}
function kx(n, e = !1) {
  return C.fromPrivateKey(n).toRawBytes(e);
}
function vx(n, e, t, c = !1) {
  return C.fromSignature(n, e, t).toRawBytes(c);
}
function xc(n) {
  const e = n instanceof Uint8Array, t = typeof n == "string", c = (e || t) && n.length;
  return e ? c === Bt || c === Ct : t ? c === Bt * 2 || c === Ct * 2 : n instanceof C;
}
function Rx(n, e, t = !1) {
  if (xc(n))
    throw new TypeError("getSharedSecret: first arg must be private key");
  if (!xc(e))
    throw new TypeError("getSharedSecret: second arg must be public key");
  const c = Nx(e);
  return c.assertValidity(), c.multiply(ct(n)).toRawBytes(t);
}
function Er(n) {
  const e = n.length > ue ? n.slice(0, ue) : n;
  return De(e);
}
function Ox(n) {
  const e = Er(n), t = h(e, _.n);
  return Ir(t < k ? e : t);
}
function Ir(n) {
  return un(n);
}
function Bx(n, e, t) {
  if (n == null)
    throw new Error(`sign: expected valid message hash, not "${n}"`);
  const c = tt(n), r = ct(e), a = [Ir(r), Ox(c)];
  if (t != null) {
    t === !0 && (t = Fe.randomBytes(ue));
    const i = tt(t);
    if (i.length !== ue)
      throw new Error(`sign: Expected ${ue} bytes of extra data`);
    a.push(i);
  }
  const x = Ue(...a), s = Er(c);
  return { seed: x, m: s, d: r };
}
function Cx(n, e) {
  const { sig: t, recovery: c } = n, { der: r, recovered: a } = Object.assign({ canonical: !0, der: !0 }, e), x = r ? t.toDERRawBytes() : t.toCompactRawBytes();
  return a ? [x, c] : x;
}
function Ux(n, e, t = {}) {
  const { seed: c, m: r, d: a } = Bx(n, e, t.extraEntropy), x = new Sx(px, D0);
  x.reseedSync(c);
  let s;
  for (; !(s = Px(x.generateSync(), r, a, t.canonical)); )
    x.reseedSync();
  return Cx(s, t);
}
C.BASE._setWindowSize(8);
const Q = {
  node: yx,
  web: typeof self == "object" && "crypto" in self ? self.crypto : void 0
}, At = {}, Fe = {
  bytesToHex: $0,
  hexToBytes: c0,
  concatBytes: Ue,
  mod: h,
  invert: dt,
  isValidPrivateKey(n) {
    try {
      return ct(n), !0;
    } catch {
      return !1;
    }
  },
  _bigintTo32Bytes: un,
  _normalizePrivateKey: ct,
  hashToPrivateKey: (n) => {
    n = tt(n);
    const e = D0 + 8;
    if (n.length < e || n.length > 1024)
      throw new Error("Expected valid bytes of private key as per FIPS 186");
    const t = h(De(n), _.n - L) + L;
    return un(t);
  },
  randomBytes: (n = 32) => {
    if (Q.web)
      return Q.web.getRandomValues(new Uint8Array(n));
    if (Q.node) {
      const { randomBytes: e } = Q.node;
      return Uint8Array.from(e(n));
    } else
      throw new Error("The environment doesn't have randomBytes function");
  },
  randomPrivateKey: () => Fe.hashToPrivateKey(Fe.randomBytes(D0 + 8)),
  precompute(n = 8, e = C.BASE) {
    const t = e === C.BASE ? e : new C(e.x, e.y);
    return t._setWindowSize(n), t.multiply(q0), t;
  },
  sha256: async (...n) => {
    if (Q.web) {
      const e = await Q.web.subtle.digest("SHA-256", Ue(...n));
      return new Uint8Array(e);
    } else if (Q.node) {
      const { createHash: e } = Q.node, t = e("sha256");
      return n.forEach((c) => t.update(c)), Uint8Array.from(t.digest());
    } else
      throw new Error("The environment doesn't have sha256 function");
  },
  hmacSha256: async (n, ...e) => {
    if (Q.web) {
      const t = await Q.web.subtle.importKey("raw", n, { name: "HMAC", hash: { name: "SHA-256" } }, !1, ["sign"]), c = Ue(...e), r = await Q.web.subtle.sign("HMAC", t, c);
      return new Uint8Array(r);
    } else if (Q.node) {
      const { createHmac: t } = Q.node, c = t("sha256", n);
      return e.forEach((r) => c.update(r)), Uint8Array.from(c.digest());
    } else
      throw new Error("The environment doesn't have hmac-sha256 function");
  },
  sha256Sync: void 0,
  hmacSha256Sync: void 0,
  taggedHash: async (n, ...e) => {
    let t = At[n];
    if (t === void 0) {
      const c = await Fe.sha256(Uint8Array.from(n, (r) => r.charCodeAt(0)));
      t = Ue(c, c), At[n] = t;
    }
    return Fe.sha256(t, ...e);
  },
  taggedHashSync: (n, ...e) => {
    if (typeof y0 != "function")
      throw new wr("sha256Sync is undefined, you need to set it");
    let t = At[n];
    if (t === void 0) {
      const c = y0(Uint8Array.from(n, (r) => r.charCodeAt(0)));
      t = Ue(c, c), At[n] = t;
    }
    return y0(t, ...e);
  },
  _JacobianPoint: O
};
Object.defineProperties(Fe, {
  sha256Sync: {
    configurable: !1,
    get() {
      return y0;
    },
    set(n) {
      y0 || (y0 = n);
    }
  },
  hmacSha256Sync: {
    configurable: !1,
    get() {
      return Q0;
    },
    set(n) {
      Q0 || (Q0 = n);
    }
  }
});
const sc = "0x0000000000000000000000000000000000000000000000000000000000000000", Lx = `Ethereum Signed Message:
`, ic = BigInt(0), fc = BigInt(1), oc = BigInt(2), dc = BigInt(27), bc = BigInt(28), Et = BigInt(35), s0 = {};
function lc(n) {
  return L0(ie(n), 32);
}
var p0, g0, m0, Qe;
const be = class be {
  /**
   *  @private
   */
  constructor(e, t, c, r) {
    R(this, p0, void 0);
    R(this, g0, void 0);
    R(this, m0, void 0);
    R(this, Qe, void 0);
    zt(e, s0, "Signature"), A(this, p0, t), A(this, g0, c), A(this, m0, r), A(this, Qe, null);
  }
  /**
   *  The ``r`` value for a signautre.
   *
   *  This represents the ``x`` coordinate of a "reference" or
   *  challenge point, from which the ``y`` can be computed.
   */
  get r() {
    return N(this, p0);
  }
  set r(e) {
    b(J0(e) === 32, "invalid r", "value", e), A(this, p0, m(e));
  }
  /**
   *  The ``s`` value for a signature.
   */
  get s() {
    return N(this, g0);
  }
  set s(e) {
    b(J0(e) === 32, "invalid s", "value", e);
    const t = m(e);
    b(parseInt(t.substring(0, 3)) < 8, "non-canonical s", "value", t), A(this, g0, t);
  }
  /**
   *  The ``v`` value for a signature.
   *
   *  Since a given ``x`` value for ``r`` has two possible values for
   *  its correspondin ``y``, the ``v`` indicates which of the two ``y``
   *  values to use.
   *
   *  It is normalized to the values ``27`` or ``28`` for legacy
   *  purposes.
   */
  get v() {
    return N(this, m0);
  }
  set v(e) {
    const t = Ae(e, "value");
    b(t === 27 || t === 28, "invalid v", "v", e), A(this, m0, t);
  }
  /**
   *  The EIP-155 ``v`` for legacy transactions. For non-legacy
   *  transactions, this value is ``null``.
   */
  get networkV() {
    return N(this, Qe);
  }
  /**
   *  The chain ID for EIP-155 legacy transactions. For non-legacy
   *  transactions, this value is ``null``.
   */
  get legacyChainId() {
    const e = this.networkV;
    return e == null ? null : be.getChainId(e);
  }
  /**
   *  The ``yParity`` for the signature.
   *
   *  See ``v`` for more details on how this value is used.
   */
  get yParity() {
    return this.v === 27 ? 0 : 1;
  }
  /**
   *  The [[link-eip-2098]] compact representation of the ``yParity``
   *  and ``s`` compacted into a single ``bytes32``.
   */
  get yParityAndS() {
    const e = g(this.s);
    return this.yParity && (e[0] |= 128), m(e);
  }
  /**
   *  The [[link-eip-2098]] compact representation.
   */
  get compactSerialized() {
    return W([this.r, this.yParityAndS]);
  }
  /**
   *  The serialized representation.
   */
  get serialized() {
    return W([this.r, this.s, this.yParity ? "0x1c" : "0x1b"]);
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `Signature { r: "${this.r}", s: "${this.s}", yParity: ${this.yParity}, networkV: ${this.networkV} }`;
  }
  /**
   *  Returns a new identical [[Signature]].
   */
  clone() {
    const e = new be(s0, this.r, this.s, this.v);
    return this.networkV && A(e, Qe, this.networkV), e;
  }
  /**
   *  Returns a representation that is compatible with ``JSON.stringify``.
   */
  toJSON() {
    const e = this.networkV;
    return {
      _type: "signature",
      networkV: e != null ? e.toString() : null,
      r: this.r,
      s: this.s,
      v: this.v
    };
  }
  /**
   *  Compute the chain ID from the ``v`` in a legacy EIP-155 transactions.
   *
   *  @example:
   *    Signature.getChainId(45)
   *    //_result:
   *
   *    Signature.getChainId(46)
   *    //_result:
   */
  static getChainId(e) {
    const t = H(e, "v");
    return t == dc || t == bc ? ic : (b(t >= Et, "invalid EIP-155 v", "v", e), (t - Et) / oc);
  }
  /**
   *  Compute the ``v`` for a chain ID for a legacy EIP-155 transactions.
   *
   *  Legacy transactions which use [[link-eip-155]] hijack the ``v``
   *  property to include the chain ID.
   *
   *  @example:
   *    Signature.getChainIdV(5, 27)
   *    //_result:
   *
   *    Signature.getChainIdV(5, 28)
   *    //_result:
   *
   */
  static getChainIdV(e, t) {
    return H(e) * oc + BigInt(35 + t - 27);
  }
  /**
   *  Compute the normalized legacy transaction ``v`` from a ``yParirty``,
   *  a legacy transaction ``v`` or a legacy [[link-eip-155]] transaction.
   *
   *  @example:
   *    // The values 0 and 1 imply v is actually yParity
   *    Signature.getNormalizedV(0)
   *    //_result:
   *
   *    // Legacy non-EIP-1559 transaction (i.e. 27 or 28)
   *    Signature.getNormalizedV(27)
   *    //_result:
   *
   *    // Legacy EIP-155 transaction (i.e. >= 35)
   *    Signature.getNormalizedV(46)
   *    //_result:
   *
   *    // Invalid values throw
   *    Signature.getNormalizedV(5)
   *    //_error:
   */
  static getNormalizedV(e) {
    const t = H(e);
    return t === ic || t === dc ? 27 : t === fc || t === bc ? 28 : (b(t >= Et, "invalid v", "v", e), t & fc ? 27 : 28);
  }
  /**
   *  Creates a new [[Signature]].
   *
   *  If no %%sig%% is provided, a new [[Signature]] is created
   *  with default values.
   *
   *  If %%sig%% is a string, it is parsed.
   */
  static from(e) {
    function t(f, o) {
      b(f, o, "signature", e);
    }
    if (e == null)
      return new be(s0, sc, sc, 27);
    if (typeof e == "string") {
      const f = g(e, "signature");
      if (f.length === 64) {
        const o = m(f.slice(0, 32)), d = f.slice(32, 64), l = d[0] & 128 ? 28 : 27;
        return d[0] &= 127, new be(s0, o, m(d), l);
      }
      if (f.length === 65) {
        const o = m(f.slice(0, 32)), d = f.slice(32, 64);
        t((d[0] & 128) === 0, "non-canonical s");
        const l = be.getNormalizedV(f[64]);
        return new be(s0, o, m(d), l);
      }
      t(!1, "invalid raw signature length");
    }
    if (e instanceof be)
      return e.clone();
    const c = e.r;
    t(c != null, "missing r");
    const r = lc(c), a = function(f, o) {
      if (f != null)
        return lc(f);
      if (o != null) {
        t(He(o, 32), "invalid yParityAndS");
        const d = g(o);
        return d[0] &= 127, m(d);
      }
      t(!1, "missing s");
    }(e.s, e.yParityAndS);
    t((g(a)[0] & 128) == 0, "non-canonical s");
    const { networkV: x, v: s } = function(f, o, d) {
      if (f != null) {
        const l = H(f);
        return {
          networkV: l >= Et ? l : void 0,
          v: be.getNormalizedV(l)
        };
      }
      if (o != null)
        return t(He(o, 32), "invalid yParityAndS"), { v: g(o)[0] & 128 ? 28 : 27 };
      if (d != null) {
        switch (d) {
          case 0:
            return { v: 27 };
          case 1:
            return { v: 28 };
        }
        t(!1, "invalid yParity");
      }
      t(!1, "missing v");
    }(e.v, e.yParityAndS, e.yParity), i = new be(s0, r, a, s);
    return x && A(i, Qe, x), t(!("yParity" in e && e.yParity !== i.yParity), "yParity mismatch"), t(!("yParityAndS" in e && e.yParityAndS !== i.yParityAndS), "yParityAndS mismatch"), i;
  }
};
p0 = new WeakMap(), g0 = new WeakMap(), m0 = new WeakMap(), Qe = new WeakMap();
let ke = be;
Fe.hmacSha256Sync = function(n, ...e) {
  return g(x0("sha256", n, W(e)));
};
var Se;
const Je = class Je {
  /**
   *  Creates a new **SigningKey** for %%privateKey%%.
   */
  constructor(e) {
    R(this, Se, void 0);
    b(J0(e) === 32, "invalid private key", "privateKey", "[REDACTED]"), A(this, Se, m(e));
  }
  /**
   *  The private key.
   */
  get privateKey() {
    return N(this, Se);
  }
  /**
   *  The uncompressed public key.
   *
   * This will always begin with the prefix ``0x04`` and be 132
   * characters long (the ``0x`` prefix and 130 hexadecimal nibbles).
   */
  get publicKey() {
    return Je.computePublicKey(N(this, Se));
  }
  /**
   *  The compressed public key.
   *
   *  This will always begin with either the prefix ``0x02`` or ``0x03``
   *  and be 68 characters long (the ``0x`` prefix and 33 hexadecimal
   *  nibbles)
   */
  get compressedPublicKey() {
    return Je.computePublicKey(N(this, Se), !0);
  }
  /**
   *  Return the signature of the signed %%digest%%.
   */
  sign(e) {
    b(J0(e) === 32, "invalid digest length", "digest", e);
    const [t, c] = Ux(Ye(e), Ye(N(this, Se)), {
      recovered: !0,
      canonical: !0
    }), r = u0.fromHex(t);
    return ke.from({
      r: F0("0x" + r.r.toString(16), 32),
      s: F0("0x" + r.s.toString(16), 32),
      v: c ? 28 : 27
    });
  }
  /**
   *  Returns the [[link-wiki-ecdh]] shared secret between this
   *  private key and the %%other%% key.
   *
   *  The %%other%% key may be any type of key, a raw public key,
   *  a compressed/uncompressed pubic key or aprivate key.
   *
   *  Best practice is usually to use a cryptographic hash on the
   *  returned value before using it as a symetric secret.
   *
   *  @example:
   *    sign1 = new SigningKey(id("some-secret-1"))
   *    sign2 = new SigningKey(id("some-secret-2"))
   *
   *    // Notice that privA.computeSharedSecret(pubB)...
   *    sign1.computeSharedSecret(sign2.publicKey)
   *    //_result:
   *
   *    // ...is equal to privB.computeSharedSecret(pubA).
   *    sign2.computeSharedSecret(sign1.publicKey)
   *    //_result:
   */
  computeSharedSecret(e) {
    const t = Je.computePublicKey(e);
    return m(Rx(Ye(N(this, Se)), g(t)));
  }
  /**
   *  Compute the public key for %%key%%, optionally %%compressed%%.
   *
   *  The %%key%% may be any type of key, a raw public key, a
   *  compressed/uncompressed public key or private key.
   *
   *  @example:
   *    sign = new SigningKey(id("some-secret"));
   *
   *    // Compute the uncompressed public key for a private key
   *    SigningKey.computePublicKey(sign.privateKey)
   *    //_result:
   *
   *    // Compute the compressed public key for a private key
   *    SigningKey.computePublicKey(sign.privateKey, true)
   *    //_result:
   *
   *    // Compute the uncompressed public key
   *    SigningKey.computePublicKey(sign.publicKey, false);
   *    //_result:
   *
   *    // Compute the Compressed a public key
   *    SigningKey.computePublicKey(sign.publicKey, true);
   *    //_result:
   */
  static computePublicKey(e, t) {
    let c = g(e, "key");
    if (c.length === 32) {
      const a = kx(c, !!t);
      return m(a);
    }
    if (c.length === 64) {
      const a = new Uint8Array(65);
      a[0] = 4, a.set(c, 1), c = a;
    }
    const r = C.fromHex(c);
    return m(r.toRawBytes(t));
  }
  /**
   *  Returns the public key for the private key which produced the
   *  %%signature%% for the given %%digest%%.
   *
   *  @example:
   *    key = new SigningKey(id("some-secret"))
   *    digest = id("hello world")
   *    sig = key.sign(digest)
   *
   *    // Notice the signer public key...
   *    key.publicKey
   *    //_result:
   *
   *    // ...is equal to the recovered public key
   *    SigningKey.recoverPublicKey(digest, sig)
   *    //_result:
   *
   */
  static recoverPublicKey(e, t) {
    b(J0(e) === 32, "invalid digest length", "digest", e);
    const c = ke.from(t), r = u0.fromCompact(Ye(W([c.r, c.s]))).toDERRawBytes(), a = vx(Ye(e), r, c.yParity);
    return b(a != null, "invalid signautre for digest", "signature", t), m(a);
  }
  /**
   *  Returns the point resulting from adding the ellipic curve points
   *  %%p0%% and %%p1%%.
   *
   *  This is not a common function most developers should require, but
   *  can be useful for certain privacy-specific techniques.
   *
   *  For example, it is used by [[HDNodeWallet]] to compute child
   *  addresses from parent public keys and chain codes.
   */
  static addPoints(e, t, c) {
    const r = C.fromHex(Je.computePublicKey(e).substring(2)), a = C.fromHex(Je.computePublicKey(t).substring(2));
    return "0x" + r.add(a).toHex(!!c);
  }
};
Se = new WeakMap();
let we = Je;
const Fx = BigInt(0), Dx = BigInt(36);
function uc(n) {
  n = n.toLowerCase();
  const e = n.substring(2).split(""), t = new Uint8Array(40);
  for (let r = 0; r < 40; r++)
    t[r] = e[r].charCodeAt(0);
  const c = g(G(t));
  for (let r = 0; r < 40; r += 2)
    c[r >> 1] >> 4 >= 8 && (e[r] = e[r].toUpperCase()), (c[r >> 1] & 15) >= 8 && (e[r + 1] = e[r + 1].toUpperCase());
  return "0x" + e.join("");
}
const Cn = {};
for (let n = 0; n < 10; n++)
  Cn[String(n)] = String(n);
for (let n = 0; n < 26; n++)
  Cn[String.fromCharCode(65 + n)] = String(10 + n);
const hc = 15;
function $x(n) {
  n = n.toUpperCase(), n = n.substring(4) + n.substring(0, 2) + "00";
  let e = n.split("").map((c) => Cn[c]).join("");
  for (; e.length >= hc; ) {
    let c = e.substring(0, hc);
    e = parseInt(c, 10) % 97 + e.substring(c.length);
  }
  let t = String(98 - parseInt(e, 10) % 97);
  for (; t.length < 2; )
    t = "0" + t;
  return t;
}
const Hx = function() {
  const n = {};
  for (let e = 0; e < 36; e++) {
    const t = "0123456789abcdefghijklmnopqrstuvwxyz"[e];
    n[t] = BigInt(e);
  }
  return n;
}();
function Gx(n) {
  n = n.toLowerCase();
  let e = Fx;
  for (let t = 0; t < n.length; t++)
    e = e * Dx + Hx[n[t]];
  return e;
}
function J(n) {
  if (b(typeof n == "string", "invalid address", "address", n), n.match(/^(0x)?[0-9a-fA-F]{40}$/)) {
    n.startsWith("0x") || (n = "0x" + n);
    const e = uc(n);
    return b(!n.match(/([A-F].*[a-f])|([a-f].*[A-F])/) || e === n, "bad address checksum", "address", n), e;
  }
  if (n.match(/^XE[0-9]{2}[0-9A-Za-z]{30,31}$/)) {
    b(n.substring(2, 4) === $x(n), "bad icap checksum", "address", n);
    let e = Gx(n.substring(4)).toString(16);
    for (; e.length < 40; )
      e = "0" + e;
    return uc("0x" + e);
  }
  b(!1, "invalid address", "address", n);
}
function _x(n) {
  return n && typeof n.getAddress == "function";
}
async function Jt(n, e) {
  const t = await e;
  return (t == null || t === "0x0000000000000000000000000000000000000000") && (T(typeof n != "string", "unconfigured name", "UNCONFIGURED_NAME", { value: n }), b(!1, "invalid AddressLike value; did not resolve to a value address", "target", n)), J(t);
}
function Lt(n, e) {
  if (typeof n == "string")
    return n.match(/^0x[0-9a-f]{40}$/i) ? J(n) : (T(e != null, "ENS resolution requires a provider", "UNSUPPORTED_OPERATION", { operation: "resolveName" }), Jt(n, e.resolveName(n)));
  if (_x(n))
    return Jt(n, n.getAddress());
  if (n && typeof n.then == "function")
    return Jt(n, n);
  b(!1, "unsupported addressable value", "target", n);
}
function jt(n) {
  return G(n0(n));
}
function qt(n, e) {
  return {
    address: J(n),
    storageKeys: e.map((t, c) => (b(He(t, 32), "invalid slot", `storageKeys[${c}]`, t), t.toLowerCase()))
  };
}
function Wt(n) {
  if (Array.isArray(n))
    return n.map((t, c) => Array.isArray(t) ? (b(t.length === 2, "invalid slot set", `value[${c}]`, t), qt(t[0], t[1])) : (b(t != null && typeof t == "object", "invalid address-slot set", "value", n), qt(t.address, t.storageKeys)));
  b(n != null && typeof n == "object", "invalid access list", "value", n);
  const e = Object.keys(n).map((t) => {
    const c = n[t].reduce((r, a) => (r[a] = !0, r), {});
    return qt(t, Object.keys(c).sort());
  });
  return e.sort((t, c) => t.address.localeCompare(c.address)), e;
}
function bt(n) {
  let e;
  return typeof n == "string" ? e = we.computePublicKey(n, !1) : e = n.publicKey, J(G("0x" + e.substring(4)).substring(26));
}
function Mx(n, e) {
  return bt(we.recoverPublicKey(n, e));
}
const X = BigInt(0), Kx = BigInt(2), zx = BigInt(27), Vx = BigInt(28), jx = BigInt(35), Wx = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function Un(n) {
  return n === "0x" ? null : J(n);
}
function Sr(n, e) {
  try {
    return Wt(n);
  } catch (t) {
    b(!1, t.message, e, n);
  }
}
function Zt(n, e) {
  return n === "0x" ? 0 : Ae(n, e);
}
function Y(n, e) {
  if (n === "0x")
    return X;
  const t = H(n, e);
  return b(t <= Wx, "value exceeds uint size", e, t), t;
}
function j(n, e) {
  const t = H(n, "value"), c = ie(t);
  return b(c.length <= 32, "value too large", `tx.${e}`, t), c;
}
function Pr(n) {
  return Wt(n).map((e) => [e.address, e.storageKeys]);
}
function Zx(n) {
  const e = Pn(n);
  b(Array.isArray(e) && (e.length === 9 || e.length === 6), "invalid field count for legacy transaction", "data", n);
  const t = {
    type: 0,
    nonce: Zt(e[0], "nonce"),
    gasPrice: Y(e[1], "gasPrice"),
    gasLimit: Y(e[2], "gasLimit"),
    to: Un(e[3]),
    value: Y(e[4], "value"),
    data: m(e[5]),
    chainId: X
  };
  if (e.length === 6)
    return t;
  const c = Y(e[6], "v"), r = Y(e[7], "r"), a = Y(e[8], "s");
  if (r === X && a === X)
    t.chainId = c;
  else {
    let x = (c - jx) / Kx;
    x < X && (x = X), t.chainId = x, b(x !== X || c === zx || c === Vx, "non-canonical legacy v", "v", e[6]), t.signature = ke.from({
      r: L0(e[7], 32),
      s: L0(e[8], 32),
      v: c
    }), t.hash = G(n);
  }
  return t;
}
function yc(n, e) {
  const t = [
    j(n.nonce || 0, "nonce"),
    j(n.gasPrice || 0, "gasPrice"),
    j(n.gasLimit || 0, "gasLimit"),
    n.to != null ? J(n.to) : "0x",
    j(n.value || 0, "value"),
    n.data || "0x"
  ];
  let c = X;
  if (n.chainId != X)
    c = H(n.chainId, "tx.chainId"), b(!e || e.networkV == null || e.legacyChainId === c, "tx.chainId/sig.v mismatch", "sig", e);
  else if (n.signature) {
    const a = n.signature.legacyChainId;
    a != null && (c = a);
  }
  if (!e)
    return c !== X && (t.push(ie(c)), t.push("0x"), t.push("0x")), Rt(t);
  let r = BigInt(27 + e.yParity);
  return c !== X ? r = ke.getChainIdV(c, e.v) : BigInt(e.v) !== r && b(!1, "tx.chainId/sig.v mismatch", "sig", e), t.push(ie(r)), t.push(ie(e.r)), t.push(ie(e.s)), Rt(t);
}
function Nr(n, e) {
  let t;
  try {
    if (t = Zt(e[0], "yParity"), t !== 0 && t !== 1)
      throw new Error("bad yParity");
  } catch {
    b(!1, "invalid yParity", "yParity", e[0]);
  }
  const c = L0(e[1], 32), r = L0(e[2], 32), a = ke.from({ r: c, s: r, yParity: t });
  n.signature = a;
}
function Yx(n) {
  const e = Pn(g(n).slice(1));
  b(Array.isArray(e) && (e.length === 9 || e.length === 12), "invalid field count for transaction type: 2", "data", m(n));
  const t = Y(e[2], "maxPriorityFeePerGas"), c = Y(e[3], "maxFeePerGas"), r = {
    type: 2,
    chainId: Y(e[0], "chainId"),
    nonce: Zt(e[1], "nonce"),
    maxPriorityFeePerGas: t,
    maxFeePerGas: c,
    gasPrice: null,
    gasLimit: Y(e[4], "gasLimit"),
    to: Un(e[5]),
    value: Y(e[6], "value"),
    data: m(e[7]),
    accessList: Sr(e[8], "accessList")
  };
  return e.length === 9 || (r.hash = G(n), Nr(r, e.slice(9))), r;
}
function pc(n, e) {
  const t = [
    j(n.chainId || 0, "chainId"),
    j(n.nonce || 0, "nonce"),
    j(n.maxPriorityFeePerGas || 0, "maxPriorityFeePerGas"),
    j(n.maxFeePerGas || 0, "maxFeePerGas"),
    j(n.gasLimit || 0, "gasLimit"),
    n.to != null ? J(n.to) : "0x",
    j(n.value || 0, "value"),
    n.data || "0x",
    Pr(n.accessList || [])
  ];
  return e && (t.push(j(e.yParity, "yParity")), t.push(ie(e.r)), t.push(ie(e.s))), W(["0x02", Rt(t)]);
}
function Xx(n) {
  const e = Pn(g(n).slice(1));
  b(Array.isArray(e) && (e.length === 8 || e.length === 11), "invalid field count for transaction type: 1", "data", m(n));
  const t = {
    type: 1,
    chainId: Y(e[0], "chainId"),
    nonce: Zt(e[1], "nonce"),
    gasPrice: Y(e[2], "gasPrice"),
    gasLimit: Y(e[3], "gasLimit"),
    to: Un(e[4]),
    value: Y(e[5], "value"),
    data: m(e[6]),
    accessList: Sr(e[7], "accessList")
  };
  return e.length === 8 || (t.hash = G(n), Nr(t, e.slice(8))), t;
}
function gc(n, e) {
  const t = [
    j(n.chainId || 0, "chainId"),
    j(n.nonce || 0, "nonce"),
    j(n.gasPrice || 0, "gasPrice"),
    j(n.gasLimit || 0, "gasLimit"),
    n.to != null ? J(n.to) : "0x",
    j(n.value || 0, "value"),
    n.data || "0x",
    Pr(n.accessList || [])
  ];
  return e && (t.push(j(e.yParity, "recoveryParam")), t.push(ie(e.r)), t.push(ie(e.s))), W(["0x01", Rt(t)]);
}
var Pe, w0, A0, E0, I0, S0, P0, N0, T0, k0, v0, R0;
const Ce = class Ce {
  /**
   *  Creates a new Transaction with default values.
   */
  constructor() {
    R(this, Pe, void 0);
    R(this, w0, void 0);
    R(this, A0, void 0);
    R(this, E0, void 0);
    R(this, I0, void 0);
    R(this, S0, void 0);
    R(this, P0, void 0);
    R(this, N0, void 0);
    R(this, T0, void 0);
    R(this, k0, void 0);
    R(this, v0, void 0);
    R(this, R0, void 0);
    A(this, Pe, null), A(this, w0, null), A(this, E0, 0), A(this, I0, BigInt(0)), A(this, S0, null), A(this, P0, null), A(this, N0, null), A(this, A0, "0x"), A(this, T0, BigInt(0)), A(this, k0, BigInt(0)), A(this, v0, null), A(this, R0, null);
  }
  /**
   *  The transaction type.
   *
   *  If null, the type will be automatically inferred based on
   *  explicit properties.
   */
  get type() {
    return N(this, Pe);
  }
  set type(e) {
    switch (e) {
      case null:
        A(this, Pe, null);
        break;
      case 0:
      case "legacy":
        A(this, Pe, 0);
        break;
      case 1:
      case "berlin":
      case "eip-2930":
        A(this, Pe, 1);
        break;
      case 2:
      case "london":
      case "eip-1559":
        A(this, Pe, 2);
        break;
      default:
        b(!1, "unsupported transaction type", "type", e);
    }
  }
  /**
   *  The name of the transaction type.
   */
  get typeName() {
    switch (this.type) {
      case 0:
        return "legacy";
      case 1:
        return "eip-2930";
      case 2:
        return "eip-1559";
    }
    return null;
  }
  /**
   *  The ``to`` address for the transaction or ``null`` if the
   *  transaction is an ``init`` transaction.
   */
  get to() {
    return N(this, w0);
  }
  set to(e) {
    A(this, w0, e == null ? null : J(e));
  }
  /**
   *  The transaction nonce.
   */
  get nonce() {
    return N(this, E0);
  }
  set nonce(e) {
    A(this, E0, Ae(e, "value"));
  }
  /**
   *  The gas limit.
   */
  get gasLimit() {
    return N(this, I0);
  }
  set gasLimit(e) {
    A(this, I0, H(e));
  }
  /**
   *  The gas price.
   *
   *  On legacy networks this defines the fee that will be paid. On
   *  EIP-1559 networks, this should be ``null``.
   */
  get gasPrice() {
    const e = N(this, S0);
    return e == null && (this.type === 0 || this.type === 1) ? X : e;
  }
  set gasPrice(e) {
    A(this, S0, e == null ? null : H(e, "gasPrice"));
  }
  /**
   *  The maximum priority fee per unit of gas to pay. On legacy
   *  networks this should be ``null``.
   */
  get maxPriorityFeePerGas() {
    const e = N(this, P0);
    return e ?? (this.type === 2 ? X : null);
  }
  set maxPriorityFeePerGas(e) {
    A(this, P0, e == null ? null : H(e, "maxPriorityFeePerGas"));
  }
  /**
   *  The maximum total fee per unit of gas to pay. On legacy
   *  networks this should be ``null``.
   */
  get maxFeePerGas() {
    const e = N(this, N0);
    return e ?? (this.type === 2 ? X : null);
  }
  set maxFeePerGas(e) {
    A(this, N0, e == null ? null : H(e, "maxFeePerGas"));
  }
  /**
   *  The transaction data. For ``init`` transactions this is the
   *  deployment code.
   */
  get data() {
    return N(this, A0);
  }
  set data(e) {
    A(this, A0, m(e));
  }
  /**
   *  The amount of ether (in wei) to send in this transactions.
   */
  get value() {
    return N(this, T0);
  }
  set value(e) {
    A(this, T0, H(e, "value"));
  }
  /**
   *  The chain ID this transaction is valid on.
   */
  get chainId() {
    return N(this, k0);
  }
  set chainId(e) {
    A(this, k0, H(e));
  }
  /**
   *  If signed, the signature for this transaction.
   */
  get signature() {
    return N(this, v0) || null;
  }
  set signature(e) {
    A(this, v0, e == null ? null : ke.from(e));
  }
  /**
   *  The access list.
   *
   *  An access list permits discounted (but pre-paid) access to
   *  bytecode and state variable access within contract execution.
   */
  get accessList() {
    const e = N(this, R0) || null;
    return e ?? (this.type === 1 || this.type === 2 ? [] : null);
  }
  set accessList(e) {
    A(this, R0, e == null ? null : Wt(e));
  }
  /**
   *  The transaction hash, if signed. Otherwise, ``null``.
   */
  get hash() {
    return this.signature == null ? null : G(this.serialized);
  }
  /**
   *  The pre-image hash of this transaction.
   *
   *  This is the digest that a [[Signer]] must sign to authorize
   *  this transaction.
   */
  get unsignedHash() {
    return G(this.unsignedSerialized);
  }
  /**
   *  The sending address, if signed. Otherwise, ``null``.
   */
  get from() {
    return this.signature == null ? null : Mx(this.unsignedHash, this.signature);
  }
  /**
   *  The public key of the sender, if signed. Otherwise, ``null``.
   */
  get fromPublicKey() {
    return this.signature == null ? null : we.recoverPublicKey(this.unsignedHash, this.signature);
  }
  /**
   *  Returns true if signed.
   *
   *  This provides a Type Guard that properties requiring a signed
   *  transaction are non-null.
   */
  isSigned() {
    return this.signature != null;
  }
  /**
   *  The serialized transaction.
   *
   *  This throws if the transaction is unsigned. For the pre-image,
   *  use [[unsignedSerialized]].
   */
  get serialized() {
    switch (T(this.signature != null, "cannot serialize unsigned transaction; maybe you meant .unsignedSerialized", "UNSUPPORTED_OPERATION", { operation: ".serialized" }), this.inferType()) {
      case 0:
        return yc(this, this.signature);
      case 1:
        return gc(this, this.signature);
      case 2:
        return pc(this, this.signature);
    }
    T(!1, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: ".serialized" });
  }
  /**
   *  The transaction pre-image.
   *
   *  The hash of this is the digest which needs to be signed to
   *  authorize this transaction.
   */
  get unsignedSerialized() {
    switch (this.inferType()) {
      case 0:
        return yc(this);
      case 1:
        return gc(this);
      case 2:
        return pc(this);
    }
    T(!1, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: ".unsignedSerialized" });
  }
  /**
   *  Return the most "likely" type; currently the highest
   *  supported transaction type.
   */
  inferType() {
    return this.inferTypes().pop();
  }
  /**
   *  Validates the explicit properties and returns a list of compatible
   *  transaction types.
   */
  inferTypes() {
    const e = this.gasPrice != null, t = this.maxFeePerGas != null || this.maxPriorityFeePerGas != null, c = this.accessList != null;
    this.maxFeePerGas != null && this.maxPriorityFeePerGas != null && T(this.maxFeePerGas >= this.maxPriorityFeePerGas, "priorityFee cannot be more than maxFee", "BAD_DATA", { value: this }), T(!t || this.type !== 0 && this.type !== 1, "transaction type cannot have maxFeePerGas or maxPriorityFeePerGas", "BAD_DATA", { value: this }), T(this.type !== 0 || !c, "legacy transaction cannot have accessList", "BAD_DATA", { value: this });
    const r = [];
    return this.type != null ? r.push(this.type) : t ? r.push(2) : e ? (r.push(1), c || r.push(0)) : c ? (r.push(1), r.push(2)) : (r.push(0), r.push(1), r.push(2)), r.sort(), r;
  }
  /**
   *  Returns true if this transaction is a legacy transaction (i.e.
   *  ``type === 0``).
   *
   *  This provides a Type Guard that the related properties are
   *  non-null.
   */
  isLegacy() {
    return this.type === 0;
  }
  /**
   *  Returns true if this transaction is berlin hardform transaction (i.e.
   *  ``type === 1``).
   *
   *  This provides a Type Guard that the related properties are
   *  non-null.
   */
  isBerlin() {
    return this.type === 1;
  }
  /**
   *  Returns true if this transaction is london hardform transaction (i.e.
   *  ``type === 2``).
   *
   *  This provides a Type Guard that the related properties are
   *  non-null.
   */
  isLondon() {
    return this.type === 2;
  }
  /**
   *  Create a copy of this transaciton.
   */
  clone() {
    return Ce.from(this);
  }
  /**
   *  Return a JSON-friendly object.
   */
  toJSON() {
    const e = (t) => t == null ? null : t.toString();
    return {
      type: this.type,
      to: this.to,
      //            from: this.from,
      data: this.data,
      nonce: this.nonce,
      gasLimit: e(this.gasLimit),
      gasPrice: e(this.gasPrice),
      maxPriorityFeePerGas: e(this.maxPriorityFeePerGas),
      maxFeePerGas: e(this.maxFeePerGas),
      value: e(this.value),
      chainId: e(this.chainId),
      sig: this.signature ? this.signature.toJSON() : null,
      accessList: this.accessList
    };
  }
  /**
   *  Create a **Transaction** from a serialized transaction or a
   *  Transaction-like object.
   */
  static from(e) {
    if (e == null)
      return new Ce();
    if (typeof e == "string") {
      const c = g(e);
      if (c[0] >= 127)
        return Ce.from(Zx(c));
      switch (c[0]) {
        case 1:
          return Ce.from(Xx(c));
        case 2:
          return Ce.from(Yx(c));
      }
      T(!1, "unsupported transaction type", "UNSUPPORTED_OPERATION", { operation: "from" });
    }
    const t = new Ce();
    return e.type != null && (t.type = e.type), e.to != null && (t.to = e.to), e.nonce != null && (t.nonce = e.nonce), e.gasLimit != null && (t.gasLimit = e.gasLimit), e.gasPrice != null && (t.gasPrice = e.gasPrice), e.maxPriorityFeePerGas != null && (t.maxPriorityFeePerGas = e.maxPriorityFeePerGas), e.maxFeePerGas != null && (t.maxFeePerGas = e.maxFeePerGas), e.data != null && (t.data = e.data), e.value != null && (t.value = e.value), e.chainId != null && (t.chainId = e.chainId), e.signature != null && (t.signature = ke.from(e.signature)), e.accessList != null && (t.accessList = e.accessList), e.hash != null && (b(t.isSigned(), "unsigned transaction cannot define hash", "tx", e), b(t.hash === e.hash, "hash mismatch", "tx", e)), e.from != null && (b(t.isSigned(), "unsigned transaction cannot define from", "tx", e), b(t.from.toLowerCase() === (e.from || "").toLowerCase(), "from mismatch", "tx", e)), t;
  }
};
Pe = new WeakMap(), w0 = new WeakMap(), A0 = new WeakMap(), E0 = new WeakMap(), I0 = new WeakMap(), S0 = new WeakMap(), P0 = new WeakMap(), N0 = new WeakMap(), T0 = new WeakMap(), k0 = new WeakMap(), v0 = new WeakMap(), R0 = new WeakMap();
let Ft = Ce;
function Jx(n) {
  return typeof n == "string" && (n = n0(n)), G(W([
    n0(Lx),
    n0(String(n.length)),
    n
  ]));
}
const Tr = new Uint8Array(32);
Tr.fill(0);
const qx = BigInt(-1), kr = BigInt(0), vr = BigInt(1), Qx = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
function es(n) {
  const e = g(n), t = e.length % 32;
  return t ? W([e, Tr.slice(t)]) : m(e);
}
const ts = F0(vr, 32), ns = F0(kr, 32), mc = {
  name: "string",
  version: "string",
  chainId: "uint256",
  verifyingContract: "address",
  salt: "bytes32"
}, Qt = [
  "name",
  "version",
  "chainId",
  "verifyingContract",
  "salt"
];
function wc(n) {
  return function(e) {
    return b(typeof e == "string", `invalid domain value for ${JSON.stringify(n)}`, `domain.${n}`, e), e;
  };
}
const cs = {
  name: wc("name"),
  version: wc("version"),
  chainId: function(n) {
    const e = H(n, "domain.chainId");
    return b(e >= 0, "invalid chain ID", "domain.chainId", n), Number.isSafeInteger(e) ? Number(e) : Jr(e);
  },
  verifyingContract: function(n) {
    try {
      return J(n).toLowerCase();
    } catch {
    }
    b(!1, 'invalid domain value "verifyingContract"', "domain.verifyingContract", n);
  },
  salt: function(n) {
    const e = g(n, "domain.salt");
    return b(e.length === 32, 'invalid domain value "salt"', "domain.salt", n), m(e);
  }
};
function en(n) {
  {
    const e = n.match(/^(u?)int(\d*)$/);
    if (e) {
      const t = e[1] === "", c = parseInt(e[2] || "256");
      b(c % 8 === 0 && c !== 0 && c <= 256 && (e[2] == null || e[2] === String(c)), "invalid numeric width", "type", n);
      const r = Xr(Qx, t ? c - 1 : c), a = t ? (r + vr) * qx : kr;
      return function(x) {
        const s = H(x, "value");
        return b(s >= a && s <= r, `value out-of-bounds for ${n}`, "value", s), F0(t ? Yr(s, 256) : s, 32);
      };
    }
  }
  {
    const e = n.match(/^bytes(\d+)$/);
    if (e) {
      const t = parseInt(e[1]);
      return b(t !== 0 && t <= 32 && e[1] === String(t), "invalid bytes width", "type", n), function(c) {
        const r = g(c);
        return b(r.length === t, `invalid length for ${n}`, "value", c), es(c);
      };
    }
  }
  switch (n) {
    case "address":
      return function(e) {
        return L0(J(e), 32);
      };
    case "bool":
      return function(e) {
        return e ? ts : ns;
      };
    case "bytes":
      return function(e) {
        return G(e);
      };
    case "string":
      return function(e) {
        return jt(e);
      };
  }
  return null;
}
function Ac(n, e) {
  return `${n}(${e.map(({ name: t, type: c }) => c + " " + t).join(",")})`;
}
var at, Ne, O0, Kt, Rr;
const se = class se {
  /**
   *  Create a new **TypedDataEncoder** for %%types%%.
   *
   *  This performs all necessary checking that types are valid and
   *  do not violate the [[link-eip-712]] structural constraints as
   *  well as computes the [[primaryType]].
   */
  constructor(e) {
    R(this, Kt);
    /**
     *  The primary type for the structured [[types]].
     *
     *  This is derived automatically from the [[types]], since no
     *  recursion is possible, once the DAG for the types is consturcted
     *  internally, the primary type must be the only remaining type with
     *  no parent nodes.
     */
    B(this, "primaryType");
    R(this, at, void 0);
    R(this, Ne, void 0);
    R(this, O0, void 0);
    A(this, at, JSON.stringify(e)), A(this, Ne, /* @__PURE__ */ new Map()), A(this, O0, /* @__PURE__ */ new Map());
    const t = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map();
    Object.keys(e).forEach((s) => {
      t.set(s, /* @__PURE__ */ new Set()), c.set(s, []), r.set(s, /* @__PURE__ */ new Set());
    });
    for (const s in e) {
      const i = /* @__PURE__ */ new Set();
      for (const f of e[s]) {
        b(!i.has(f.name), `duplicate variable name ${JSON.stringify(f.name)} in ${JSON.stringify(s)}`, "types", e), i.add(f.name);
        const o = f.type.match(/^([^\x5b]*)(\x5b|$)/)[1] || null;
        b(o !== s, `circular type reference to ${JSON.stringify(o)}`, "types", e), !en(o) && (b(c.has(o), `unknown type ${JSON.stringify(o)}`, "types", e), c.get(o).push(s), t.get(s).add(o));
      }
    }
    const a = Array.from(c.keys()).filter((s) => c.get(s).length === 0);
    b(a.length !== 0, "missing primary type", "types", e), b(a.length === 1, `ambiguous primary types or unused types: ${a.map((s) => JSON.stringify(s)).join(", ")}`, "types", e), fe(this, { primaryType: a[0] });
    function x(s, i) {
      b(!i.has(s), `circular type reference to ${JSON.stringify(s)}`, "types", e), i.add(s);
      for (const f of t.get(s))
        if (c.has(f)) {
          x(f, i);
          for (const o of i)
            r.get(o).add(f);
        }
      i.delete(s);
    }
    x(this.primaryType, /* @__PURE__ */ new Set());
    for (const [s, i] of r) {
      const f = Array.from(i);
      f.sort(), N(this, Ne).set(s, Ac(s, e[s]) + f.map((o) => Ac(o, e[o])).join(""));
    }
  }
  /**
   *  The types.
   */
  get types() {
    return JSON.parse(N(this, at));
  }
  /**
   *  Returnthe encoder for the specific %%type%%.
   */
  getEncoder(e) {
    let t = N(this, O0).get(e);
    return t || (t = Z(this, Kt, Rr).call(this, e), N(this, O0).set(e, t)), t;
  }
  /**
   *  Return the full type for %%name%%.
   */
  encodeType(e) {
    const t = N(this, Ne).get(e);
    return b(t, `unknown type: ${JSON.stringify(e)}`, "name", e), t;
  }
  /**
   *  Return the encoded %%value%% for the %%type%%.
   */
  encodeData(e, t) {
    return this.getEncoder(e)(t);
  }
  /**
   *  Returns the hash of %%value%% for the type of %%name%%.
   */
  hashStruct(e, t) {
    return G(this.encodeData(e, t));
  }
  /**
   *  Return the fulled encoded %%value%% for the [[types]].
   */
  encode(e) {
    return this.encodeData(this.primaryType, e);
  }
  /**
   *  Return the hash of the fully encoded %%value%% for the [[types]].
   */
  hash(e) {
    return this.hashStruct(this.primaryType, e);
  }
  /**
   *  @_ignore:
   */
  _visit(e, t, c) {
    if (en(e))
      return c(e, t);
    const r = e.match(/^(.*)(\x5b(\d*)\x5d)$/);
    if (r)
      return b(!r[3] || parseInt(r[3]) === t.length, `array length mismatch; expected length ${parseInt(r[3])}`, "value", t), t.map((x) => this._visit(r[1], x, c));
    const a = this.types[e];
    if (a)
      return a.reduce((x, { name: s, type: i }) => (x[s] = this._visit(i, t[s], c), x), {});
    b(!1, `unknown type: ${e}`, "type", e);
  }
  /**
   *  Call %%calback%% for each value in %%value%%, passing the type and
   *  component within %%value%%.
   *
   *  This is useful for replacing addresses or other transformation that
   *  may be desired on each component, based on its type.
   */
  visit(e, t) {
    return this._visit(this.primaryType, e, t);
  }
  /**
   *  Create a new **TypedDataEncoder** for %%types%%.
   */
  static from(e) {
    return new se(e);
  }
  /**
   *  Return the primary type for %%types%%.
   */
  static getPrimaryType(e) {
    return se.from(e).primaryType;
  }
  /**
   *  Return the hashed struct for %%value%% using %%types%% and %%name%%.
   */
  static hashStruct(e, t, c) {
    return se.from(t).hashStruct(e, c);
  }
  /**
   *  Return the domain hash for %%domain%%.
   */
  static hashDomain(e) {
    const t = [];
    for (const c in e) {
      if (e[c] == null)
        continue;
      const r = mc[c];
      b(r, `invalid typed-data domain key: ${JSON.stringify(c)}`, "domain", e), t.push({ name: c, type: r });
    }
    return t.sort((c, r) => Qt.indexOf(c.name) - Qt.indexOf(r.name)), se.hashStruct("EIP712Domain", { EIP712Domain: t }, e);
  }
  /**
   *  Return the fully encoded [[link-eip-712]] %%value%% for %%types%% with %%domain%%.
   */
  static encode(e, t, c) {
    return W([
      "0x1901",
      se.hashDomain(e),
      se.from(t).hash(c)
    ]);
  }
  /**
   *  Return the hash of the fully encoded [[link-eip-712]] %%value%% for %%types%% with %%domain%%.
   */
  static hash(e, t, c) {
    return G(se.encode(e, t, c));
  }
  // Replaces all address types with ENS names with their looked up address
  /**
   * Resolves to the value from resolving all addresses in %%value%% for
   * %%types%% and the %%domain%%.
   */
  static async resolveNames(e, t, c, r) {
    e = Object.assign({}, e);
    for (const s in e)
      e[s] == null && delete e[s];
    const a = {};
    e.verifyingContract && !He(e.verifyingContract, 20) && (a[e.verifyingContract] = "0x");
    const x = se.from(t);
    x.visit(c, (s, i) => (s === "address" && !He(i, 20) && (a[i] = "0x"), i));
    for (const s in a)
      a[s] = await r(s);
    return e.verifyingContract && a[e.verifyingContract] && (e.verifyingContract = a[e.verifyingContract]), c = x.visit(c, (s, i) => s === "address" && a[i] ? a[i] : i), { domain: e, value: c };
  }
  /**
   *  Returns the JSON-encoded payload expected by nodes which implement
   *  the JSON-RPC [[link-eip-712]] method.
   */
  static getPayload(e, t, c) {
    se.hashDomain(e);
    const r = {}, a = [];
    Qt.forEach((i) => {
      const f = e[i];
      f != null && (r[i] = cs[i](f), a.push({ name: i, type: mc[i] }));
    });
    const x = se.from(t), s = Object.assign({}, t);
    return b(s.EIP712Domain == null, "types must not contain EIP712Domain type", "types.EIP712Domain", t), s.EIP712Domain = a, x.encode(c), {
      types: s,
      domain: r,
      primaryType: x.primaryType,
      message: x.visit(c, (i, f) => {
        if (i.match(/^bytes(\d*)/))
          return m(g(f));
        if (i.match(/^u?int/))
          return H(f).toString();
        switch (i) {
          case "address":
            return f.toLowerCase();
          case "bool":
            return !!f;
          case "string":
            return b(typeof f == "string", "invalid string", "value", f), f;
        }
        b(!1, "unsupported type", "type", i);
      })
    };
  }
};
at = new WeakMap(), Ne = new WeakMap(), O0 = new WeakMap(), Kt = new WeakSet(), Rr = function(e) {
  {
    const r = en(e);
    if (r)
      return r;
  }
  const t = e.match(/^(.*)(\x5b(\d*)\x5d)$/);
  if (t) {
    const r = t[1], a = this.getEncoder(r);
    return (x) => {
      b(!t[3] || parseInt(t[3]) === x.length, `array length mismatch; expected length ${parseInt(t[3])}`, "value", x);
      let s = x.map(a);
      return N(this, Ne).has(r) && (s = s.map(G)), G(W(s));
    };
  }
  const c = this.types[e];
  if (c) {
    const r = jt(N(this, Ne).get(e));
    return (a) => {
      const x = c.map(({ name: s, type: i }) => {
        const f = this.getEncoder(i)(a[s]);
        return N(this, Ne).has(i) ? G(f) : f;
      });
      return x.unshift(r), W(x);
    };
  }
  b(!1, `unknown type: ${e}`, "type", e);
};
let Dt = se;
BigInt(0);
function rs(n) {
  const e = {};
  n.to && (e.to = n.to), n.from && (e.from = n.from), n.data && (e.data = m(n.data));
  const t = "chainId,gasLimit,gasPrice,maxFeePerGas,maxPriorityFeePerGas,value".split(/,/);
  for (const r of t)
    !(r in n) || n[r] == null || (e[r] = H(n[r], `request.${r}`));
  const c = "type,nonce".split(/,/);
  for (const r of c)
    !(r in n) || n[r] == null || (e[r] = Ae(n[r], `request.${r}`));
  return n.accessList && (e.accessList = Wt(n.accessList)), "blockTag" in n && (e.blockTag = n.blockTag), "enableCcipRead" in n && (e.enableCcipRead = !!n.enableCcipRead), "customData" in n && (e.customData = n.customData), e;
}
function i0(n, e) {
  if (n.provider)
    return n.provider;
  T(!1, "missing provider", "UNSUPPORTED_OPERATION", { operation: e });
}
async function Ec(n, e) {
  let t = rs(e);
  if (t.to != null && (t.to = Lt(t.to, n)), t.from != null) {
    const c = t.from;
    t.from = Promise.all([
      n.getAddress(),
      Lt(c, n)
    ]).then(([r, a]) => (b(r.toLowerCase() === a.toLowerCase(), "transaction from mismatch", "tx.from", a), r));
  } else
    t.from = n.getAddress();
  return await An(t);
}
class Or {
  /**
   *  Creates a new Signer connected to %%provider%%.
   */
  constructor(e) {
    /**
     *  The provider this signer is connected to.
     */
    B(this, "provider");
    fe(this, { provider: e || null });
  }
  async getNonce(e) {
    return i0(this, "getTransactionCount").getTransactionCount(await this.getAddress(), e);
  }
  async populateCall(e) {
    return await Ec(this, e);
  }
  async populateTransaction(e) {
    const t = i0(this, "populateTransaction"), c = await Ec(this, e);
    c.nonce == null && (c.nonce = await this.getNonce("pending")), c.gasLimit == null && (c.gasLimit = await this.estimateGas(c));
    const r = await this.provider.getNetwork();
    if (c.chainId != null) {
      const x = H(c.chainId);
      b(x === r.chainId, "transaction chainId mismatch", "tx.chainId", e.chainId);
    } else
      c.chainId = r.chainId;
    const a = c.maxFeePerGas != null || c.maxPriorityFeePerGas != null;
    if (c.gasPrice != null && (c.type === 2 || a) ? b(!1, "eip-1559 transaction do not support gasPrice", "tx", e) : (c.type === 0 || c.type === 1) && a && b(!1, "pre-eip-1559 transaction do not support maxFeePerGas/maxPriorityFeePerGas", "tx", e), (c.type === 2 || c.type == null) && c.maxFeePerGas != null && c.maxPriorityFeePerGas != null)
      c.type = 2;
    else if (c.type === 0 || c.type === 1) {
      const x = await t.getFeeData();
      T(x.gasPrice != null, "network does not support gasPrice", "UNSUPPORTED_OPERATION", {
        operation: "getGasPrice"
      }), c.gasPrice == null && (c.gasPrice = x.gasPrice);
    } else {
      const x = await t.getFeeData();
      if (c.type == null)
        if (x.maxFeePerGas != null && x.maxPriorityFeePerGas != null)
          if (c.type = 2, c.gasPrice != null) {
            const s = c.gasPrice;
            delete c.gasPrice, c.maxFeePerGas = s, c.maxPriorityFeePerGas = s;
          } else
            c.maxFeePerGas == null && (c.maxFeePerGas = x.maxFeePerGas), c.maxPriorityFeePerGas == null && (c.maxPriorityFeePerGas = x.maxPriorityFeePerGas);
        else
          x.gasPrice != null ? (T(!a, "network does not support EIP-1559", "UNSUPPORTED_OPERATION", {
            operation: "populateTransaction"
          }), c.gasPrice == null && (c.gasPrice = x.gasPrice), c.type = 0) : T(!1, "failed to get consistent fee data", "UNSUPPORTED_OPERATION", {
            operation: "signer.getFeeData"
          });
      else
        c.type === 2 && (c.maxFeePerGas == null && (c.maxFeePerGas = x.maxFeePerGas), c.maxPriorityFeePerGas == null && (c.maxPriorityFeePerGas = x.maxPriorityFeePerGas));
    }
    return await An(c);
  }
  async estimateGas(e) {
    return i0(this, "estimateGas").estimateGas(await this.populateCall(e));
  }
  async call(e) {
    return i0(this, "call").call(await this.populateCall(e));
  }
  async resolveName(e) {
    return await i0(this, "resolveName").resolveName(e);
  }
  async sendTransaction(e) {
    const t = i0(this, "sendTransaction"), c = await this.populateTransaction(e);
    delete c.from;
    const r = Ft.from(c);
    return await t.broadcastTransaction(await this.signTransaction(r));
  }
}
var B0, kt;
const Dn = class Dn extends Or {
  /**
   *  Creates a new **VoidSigner** with %%address%% attached to
   *  %%provider%%.
   */
  constructor(t, c) {
    super(c);
    R(this, B0);
    /**
     *  The signer address.
     */
    B(this, "address");
    fe(this, { address: t });
  }
  async getAddress() {
    return this.address;
  }
  connect(t) {
    return new Dn(this.address, t);
  }
  async signTransaction(t) {
    Z(this, B0, kt).call(this, "transactions", "signTransaction");
  }
  async signMessage(t) {
    Z(this, B0, kt).call(this, "messages", "signMessage");
  }
  async signTypedData(t, c, r) {
    Z(this, B0, kt).call(this, "typed-data", "signTypedData");
  }
};
B0 = new WeakSet(), kt = function(t, c) {
  T(!1, `VoidSigner cannot sign ${t}`, "UNSUPPORTED_OPERATION", { operation: c });
};
let hn = Dn;
var C0;
const $n = class $n extends Or {
  /**
   *  Creates a new BaseWallet for %%privateKey%%, optionally
   *  connected to %%provider%%.
   *
   *  If %%provider%% is not specified, only offline methods can
   *  be used.
   */
  constructor(t, c) {
    super(c);
    /**
     *  The wallet address.
     */
    B(this, "address");
    R(this, C0, void 0);
    b(t && typeof t.sign == "function", "invalid private key", "privateKey", "[ REDACTED ]"), A(this, C0, t);
    const r = bt(this.signingKey.publicKey);
    fe(this, { address: r });
  }
  // Store private values behind getters to reduce visibility
  // in console.log
  /**
   *  The [[SigningKey]] used for signing payloads.
   */
  get signingKey() {
    return N(this, C0);
  }
  /**
   *  The private key for this wallet.
   */
  get privateKey() {
    return this.signingKey.privateKey;
  }
  async getAddress() {
    return this.address;
  }
  connect(t) {
    return new $n(N(this, C0), t);
  }
  async signTransaction(t) {
    const { to: c, from: r } = await An({
      to: t.to ? Lt(t.to, this.provider) : void 0,
      from: t.from ? Lt(t.from, this.provider) : void 0
    });
    c != null && (t.to = c), r != null && (t.from = r), t.from != null && (b(J(t.from) === this.address, "transaction from address mismatch", "tx.from", t.from), delete t.from);
    const a = Ft.from(t);
    return a.signature = this.signingKey.sign(a.unsignedHash), a.serialized;
  }
  async signMessage(t) {
    return this.signMessageSync(t);
  }
  // @TODO: Add a secialized signTx and signTyped sync that enforces
  // all parameters are known?
  /**
   *  Returns the signature for %%message%% signed with this wallet.
   */
  signMessageSync(t) {
    return this.signingKey.sign(Jx(t)).serialized;
  }
  async signTypedData(t, c, r) {
    const a = await Dt.resolveNames(t, c, r, async (x) => {
      T(this.provider != null, "cannot resolve ENS names without a provider", "UNSUPPORTED_OPERATION", {
        operation: "resolveName",
        info: { name: x }
      });
      const s = await this.provider.resolveName(x);
      return T(s != null, "unconfigured ENS name", "UNCONFIGURED_NAME", {
        value: x
      }), s;
    });
    return this.signingKey.sign(Dt.hash(a.domain, c, a.value)).serialized;
  }
};
C0 = new WeakMap();
let $t = $n;
const Ht = " !#$%&'()*+,-./<=>?@[]^_`{|}~", as = /^[a-z]*$/i;
function Ic(n, e) {
  let t = 97;
  return n.reduce((c, r) => (r === e ? t++ : r.match(as) ? c.push(String.fromCharCode(t) + r) : (t = 97, c.push(r)), c), []);
}
function xs(n, e) {
  for (let r = Ht.length - 1; r >= 0; r--)
    n = n.split(Ht[r]).join(e.substring(2 * r, 2 * r + 2));
  const t = [], c = n.replace(/(:|([0-9])|([A-Z][a-z]*))/g, (r, a, x, s) => {
    if (x)
      for (let i = parseInt(x); i >= 0; i--)
        t.push(";");
    else
      t.push(a.toLowerCase());
    return "";
  });
  if (c)
    throw new Error(`leftovers: ${JSON.stringify(c)}`);
  return Ic(Ic(t, ";"), ":");
}
function ss(n) {
  return b(n[0] === "0", "unsupported auwl data", "data", n), xs(n.substring(1 + 2 * Ht.length), n.substring(1, 1 + 2 * Ht.length));
}
class is {
  /**
   *  Creates a new Wordlist instance.
   *
   *  Sub-classes MUST call this if they provide their own constructor,
   *  passing in the locale string of the language.
   *
   *  Generally there is no need to create instances of a Wordlist,
   *  since each language-specific Wordlist creates an instance and
   *  there is no state kept internally, so they are safe to share.
   */
  constructor(e) {
    B(this, "locale");
    fe(this, { locale: e });
  }
  /**
   *  Sub-classes may override this to provide a language-specific
   *  method for spliting %%phrase%% into individual words.
   *
   *  By default, %%phrase%% is split using any sequences of
   *  white-space as defined by regular expressions (i.e. ``/\s+/``).
   */
  split(e) {
    return e.toLowerCase().split(/\s+/g);
  }
  /**
   *  Sub-classes may override this to provider a language-specific
   *  method for joining %%words%% into a phrase.
   *
   *  By default, %%words%% are joined by a single space.
   */
  join(e) {
    return e.join(" ");
  }
}
var U0, xt, e0, st, yn;
class fs extends is {
  /**
   *  Creates a new Wordlist for %%locale%% using the OWL %%data%%
   *  and validated against the %%checksum%%.
   */
  constructor(t, c, r) {
    super(t);
    R(this, st);
    R(this, U0, void 0);
    R(this, xt, void 0);
    R(this, e0, void 0);
    A(this, U0, c), A(this, xt, r), A(this, e0, null);
  }
  /**
   *  The OWL-encoded data.
   */
  get _data() {
    return N(this, U0);
  }
  /**
   *  Decode all the words for the wordlist.
   */
  _decodeWords() {
    return ss(N(this, U0));
  }
  getWord(t) {
    const c = Z(this, st, yn).call(this);
    return b(t >= 0 && t < c.length, `invalid word index: ${t}`, "index", t), c[t];
  }
  getWordIndex(t) {
    return Z(this, st, yn).call(this).indexOf(t);
  }
}
U0 = new WeakMap(), xt = new WeakMap(), e0 = new WeakMap(), st = new WeakSet(), yn = function() {
  if (N(this, e0) == null) {
    const t = this._decodeWords();
    if (jt(t.join(`
`) + `
`) !== N(this, xt))
      throw new Error(`BIP39 Wordlist for ${this.locale} FAILED`);
    A(this, e0, t);
  }
  return N(this, e0);
};
const os = "0erleonalorenseinceregesticitStanvetearctssi#ch2Athck&tneLl0And#Il.yLeOutO=S|S%b/ra@SurdU'0Ce[Cid|CountCu'Hie=IdOu,-Qui*Ro[TT]T%T*[Tu$0AptDD-tD*[Ju,M.UltV<)Vi)0Rob-0FairF%dRaid0A(EEntRee0Ead0MRRp%tS!_rmBumCoholErtI&LLeyLowMo,O}PhaReadySoT Ways0A>urAz(gOngOuntU'd0Aly,Ch%Ci|G G!GryIm$K!Noun)Nu$O` Sw T&naTiqueXietyY1ArtOlogyPe?P!Pro=Ril1ChCt-EaEnaGueMMedM%MyOundR<+Re,Ri=RowTTefa@Ti,Tw%k0KPe@SaultSetSi,SumeThma0H!>OmTa{T&dT.udeTra@0Ct]D.Gu,NtTh%ToTumn0Era+OcadoOid0AkeA*AyEsomeFulKw?d0Is:ByChel%C#D+GL<)Lc#y~MbooN<aNn RRelyRga(R*lSeS-SketTt!3A^AnAutyCau'ComeEfF%eG(Ha=H(dLie=LowLtN^Nef./TrayTt Twe&Y#d3Cyc!DKeNdOlogyRdR`Tt _{AdeAmeAnketA,EakE[IndOodO[omOu'UeUrUsh_rdAtDyIlMbNeNusOkO,Rd R(gRrowSsTtomUn)XY_{etA(AndA[A=EadEezeI{Id+IefIghtIngIskOccoliOk&OnzeOomO` OwnUsh2Bb!DdyD+tFf$oIldLbLkL!tNd!Nk Rd&Rg R,SS(e[SyTt Y Zz:Bba+B(B!CtusGeKe~LmM aMpNN$N)lNdyNn#NoeNvasNy#Pab!P.$Pta(RRb#RdRgoRpetRryRtSeShS(o/!Su$TT$ogT^Teg%yTt!UghtU'Ut]Ve3Il(gL yM|NsusNturyRe$Rta(_irAlkAmp]An+AosApt Ar+A'AtEapE{Ee'EfErryE,I{&IefIldIm}yOi)Oo'R#-U{!UnkUrn0G?Nnam#Rc!Tiz&TyVil_imApArifyAwAyE<ErkEv I{I|IffImbIn-IpO{OgO'O`OudOwnUbUmpU, Ut^_^A,C#utDeFfeeIlInL!@L%LumnMb(eMeMf%tM-Mm#Mp<yNc tNdu@NfirmNg*[N}@Nsid NtrolNv()OkOlPp PyR$ReRnR*@/Tt#U^UntryUp!Ur'Us(V Yo>_{Ad!AftAmA}AshAt AwlAzyEamEd.EekEwI{etImeIspIt-OpO[Ou^OwdUci$UelUi'Umb!Un^UshYY,$2BeLtu*PPbo?dRiousRr|Rta(R=Sh]/omTe3C!:DMa+MpN)Ng R(gShUght WnY3AlBa>BrisCadeCemb CideCl(eC%a>C*a'ErF&'F(eFyG*eLayLiv M<dMi'Ni$Nti,NyP?tP&dPos.P`PutyRi=ScribeS tSignSkSpair/royTailTe@VelopVi)Vo>3AgramAlAm#dAryCeE'lEtFf G.$Gn.yLemmaNn NosaurRe@RtSag*eScov Sea'ShSmi[S%d Splay/<)V tVideV%)Zzy5Ct%Cum|G~Lph(Ma(Na>NkeyN%OrSeUb!Ve_ftAg#AmaA,-AwEamE[IftIllInkIpI=OpUmY2CkMbNeR(g/T^Ty1Arf1Nam-:G G!RlyRnR`Sily/Sy1HoOlogyOnomy0GeItUca>1F%t0G1GhtTh 2BowD E@r-Eg<tEm|Eph<tEvat%I>Se0B?kBodyBra)Er+Ot]PloyPow Pty0Ab!A@DD![D%'EmyErgyF%)Ga+G(eH<)JoyLi,OughR-hRollSu*T Ti*TryVelope1Isode0U$Uip0AA'OdeOs]R%Upt0CapeSayS&)Ta>0Ern$H-s1Id&)IlOkeOl=1A@Amp!Ce[Ch<+C.eCludeCu'Ecu>Erci'Hau,Hib.I!I,ItOt-P<dPe@Pi*Pla(Po'P*[T&dTra0EEbrow:Br-CeCultyDeIntI`~L'MeMilyMousNNcyNtasyRmSh]TT$Th TigueUltV%.e3Atu*Bru?yD $EEdElMa!N)/iv$T^V W3B Ct]EldGu*LeLmLt N$NdNeNg NishReRmR,Sc$ShTT}[X_gAmeAshAtAv%EeIghtIpOatO{O%Ow UidUshY_mCusGIlLd~owOdOtR)Re,R+tRkRtu}RumRw?dSsil/ UndX_gi!AmeEqu|EshI&dIn+OgOntO,OwnOz&U.2ElNNnyRna)RyTu*:D+tInLaxy~ yMePRa+Rba+Rd&Rl-Rm|SSpTeTh U+Ze3N $NiusN*Nt!Nu(e/u*2O,0AntFtGg!Ng RaffeRlVe_dAn)A*A[IdeImp'ObeOomOryO=OwUe_tDde[LdOdO'RillaSpelSsipV nWn_bA)A(AntApeA[Av.yEatE&IdIefItOc yOupOwUnt_rdE[IdeIltIt?N3M:B.IrLfMm M, NdPpyRb%RdRshR=,TVeWkZ?d3AdAl`ArtAvyD+hogIght~oLmetLpNRo3Dd&Gh~NtPRe/%y5BbyCkeyLdLeLiday~owMeNeyOdPeRnRr%R'Sp.$/TelUrV 5BGeM<Mb!M%Nd*dNgryNtRd!RryRtSb<d3Brid:1EOn0EaEntifyLe2N%e4LLeg$L}[0A+Ita>M&'Mu}Pa@Po'Pro=Pul'0ChCludeComeC*a'DexD-a>Do%Du,ryF<tFl-tF%mHa!H .Iti$Je@JuryMa>N Noc|PutQuiryS<eSe@SideSpi*/$lTa@T e,ToVe,V.eVol=3On0L<dOla>Sue0Em1Ory:CketGu?RZz3AlousAns~yWel9BInKeUr}yY5D+I)MpNg!Ni%Nk/:Ng?oo3EnEpT^upY3CkDD}yNdNgdomSsTT^&TeTt&Wi4EeIfeO{Ow:BBelB%Dd DyKeMpNgua+PtopR+T T(UghUndryVaWWnWsu.Y Zy3Ad AfArnA=Ctu*FtGG$G&dIsu*M#NdNg`NsOp?dSs#Tt Vel3ArB tyBr?yC&'FeFtGhtKeMbM.NkOnQuid/Tt!VeZ?d5AdAnB, C$CkG-NelyNgOpTt yUdUn+VeY$5CkyGga+Mb N?N^Xury3R-s:Ch(eDG-G}tIdIlInJ%KeMm$NNa+Nda>NgoNs]Nu$P!Rb!R^Rg(R(eRketRria+SkSs/ T^T i$ThTrixTt XimumZe3AdowAnAsu*AtCh<-D$DiaLodyLtMb M%yNt]NuRcyR+R.RryShSsa+T$Thod3Dd!DnightLk~]M-NdNimumN%Nu>Rac!Rr%S ySs/akeXXedXtu*5Bi!DelDifyMM|N.%NkeyN, N`OnR$ReRn(gSqu.oTh T]T%Unta(U'VeVie5ChFf(LeLtiplySc!SeumShroomS-/Tu$3Self/ yTh:I=MePk(Rrow/yT]Tu*3ArCkEdGati=G!@I` PhewR=/TTw%kUtr$V WsXt3CeGht5B!I'M(eeOd!Rm$R`SeTab!TeTh(gTi)VelW5C!?Mb R'T:K0EyJe@Li+Scu*S =Ta(Vious0CurE<Tob 0Or1FF Fi)T&2L1Ay0DI=Ymp-0It0CeEI#L(eLy1EnEraIn]Po'T]1An+B.Ch?dD D(?yG<I|Ig($Ph<0Tr-h0H 0Tdo%T TputTside0AlEnEr0NN 0Yg&0/ 0O}:CtDd!GeIrLa)LmNdaNelN-N` P RadeR|RkRrotRtySsT^ThTi|TrolTt nU'VeYm|3A)AnutArAs<tL-<NN$tyNcilOp!Pp Rfe@Rm.Rs#T2O}OtoRa'Ys-$0AnoCn-Ctu*E)GGe#~LotNkO} Pe/olT^Zza_)A}tA,-A>AyEa'Ed+U{UgUn+2EmEtIntL?LeLi)NdNyOlPul?Rt]S.]Ssib!/TatoTt yV tyWd W _@i)Ai'Ed-tEf Epa*Es|EttyEv|I)IdeIm?yIntI%.yIs#Iva>IzeOb!mO)[Odu)Of.OgramOje@Omo>OofOp tyOsp O>@OudOvide2Bl-Dd(g~LpL'Mpk(N^PilPpyR^a'R.yRpo'R'ShTZz!3Ramid:99Al.yAntumArt E,]I{ItIzO>:Bb.Cco#CeCkD?DioIlInI'~yMpN^NdomN+PidReTeTh V&WZ%3AdyAlAs#BelBuildC$lCei=CipeC%dCyc!Du)F!@F%mFu'G]G*tGul?Je@LaxLea'LiefLyMa(Memb M(dMo=Nd NewNtOp&PairPeatPla)P%tQui*ScueSemb!Si,Sour)Sp#'SultTi*T*atTurnUn]Ve$ViewW?d2Y`m0BBb#CeChDeD+F!GhtGidNgOtPp!SkTu$V$V 5AdA,BotBu,CketM<)OfOkieOmSeTa>UghUndU>Y$5Bb DeGLeNNwayR$:DDd!D}[FeIlLadLm#L#LtLu>MeMp!NdTisfyToshiU)Usa+VeY1A!AnA*Att E}HemeHoolI&)I[%sOrp]OutRapRe&RiptRub1AAr^As#AtC#dC*tCt]Cur.yEdEkGm|Le@~M(?Ni%N'Nt&)RiesRvi)Ss]Tt!TupV&_dowAftAllowA*EdEllEriffIeldIftI}IpIv O{OeOotOpOrtOuld O=RimpRugUff!Y0Bl(gCkDeE+GhtGnL|Lk~yLv Mil?Mp!N)NgR&/ Tua>XZe1A>Et^IIllInIrtUll0AbAmEepEnd I)IdeIghtImOg<OtOwUsh0AllArtI!OkeOo`0A{AkeApIffOw0ApCc Ci$CkDaFtL?Ldi LidLut]L=Me#eNgOnRryRtUlUndUpUr)U`0A)A*Ati$AwnEakEci$EedEllEndH eI)Id IkeInIr.L.OilOns%O#OrtOtRayReadR(gY0Ua*UeezeUir*l_b!AdiumAffA+AirsAmpAndArtA>AyEakEelEmEpE*oI{IllIngO{Oma^O}OolOryO=Ra>gyReetRikeR#gRugg!Ud|UffUmb!Y!0Bje@Bm.BwayC)[ChDd&Ff G?G+,ItMm NNnyN'tP PplyP*meReRfa)R+Rpri'RroundR=ySpe@/a(1AllowAmpApArmE?EetIftImIngIt^Ord1MbolMptomRup/em:B!Ck!GIlL|LkNkPeR+tSk/eTtooXi3A^Am~NN<tNnisNtRm/Xt_nkAtEmeEnE%yE*EyIngIsOughtReeRi=RowUmbUnd 0CketDeG LtMb MeNyPRedSsueT!5A,BaccoDayDdl EGe` I!tK&MatoM%rowNeNgueNightOlO`PP-Pp!R^RnadoRtoi'SsT$Uri,W?dW WnY_{AdeAff-Ag-A(Ansf ApAshA=lAyEatEeEndI$IbeI{Igg ImIpOphyOub!U{UeUlyUmpetU,U`Y2BeIt]Mb!NaN}lRkeyRnRt!1El=EntyI)InI,O1PeP-$:5Ly5B*lla0Ab!Awa*C!Cov D DoFairFoldHappyIf%mIqueItIv 'KnownLo{TilUsu$Veil1Da>GradeHoldOnP Set1B<Ge0A+EEdEfulE![U$0Il.y:C<tCuumGueLidL!yL=NNishP%Rious/Ult3H-!L=tNd%Ntu*NueRbRifyRs]RyS'lT <3Ab!Br<tCiousCt%yDeoEw~a+Nta+Ol(Rtu$RusSaS.Su$T$Vid5C$I)IdLc<oLumeTeYa+:GeG#ItLk~LnutNtRfa*RmRri%ShSp/eT VeY3Al`Ap#ArA'lA` BDd(gEk&dIrdLcome/T_!AtEatEelEnE*IpIsp 0DeD`FeLd~NNdowNeNgNkNn Nt ReSdomSeShT}[5LfM<Nd OdOlRdRkRldRryR`_pE{E,!I,I>Ong::Rd3Ar~ow9UUngU`:3BraRo9NeO", ds = "0x3c8acc1e7b08d8e76f9fda015ef48dc8c710a73cb7e0f77b2c18a9b5a7adde60";
let tn = null;
class a0 extends fs {
  /**
   *  Creates a new instance of the English language Wordlist.
   *
   *  This should be unnecessary most of the time as the exported
   *  [[langEn]] should suffice.
   *
   *  @_ignore:
   */
  constructor() {
    super("en", os, ds);
  }
  /**
   *  Returns a singleton instance of a ``LangEn``, creating it
   *  if this is the first time being called.
   */
  static wordlist() {
    return tn == null && (tn = new a0()), tn;
  }
}
function Br(n) {
  return (1 << n) - 1 << 8 - n & 255;
}
function bs(n) {
  return (1 << n) - 1 & 255;
}
function nn(n, e) {
  Bc("NFKD"), e == null && (e = a0.wordlist());
  const t = e.split(n);
  b(t.length % 3 === 0 && t.length >= 12 && t.length <= 24, "invalid mnemonic length", "mnemonic", "[ REDACTED ]");
  const c = new Uint8Array(Math.ceil(11 * t.length / 8));
  let r = 0;
  for (let f = 0; f < t.length; f++) {
    let o = e.getWordIndex(t[f].normalize("NFKD"));
    b(o >= 0, `invalid mnemonic word at index ${f}`, "mnemonic", "[ REDACTED ]");
    for (let d = 0; d < 11; d++)
      o & 1 << 10 - d && (c[r >> 3] |= 1 << 7 - r % 8), r++;
  }
  const a = 32 * t.length / 3, x = t.length / 3, s = Br(x), i = g(he(c.slice(0, a / 8)))[0] & s;
  return b(i === (c[c.length - 1] & s), "invalid mnemonic checksum", "mnemonic", "[ REDACTED ]"), m(c.slice(0, a / 8));
}
function cn(n, e) {
  b(n.length % 4 === 0 && n.length >= 16 && n.length <= 32, "invalid entropy size", "entropy", "[ REDACTED ]"), e == null && (e = a0.wordlist());
  const t = [0];
  let c = 11;
  for (let x = 0; x < n.length; x++)
    c > 8 ? (t[t.length - 1] <<= 8, t[t.length - 1] |= n[x], c -= 8) : (t[t.length - 1] <<= c, t[t.length - 1] |= n[x] >> 8 - c, t.push(n[x] & bs(8 - c)), c += 3);
  const r = n.length / 4, a = parseInt(he(n).substring(2, 4), 16) & Br(r);
  return t[t.length - 1] <<= r, t[t.length - 1] |= a >> 8 - r, e.join(t.map((x) => e.getWord(x)));
}
const rn = {};
class H0 {
  /**
   *  @private
   */
  constructor(e, t, c, r, a) {
    /**
     *  The mnemonic phrase of 12, 15, 18, 21 or 24 words.
     *
     *  Use the [[wordlist]] ``split`` method to get the individual words.
     */
    B(this, "phrase");
    /**
     *  The password used for this mnemonic. If no password is used this
     *  is the empty string (i.e. ``""``) as per the specification.
     */
    B(this, "password");
    /**
     *  The wordlist for this mnemonic.
     */
    B(this, "wordlist");
    /**
     *  The underlying entropy which the mnemonic encodes.
     */
    B(this, "entropy");
    r == null && (r = ""), a == null && (a = a0.wordlist()), zt(e, rn, "Mnemonic"), fe(this, { phrase: c, password: r, wordlist: a, entropy: t });
  }
  /**
   *  Returns the seed for the mnemonic.
   */
  computeSeed() {
    const e = n0("mnemonic" + this.password, "NFKD");
    return _e(n0(this.phrase, "NFKD"), e, 2048, 64, "sha512");
  }
  /**
   *  Creates a new Mnemonic for the %%phrase%%.
   *
   *  The default %%password%% is the empty string and the default
   *  wordlist is the [English wordlists](LangEn).
   */
  static fromPhrase(e, t, c) {
    const r = nn(e, c);
    return e = cn(g(r), c), new H0(rn, r, e, t, c);
  }
  /**
   *  Create a new **Mnemonic** from the %%entropy%%.
   *
   *  The default %%password%% is the empty string and the default
   *  wordlist is the [English wordlists](LangEn).
   */
  static fromEntropy(e, t, c) {
    const r = g(e, "entropy"), a = cn(r, c);
    return new H0(rn, m(r), a, t, c);
  }
  /**
   *  Returns the phrase for %%mnemonic%%.
   */
  static entropyToPhrase(e, t) {
    const c = g(e, "entropy");
    return cn(c, t);
  }
  /**
   *  Returns the entropy for %%phrase%%.
   */
  static phraseToEntropy(e, t) {
    return nn(e, t);
  }
  /**
   *  Returns true if %%phrase%% is a valid [[link-bip-39]] phrase.
   *
   *  This checks all the provided words belong to the %%wordlist%%,
   *  that the length is valid and the checksum is correct.
   */
  static isValidMnemonic(e, t) {
    try {
      return nn(e, t), !0;
    } catch {
    }
    return !1;
  }
}
/*! MIT License. Copyright 2015-2022 Richard Moore <me@ricmoo.com>. See LICENSE.txt. */
var V = globalThis && globalThis.__classPrivateFieldGet || function(n, e, t, c) {
  if (t === "a" && !c)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !c : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? c : t === "a" ? c.call(n) : c ? c.value : e.get(n);
}, an = globalThis && globalThis.__classPrivateFieldSet || function(n, e, t, c, r) {
  if (c === "m")
    throw new TypeError("Private method is not writable");
  if (c === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return c === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}, vt, ae, ge;
const ls = { 16: 10, 24: 12, 32: 14 }, us = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54, 108, 216, 171, 77, 154, 47, 94, 188, 99, 198, 151, 53, 106, 212, 179, 125, 250, 239, 197, 145], ce = [99, 124, 119, 123, 242, 107, 111, 197, 48, 1, 103, 43, 254, 215, 171, 118, 202, 130, 201, 125, 250, 89, 71, 240, 173, 212, 162, 175, 156, 164, 114, 192, 183, 253, 147, 38, 54, 63, 247, 204, 52, 165, 229, 241, 113, 216, 49, 21, 4, 199, 35, 195, 24, 150, 5, 154, 7, 18, 128, 226, 235, 39, 178, 117, 9, 131, 44, 26, 27, 110, 90, 160, 82, 59, 214, 179, 41, 227, 47, 132, 83, 209, 0, 237, 32, 252, 177, 91, 106, 203, 190, 57, 74, 76, 88, 207, 208, 239, 170, 251, 67, 77, 51, 133, 69, 249, 2, 127, 80, 60, 159, 168, 81, 163, 64, 143, 146, 157, 56, 245, 188, 182, 218, 33, 16, 255, 243, 210, 205, 12, 19, 236, 95, 151, 68, 23, 196, 167, 126, 61, 100, 93, 25, 115, 96, 129, 79, 220, 34, 42, 144, 136, 70, 238, 184, 20, 222, 94, 11, 219, 224, 50, 58, 10, 73, 6, 36, 92, 194, 211, 172, 98, 145, 149, 228, 121, 231, 200, 55, 109, 141, 213, 78, 169, 108, 86, 244, 234, 101, 122, 174, 8, 186, 120, 37, 46, 28, 166, 180, 198, 232, 221, 116, 31, 75, 189, 139, 138, 112, 62, 181, 102, 72, 3, 246, 14, 97, 53, 87, 185, 134, 193, 29, 158, 225, 248, 152, 17, 105, 217, 142, 148, 155, 30, 135, 233, 206, 85, 40, 223, 140, 161, 137, 13, 191, 230, 66, 104, 65, 153, 45, 15, 176, 84, 187, 22], It = [82, 9, 106, 213, 48, 54, 165, 56, 191, 64, 163, 158, 129, 243, 215, 251, 124, 227, 57, 130, 155, 47, 255, 135, 52, 142, 67, 68, 196, 222, 233, 203, 84, 123, 148, 50, 166, 194, 35, 61, 238, 76, 149, 11, 66, 250, 195, 78, 8, 46, 161, 102, 40, 217, 36, 178, 118, 91, 162, 73, 109, 139, 209, 37, 114, 248, 246, 100, 134, 104, 152, 22, 212, 164, 92, 204, 93, 101, 182, 146, 108, 112, 72, 80, 253, 237, 185, 218, 94, 21, 70, 87, 167, 141, 157, 132, 144, 216, 171, 0, 140, 188, 211, 10, 247, 228, 88, 5, 184, 179, 69, 6, 208, 44, 30, 143, 202, 63, 15, 2, 193, 175, 189, 3, 1, 19, 138, 107, 58, 145, 17, 65, 79, 103, 220, 234, 151, 242, 207, 206, 240, 180, 230, 115, 150, 172, 116, 34, 231, 173, 53, 133, 226, 249, 55, 232, 28, 117, 223, 110, 71, 241, 26, 113, 29, 41, 197, 137, 111, 183, 98, 14, 170, 24, 190, 27, 252, 86, 62, 75, 198, 210, 121, 32, 154, 219, 192, 254, 120, 205, 90, 244, 31, 221, 168, 51, 136, 7, 199, 49, 177, 18, 16, 89, 39, 128, 236, 95, 96, 81, 127, 169, 25, 181, 74, 13, 45, 229, 122, 159, 147, 201, 156, 239, 160, 224, 59, 77, 174, 42, 245, 176, 200, 235, 187, 60, 131, 83, 153, 97, 23, 43, 4, 126, 186, 119, 214, 38, 225, 105, 20, 99, 85, 33, 12, 125], hs = [3328402341, 4168907908, 4000806809, 4135287693, 4294111757, 3597364157, 3731845041, 2445657428, 1613770832, 33620227, 3462883241, 1445669757, 3892248089, 3050821474, 1303096294, 3967186586, 2412431941, 528646813, 2311702848, 4202528135, 4026202645, 2992200171, 2387036105, 4226871307, 1101901292, 3017069671, 1604494077, 1169141738, 597466303, 1403299063, 3832705686, 2613100635, 1974974402, 3791519004, 1033081774, 1277568618, 1815492186, 2118074177, 4126668546, 2211236943, 1748251740, 1369810420, 3521504564, 4193382664, 3799085459, 2883115123, 1647391059, 706024767, 134480908, 2512897874, 1176707941, 2646852446, 806885416, 932615841, 168101135, 798661301, 235341577, 605164086, 461406363, 3756188221, 3454790438, 1311188841, 2142417613, 3933566367, 302582043, 495158174, 1479289972, 874125870, 907746093, 3698224818, 3025820398, 1537253627, 2756858614, 1983593293, 3084310113, 2108928974, 1378429307, 3722699582, 1580150641, 327451799, 2790478837, 3117535592, 0, 3253595436, 1075847264, 3825007647, 2041688520, 3059440621, 3563743934, 2378943302, 1740553945, 1916352843, 2487896798, 2555137236, 2958579944, 2244988746, 3151024235, 3320835882, 1336584933, 3992714006, 2252555205, 2588757463, 1714631509, 293963156, 2319795663, 3925473552, 67240454, 4269768577, 2689618160, 2017213508, 631218106, 1269344483, 2723238387, 1571005438, 2151694528, 93294474, 1066570413, 563977660, 1882732616, 4059428100, 1673313503, 2008463041, 2950355573, 1109467491, 537923632, 3858759450, 4260623118, 3218264685, 2177748300, 403442708, 638784309, 3287084079, 3193921505, 899127202, 2286175436, 773265209, 2479146071, 1437050866, 4236148354, 2050833735, 3362022572, 3126681063, 840505643, 3866325909, 3227541664, 427917720, 2655997905, 2749160575, 1143087718, 1412049534, 999329963, 193497219, 2353415882, 3354324521, 1807268051, 672404540, 2816401017, 3160301282, 369822493, 2916866934, 3688947771, 1681011286, 1949973070, 336202270, 2454276571, 201721354, 1210328172, 3093060836, 2680341085, 3184776046, 1135389935, 3294782118, 965841320, 831886756, 3554993207, 4068047243, 3588745010, 2345191491, 1849112409, 3664604599, 26054028, 2983581028, 2622377682, 1235855840, 3630984372, 2891339514, 4092916743, 3488279077, 3395642799, 4101667470, 1202630377, 268961816, 1874508501, 4034427016, 1243948399, 1546530418, 941366308, 1470539505, 1941222599, 2546386513, 3421038627, 2715671932, 3899946140, 1042226977, 2521517021, 1639824860, 227249030, 260737669, 3765465232, 2084453954, 1907733956, 3429263018, 2420656344, 100860677, 4160157185, 470683154, 3261161891, 1781871967, 2924959737, 1773779408, 394692241, 2579611992, 974986535, 664706745, 3655459128, 3958962195, 731420851, 571543859, 3530123707, 2849626480, 126783113, 865375399, 765172662, 1008606754, 361203602, 3387549984, 2278477385, 2857719295, 1344809080, 2782912378, 59542671, 1503764984, 160008576, 437062935, 1707065306, 3622233649, 2218934982, 3496503480, 2185314755, 697932208, 1512910199, 504303377, 2075177163, 2824099068, 1841019862, 739644986], ys = [2781242211, 2230877308, 2582542199, 2381740923, 234877682, 3184946027, 2984144751, 1418839493, 1348481072, 50462977, 2848876391, 2102799147, 434634494, 1656084439, 3863849899, 2599188086, 1167051466, 2636087938, 1082771913, 2281340285, 368048890, 3954334041, 3381544775, 201060592, 3963727277, 1739838676, 4250903202, 3930435503, 3206782108, 4149453988, 2531553906, 1536934080, 3262494647, 484572669, 2923271059, 1783375398, 1517041206, 1098792767, 49674231, 1334037708, 1550332980, 4098991525, 886171109, 150598129, 2481090929, 1940642008, 1398944049, 1059722517, 201851908, 1385547719, 1699095331, 1587397571, 674240536, 2704774806, 252314885, 3039795866, 151914247, 908333586, 2602270848, 1038082786, 651029483, 1766729511, 3447698098, 2682942837, 454166793, 2652734339, 1951935532, 775166490, 758520603, 3000790638, 4004797018, 4217086112, 4137964114, 1299594043, 1639438038, 3464344499, 2068982057, 1054729187, 1901997871, 2534638724, 4121318227, 1757008337, 0, 750906861, 1614815264, 535035132, 3363418545, 3988151131, 3201591914, 1183697867, 3647454910, 1265776953, 3734260298, 3566750796, 3903871064, 1250283471, 1807470800, 717615087, 3847203498, 384695291, 3313910595, 3617213773, 1432761139, 2484176261, 3481945413, 283769337, 100925954, 2180939647, 4037038160, 1148730428, 3123027871, 3813386408, 4087501137, 4267549603, 3229630528, 2315620239, 2906624658, 3156319645, 1215313976, 82966005, 3747855548, 3245848246, 1974459098, 1665278241, 807407632, 451280895, 251524083, 1841287890, 1283575245, 337120268, 891687699, 801369324, 3787349855, 2721421207, 3431482436, 959321879, 1469301956, 4065699751, 2197585534, 1199193405, 2898814052, 3887750493, 724703513, 2514908019, 2696962144, 2551808385, 3516813135, 2141445340, 1715741218, 2119445034, 2872807568, 2198571144, 3398190662, 700968686, 3547052216, 1009259540, 2041044702, 3803995742, 487983883, 1991105499, 1004265696, 1449407026, 1316239930, 504629770, 3683797321, 168560134, 1816667172, 3837287516, 1570751170, 1857934291, 4014189740, 2797888098, 2822345105, 2754712981, 936633572, 2347923833, 852879335, 1133234376, 1500395319, 3084545389, 2348912013, 1689376213, 3533459022, 3762923945, 3034082412, 4205598294, 133428468, 634383082, 2949277029, 2398386810, 3913789102, 403703816, 3580869306, 2297460856, 1867130149, 1918643758, 607656988, 4049053350, 3346248884, 1368901318, 600565992, 2090982877, 2632479860, 557719327, 3717614411, 3697393085, 2249034635, 2232388234, 2430627952, 1115438654, 3295786421, 2865522278, 3633334344, 84280067, 33027830, 303828494, 2747425121, 1600795957, 4188952407, 3496589753, 2434238086, 1486471617, 658119965, 3106381470, 953803233, 334231800, 3005978776, 857870609, 3151128937, 1890179545, 2298973838, 2805175444, 3056442267, 574365214, 2450884487, 550103529, 1233637070, 4289353045, 2018519080, 2057691103, 2399374476, 4166623649, 2148108681, 387583245, 3664101311, 836232934, 3330556482, 3100665960, 3280093505, 2955516313, 2002398509, 287182607, 3413881008, 4238890068, 3597515707, 975967766], ps = [1671808611, 2089089148, 2006576759, 2072901243, 4061003762, 1807603307, 1873927791, 3310653893, 810573872, 16974337, 1739181671, 729634347, 4263110654, 3613570519, 2883997099, 1989864566, 3393556426, 2191335298, 3376449993, 2106063485, 4195741690, 1508618841, 1204391495, 4027317232, 2917941677, 3563566036, 2734514082, 2951366063, 2629772188, 2767672228, 1922491506, 3227229120, 3082974647, 4246528509, 2477669779, 644500518, 911895606, 1061256767, 4144166391, 3427763148, 878471220, 2784252325, 3845444069, 4043897329, 1905517169, 3631459288, 827548209, 356461077, 67897348, 3344078279, 593839651, 3277757891, 405286936, 2527147926, 84871685, 2595565466, 118033927, 305538066, 2157648768, 3795705826, 3945188843, 661212711, 2999812018, 1973414517, 152769033, 2208177539, 745822252, 439235610, 455947803, 1857215598, 1525593178, 2700827552, 1391895634, 994932283, 3596728278, 3016654259, 695947817, 3812548067, 795958831, 2224493444, 1408607827, 3513301457, 0, 3979133421, 543178784, 4229948412, 2982705585, 1542305371, 1790891114, 3410398667, 3201918910, 961245753, 1256100938, 1289001036, 1491644504, 3477767631, 3496721360, 4012557807, 2867154858, 4212583931, 1137018435, 1305975373, 861234739, 2241073541, 1171229253, 4178635257, 33948674, 2139225727, 1357946960, 1011120188, 2679776671, 2833468328, 1374921297, 2751356323, 1086357568, 2408187279, 2460827538, 2646352285, 944271416, 4110742005, 3168756668, 3066132406, 3665145818, 560153121, 271589392, 4279952895, 4077846003, 3530407890, 3444343245, 202643468, 322250259, 3962553324, 1608629855, 2543990167, 1154254916, 389623319, 3294073796, 2817676711, 2122513534, 1028094525, 1689045092, 1575467613, 422261273, 1939203699, 1621147744, 2174228865, 1339137615, 3699352540, 577127458, 712922154, 2427141008, 2290289544, 1187679302, 3995715566, 3100863416, 339486740, 3732514782, 1591917662, 186455563, 3681988059, 3762019296, 844522546, 978220090, 169743370, 1239126601, 101321734, 611076132, 1558493276, 3260915650, 3547250131, 2901361580, 1655096418, 2443721105, 2510565781, 3828863972, 2039214713, 3878868455, 3359869896, 928607799, 1840765549, 2374762893, 3580146133, 1322425422, 2850048425, 1823791212, 1459268694, 4094161908, 3928346602, 1706019429, 2056189050, 2934523822, 135794696, 3134549946, 2022240376, 628050469, 779246638, 472135708, 2800834470, 3032970164, 3327236038, 3894660072, 3715932637, 1956440180, 522272287, 1272813131, 3185336765, 2340818315, 2323976074, 1888542832, 1044544574, 3049550261, 1722469478, 1222152264, 50660867, 4127324150, 236067854, 1638122081, 895445557, 1475980887, 3117443513, 2257655686, 3243809217, 489110045, 2662934430, 3778599393, 4162055160, 2561878936, 288563729, 1773916777, 3648039385, 2391345038, 2493985684, 2612407707, 505560094, 2274497927, 3911240169, 3460925390, 1442818645, 678973480, 3749357023, 2358182796, 2717407649, 2306869641, 219617805, 3218761151, 3862026214, 1120306242, 1756942440, 1103331905, 2578459033, 762796589, 252780047, 2966125488, 1425844308, 3151392187, 372911126], gs = [1667474886, 2088535288, 2004326894, 2071694838, 4075949567, 1802223062, 1869591006, 3318043793, 808472672, 16843522, 1734846926, 724270422, 4278065639, 3621216949, 2880169549, 1987484396, 3402253711, 2189597983, 3385409673, 2105378810, 4210693615, 1499065266, 1195886990, 4042263547, 2913856577, 3570689971, 2728590687, 2947541573, 2627518243, 2762274643, 1920112356, 3233831835, 3082273397, 4261223649, 2475929149, 640051788, 909531756, 1061110142, 4160160501, 3435941763, 875846760, 2779116625, 3857003729, 4059105529, 1903268834, 3638064043, 825316194, 353713962, 67374088, 3351728789, 589522246, 3284360861, 404236336, 2526454071, 84217610, 2593830191, 117901582, 303183396, 2155911963, 3806477791, 3958056653, 656894286, 2998062463, 1970642922, 151591698, 2206440989, 741110872, 437923380, 454765878, 1852748508, 1515908788, 2694904667, 1381168804, 993742198, 3604373943, 3014905469, 690584402, 3823320797, 791638366, 2223281939, 1398011302, 3520161977, 0, 3991743681, 538992704, 4244381667, 2981218425, 1532751286, 1785380564, 3419096717, 3200178535, 960056178, 1246420628, 1280103576, 1482221744, 3486468741, 3503319995, 4025428677, 2863326543, 4227536621, 1128514950, 1296947098, 859002214, 2240123921, 1162203018, 4193849577, 33687044, 2139062782, 1347481760, 1010582648, 2678045221, 2829640523, 1364325282, 2745433693, 1077985408, 2408548869, 2459086143, 2644360225, 943212656, 4126475505, 3166494563, 3065430391, 3671750063, 555836226, 269496352, 4294908645, 4092792573, 3537006015, 3452783745, 202118168, 320025894, 3974901699, 1600119230, 2543297077, 1145359496, 387397934, 3301201811, 2812801621, 2122220284, 1027426170, 1684319432, 1566435258, 421079858, 1936954854, 1616945344, 2172753945, 1330631070, 3705438115, 572679748, 707427924, 2425400123, 2290647819, 1179044492, 4008585671, 3099120491, 336870440, 3739122087, 1583276732, 185277718, 3688593069, 3772791771, 842159716, 976899700, 168435220, 1229577106, 101059084, 606366792, 1549591736, 3267517855, 3553849021, 2897014595, 1650632388, 2442242105, 2509612081, 3840161747, 2038008818, 3890688725, 3368567691, 926374254, 1835907034, 2374863873, 3587531953, 1313788572, 2846482505, 1819063512, 1448540844, 4109633523, 3941213647, 1701162954, 2054852340, 2930698567, 134748176, 3132806511, 2021165296, 623210314, 774795868, 471606328, 2795958615, 3031746419, 3334885783, 3907527627, 3722280097, 1953799400, 522133822, 1263263126, 3183336545, 2341176845, 2324333839, 1886425312, 1044267644, 3048588401, 1718004428, 1212733584, 50529542, 4143317495, 235803164, 1633788866, 892690282, 1465383342, 3115962473, 2256965911, 3250673817, 488449850, 2661202215, 3789633753, 4177007595, 2560144171, 286339874, 1768537042, 3654906025, 2391705863, 2492770099, 2610673197, 505291324, 2273808917, 3924369609, 3469625735, 1431699370, 673740880, 3755965093, 2358021891, 2711746649, 2307489801, 218961690, 3217021541, 3873845719, 1111672452, 1751693520, 1094828930, 2576986153, 757954394, 252645662, 2964376443, 1414855848, 3149649517, 370555436], ms = [1374988112, 2118214995, 437757123, 975658646, 1001089995, 530400753, 2902087851, 1273168787, 540080725, 2910219766, 2295101073, 4110568485, 1340463100, 3307916247, 641025152, 3043140495, 3736164937, 632953703, 1172967064, 1576976609, 3274667266, 2169303058, 2370213795, 1809054150, 59727847, 361929877, 3211623147, 2505202138, 3569255213, 1484005843, 1239443753, 2395588676, 1975683434, 4102977912, 2572697195, 666464733, 3202437046, 4035489047, 3374361702, 2110667444, 1675577880, 3843699074, 2538681184, 1649639237, 2976151520, 3144396420, 4269907996, 4178062228, 1883793496, 2403728665, 2497604743, 1383856311, 2876494627, 1917518562, 3810496343, 1716890410, 3001755655, 800440835, 2261089178, 3543599269, 807962610, 599762354, 33778362, 3977675356, 2328828971, 2809771154, 4077384432, 1315562145, 1708848333, 101039829, 3509871135, 3299278474, 875451293, 2733856160, 92987698, 2767645557, 193195065, 1080094634, 1584504582, 3178106961, 1042385657, 2531067453, 3711829422, 1306967366, 2438237621, 1908694277, 67556463, 1615861247, 429456164, 3602770327, 2302690252, 1742315127, 2968011453, 126454664, 3877198648, 2043211483, 2709260871, 2084704233, 4169408201, 0, 159417987, 841739592, 504459436, 1817866830, 4245618683, 260388950, 1034867998, 908933415, 168810852, 1750902305, 2606453969, 607530554, 202008497, 2472011535, 3035535058, 463180190, 2160117071, 1641816226, 1517767529, 470948374, 3801332234, 3231722213, 1008918595, 303765277, 235474187, 4069246893, 766945465, 337553864, 1475418501, 2943682380, 4003061179, 2743034109, 4144047775, 1551037884, 1147550661, 1543208500, 2336434550, 3408119516, 3069049960, 3102011747, 3610369226, 1113818384, 328671808, 2227573024, 2236228733, 3535486456, 2935566865, 3341394285, 496906059, 3702665459, 226906860, 2009195472, 733156972, 2842737049, 294930682, 1206477858, 2835123396, 2700099354, 1451044056, 573804783, 2269728455, 3644379585, 2362090238, 2564033334, 2801107407, 2776292904, 3669462566, 1068351396, 742039012, 1350078989, 1784663195, 1417561698, 4136440770, 2430122216, 775550814, 2193862645, 2673705150, 1775276924, 1876241833, 3475313331, 3366754619, 270040487, 3902563182, 3678124923, 3441850377, 1851332852, 3969562369, 2203032232, 3868552805, 2868897406, 566021896, 4011190502, 3135740889, 1248802510, 3936291284, 699432150, 832877231, 708780849, 3332740144, 899835584, 1951317047, 4236429990, 3767586992, 866637845, 4043610186, 1106041591, 2144161806, 395441711, 1984812685, 1139781709, 3433712980, 3835036895, 2664543715, 1282050075, 3240894392, 1181045119, 2640243204, 25965917, 4203181171, 4211818798, 3009879386, 2463879762, 3910161971, 1842759443, 2597806476, 933301370, 1509430414, 3943906441, 3467192302, 3076639029, 3776767469, 2051518780, 2631065433, 1441952575, 404016761, 1942435775, 1408749034, 1610459739, 3745345300, 2017778566, 3400528769, 3110650942, 941896748, 3265478751, 371049330, 3168937228, 675039627, 4279080257, 967311729, 135050206, 3635733660, 1683407248, 2076935265, 3576870512, 1215061108, 3501741890], ws = [1347548327, 1400783205, 3273267108, 2520393566, 3409685355, 4045380933, 2880240216, 2471224067, 1428173050, 4138563181, 2441661558, 636813900, 4233094615, 3620022987, 2149987652, 2411029155, 1239331162, 1730525723, 2554718734, 3781033664, 46346101, 310463728, 2743944855, 3328955385, 3875770207, 2501218972, 3955191162, 3667219033, 768917123, 3545789473, 692707433, 1150208456, 1786102409, 2029293177, 1805211710, 3710368113, 3065962831, 401639597, 1724457132, 3028143674, 409198410, 2196052529, 1620529459, 1164071807, 3769721975, 2226875310, 486441376, 2499348523, 1483753576, 428819965, 2274680428, 3075636216, 598438867, 3799141122, 1474502543, 711349675, 129166120, 53458370, 2592523643, 2782082824, 4063242375, 2988687269, 3120694122, 1559041666, 730517276, 2460449204, 4042459122, 2706270690, 3446004468, 3573941694, 533804130, 2328143614, 2637442643, 2695033685, 839224033, 1973745387, 957055980, 2856345839, 106852767, 1371368976, 4181598602, 1033297158, 2933734917, 1179510461, 3046200461, 91341917, 1862534868, 4284502037, 605657339, 2547432937, 3431546947, 2003294622, 3182487618, 2282195339, 954669403, 3682191598, 1201765386, 3917234703, 3388507166, 0, 2198438022, 1211247597, 2887651696, 1315723890, 4227665663, 1443857720, 507358933, 657861945, 1678381017, 560487590, 3516619604, 975451694, 2970356327, 261314535, 3535072918, 2652609425, 1333838021, 2724322336, 1767536459, 370938394, 182621114, 3854606378, 1128014560, 487725847, 185469197, 2918353863, 3106780840, 3356761769, 2237133081, 1286567175, 3152976349, 4255350624, 2683765030, 3160175349, 3309594171, 878443390, 1988838185, 3704300486, 1756818940, 1673061617, 3403100636, 272786309, 1075025698, 545572369, 2105887268, 4174560061, 296679730, 1841768865, 1260232239, 4091327024, 3960309330, 3497509347, 1814803222, 2578018489, 4195456072, 575138148, 3299409036, 446754879, 3629546796, 4011996048, 3347532110, 3252238545, 4270639778, 915985419, 3483825537, 681933534, 651868046, 2755636671, 3828103837, 223377554, 2607439820, 1649704518, 3270937875, 3901806776, 1580087799, 4118987695, 3198115200, 2087309459, 2842678573, 3016697106, 1003007129, 2802849917, 1860738147, 2077965243, 164439672, 4100872472, 32283319, 2827177882, 1709610350, 2125135846, 136428751, 3874428392, 3652904859, 3460984630, 3572145929, 3593056380, 2939266226, 824852259, 818324884, 3224740454, 930369212, 2801566410, 2967507152, 355706840, 1257309336, 4148292826, 243256656, 790073846, 2373340630, 1296297904, 1422699085, 3756299780, 3818836405, 457992840, 3099667487, 2135319889, 77422314, 1560382517, 1945798516, 788204353, 1521706781, 1385356242, 870912086, 325965383, 2358957921, 2050466060, 2388260884, 2313884476, 4006521127, 901210569, 3990953189, 1014646705, 1503449823, 1062597235, 2031621326, 3212035895, 3931371469, 1533017514, 350174575, 2256028891, 2177544179, 1052338372, 741876788, 1606591296, 1914052035, 213705253, 2334669897, 1107234197, 1899603969, 3725069491, 2631447780, 2422494913, 1635502980, 1893020342, 1950903388, 1120974935], As = [2807058932, 1699970625, 2764249623, 1586903591, 1808481195, 1173430173, 1487645946, 59984867, 4199882800, 1844882806, 1989249228, 1277555970, 3623636965, 3419915562, 1149249077, 2744104290, 1514790577, 459744698, 244860394, 3235995134, 1963115311, 4027744588, 2544078150, 4190530515, 1608975247, 2627016082, 2062270317, 1507497298, 2200818878, 567498868, 1764313568, 3359936201, 2305455554, 2037970062, 1047239e3, 1910319033, 1337376481, 2904027272, 2892417312, 984907214, 1243112415, 830661914, 861968209, 2135253587, 2011214180, 2927934315, 2686254721, 731183368, 1750626376, 4246310725, 1820824798, 4172763771, 3542330227, 48394827, 2404901663, 2871682645, 671593195, 3254988725, 2073724613, 145085239, 2280796200, 2779915199, 1790575107, 2187128086, 472615631, 3029510009, 4075877127, 3802222185, 4107101658, 3201631749, 1646252340, 4270507174, 1402811438, 1436590835, 3778151818, 3950355702, 3963161475, 4020912224, 2667994737, 273792366, 2331590177, 104699613, 95345982, 3175501286, 2377486676, 1560637892, 3564045318, 369057872, 4213447064, 3919042237, 1137477952, 2658625497, 1119727848, 2340947849, 1530455833, 4007360968, 172466556, 266959938, 516552836, 0, 2256734592, 3980931627, 1890328081, 1917742170, 4294704398, 945164165, 3575528878, 958871085, 3647212047, 2787207260, 1423022939, 775562294, 1739656202, 3876557655, 2530391278, 2443058075, 3310321856, 547512796, 1265195639, 437656594, 3121275539, 719700128, 3762502690, 387781147, 218828297, 3350065803, 2830708150, 2848461854, 428169201, 122466165, 3720081049, 1627235199, 648017665, 4122762354, 1002783846, 2117360635, 695634755, 3336358691, 4234721005, 4049844452, 3704280881, 2232435299, 574624663, 287343814, 612205898, 1039717051, 840019705, 2708326185, 793451934, 821288114, 1391201670, 3822090177, 376187827, 3113855344, 1224348052, 1679968233, 2361698556, 1058709744, 752375421, 2431590963, 1321699145, 3519142200, 2734591178, 188127444, 2177869557, 3727205754, 2384911031, 3215212461, 2648976442, 2450346104, 3432737375, 1180849278, 331544205, 3102249176, 4150144569, 2952102595, 2159976285, 2474404304, 766078933, 313773861, 2570832044, 2108100632, 1668212892, 3145456443, 2013908262, 418672217, 3070356634, 2594734927, 1852171925, 3867060991, 3473416636, 3907448597, 2614737639, 919489135, 164948639, 2094410160, 2997825956, 590424639, 2486224549, 1723872674, 3157750862, 3399941250, 3501252752, 3625268135, 2555048196, 3673637356, 1343127501, 4130281361, 3599595085, 2957853679, 1297403050, 81781910, 3051593425, 2283490410, 532201772, 1367295589, 3926170974, 895287692, 1953757831, 1093597963, 492483431, 3528626907, 1446242576, 1192455638, 1636604631, 209336225, 344873464, 1015671571, 669961897, 3375740769, 3857572124, 2973530695, 3747192018, 1933530610, 3464042516, 935293895, 3454686199, 2858115069, 1863638845, 3683022916, 4085369519, 3292445032, 875313188, 1080017571, 3279033885, 621591778, 1233856572, 2504130317, 24197544, 3017672716, 3835484340, 3247465558, 2220981195, 3060847922, 1551124588, 1463996600], Es = [4104605777, 1097159550, 396673818, 660510266, 2875968315, 2638606623, 4200115116, 3808662347, 821712160, 1986918061, 3430322568, 38544885, 3856137295, 718002117, 893681702, 1654886325, 2975484382, 3122358053, 3926825029, 4274053469, 796197571, 1290801793, 1184342925, 3556361835, 2405426947, 2459735317, 1836772287, 1381620373, 3196267988, 1948373848, 3764988233, 3385345166, 3263785589, 2390325492, 1480485785, 3111247143, 3780097726, 2293045232, 548169417, 3459953789, 3746175075, 439452389, 1362321559, 1400849762, 1685577905, 1806599355, 2174754046, 137073913, 1214797936, 1174215055, 3731654548, 2079897426, 1943217067, 1258480242, 529487843, 1437280870, 3945269170, 3049390895, 3313212038, 923313619, 679998e3, 3215307299, 57326082, 377642221, 3474729866, 2041877159, 133361907, 1776460110, 3673476453, 96392454, 878845905, 2801699524, 777231668, 4082475170, 2330014213, 4142626212, 2213296395, 1626319424, 1906247262, 1846563261, 562755902, 3708173718, 1040559837, 3871163981, 1418573201, 3294430577, 114585348, 1343618912, 2566595609, 3186202582, 1078185097, 3651041127, 3896688048, 2307622919, 425408743, 3371096953, 2081048481, 1108339068, 2216610296, 0, 2156299017, 736970802, 292596766, 1517440620, 251657213, 2235061775, 2933202493, 758720310, 265905162, 1554391400, 1532285339, 908999204, 174567692, 1474760595, 4002861748, 2610011675, 3234156416, 3693126241, 2001430874, 303699484, 2478443234, 2687165888, 585122620, 454499602, 151849742, 2345119218, 3064510765, 514443284, 4044981591, 1963412655, 2581445614, 2137062819, 19308535, 1928707164, 1715193156, 4219352155, 1126790795, 600235211, 3992742070, 3841024952, 836553431, 1669664834, 2535604243, 3323011204, 1243905413, 3141400786, 4180808110, 698445255, 2653899549, 2989552604, 2253581325, 3252932727, 3004591147, 1891211689, 2487810577, 3915653703, 4237083816, 4030667424, 2100090966, 865136418, 1229899655, 953270745, 3399679628, 3557504664, 4118925222, 2061379749, 3079546586, 2915017791, 983426092, 2022837584, 1607244650, 2118541908, 2366882550, 3635996816, 972512814, 3283088770, 1568718495, 3499326569, 3576539503, 621982671, 2895723464, 410887952, 2623762152, 1002142683, 645401037, 1494807662, 2595684844, 1335535747, 2507040230, 4293295786, 3167684641, 367585007, 3885750714, 1865862730, 2668221674, 2960971305, 2763173681, 1059270954, 2777952454, 2724642869, 1320957812, 2194319100, 2429595872, 2815956275, 77089521, 3973773121, 3444575871, 2448830231, 1305906550, 4021308739, 2857194700, 2516901860, 3518358430, 1787304780, 740276417, 1699839814, 1592394909, 2352307457, 2272556026, 188821243, 1729977011, 3687994002, 274084841, 3594982253, 3613494426, 2701949495, 4162096729, 322734571, 2837966542, 1640576439, 484830689, 1202797690, 3537852828, 4067639125, 349075736, 3342319475, 4157467219, 4255800159, 1030690015, 1155237496, 2951971274, 1757691577, 607398968, 2738905026, 499347990, 3794078908, 1011452712, 227885567, 2818666809, 213114376, 3034881240, 1455525988, 3414450555, 850817237, 1817998408, 3092726480], Is = [0, 235474187, 470948374, 303765277, 941896748, 908933415, 607530554, 708780849, 1883793496, 2118214995, 1817866830, 1649639237, 1215061108, 1181045119, 1417561698, 1517767529, 3767586992, 4003061179, 4236429990, 4069246893, 3635733660, 3602770327, 3299278474, 3400528769, 2430122216, 2664543715, 2362090238, 2193862645, 2835123396, 2801107407, 3035535058, 3135740889, 3678124923, 3576870512, 3341394285, 3374361702, 3810496343, 3977675356, 4279080257, 4043610186, 2876494627, 2776292904, 3076639029, 3110650942, 2472011535, 2640243204, 2403728665, 2169303058, 1001089995, 899835584, 666464733, 699432150, 59727847, 226906860, 530400753, 294930682, 1273168787, 1172967064, 1475418501, 1509430414, 1942435775, 2110667444, 1876241833, 1641816226, 2910219766, 2743034109, 2976151520, 3211623147, 2505202138, 2606453969, 2302690252, 2269728455, 3711829422, 3543599269, 3240894392, 3475313331, 3843699074, 3943906441, 4178062228, 4144047775, 1306967366, 1139781709, 1374988112, 1610459739, 1975683434, 2076935265, 1775276924, 1742315127, 1034867998, 866637845, 566021896, 800440835, 92987698, 193195065, 429456164, 395441711, 1984812685, 2017778566, 1784663195, 1683407248, 1315562145, 1080094634, 1383856311, 1551037884, 101039829, 135050206, 437757123, 337553864, 1042385657, 807962610, 573804783, 742039012, 2531067453, 2564033334, 2328828971, 2227573024, 2935566865, 2700099354, 3001755655, 3168937228, 3868552805, 3902563182, 4203181171, 4102977912, 3736164937, 3501741890, 3265478751, 3433712980, 1106041591, 1340463100, 1576976609, 1408749034, 2043211483, 2009195472, 1708848333, 1809054150, 832877231, 1068351396, 766945465, 599762354, 159417987, 126454664, 361929877, 463180190, 2709260871, 2943682380, 3178106961, 3009879386, 2572697195, 2538681184, 2236228733, 2336434550, 3509871135, 3745345300, 3441850377, 3274667266, 3910161971, 3877198648, 4110568485, 4211818798, 2597806476, 2497604743, 2261089178, 2295101073, 2733856160, 2902087851, 3202437046, 2968011453, 3936291284, 3835036895, 4136440770, 4169408201, 3535486456, 3702665459, 3467192302, 3231722213, 2051518780, 1951317047, 1716890410, 1750902305, 1113818384, 1282050075, 1584504582, 1350078989, 168810852, 67556463, 371049330, 404016761, 841739592, 1008918595, 775550814, 540080725, 3969562369, 3801332234, 4035489047, 4269907996, 3569255213, 3669462566, 3366754619, 3332740144, 2631065433, 2463879762, 2160117071, 2395588676, 2767645557, 2868897406, 3102011747, 3069049960, 202008497, 33778362, 270040487, 504459436, 875451293, 975658646, 675039627, 641025152, 2084704233, 1917518562, 1615861247, 1851332852, 1147550661, 1248802510, 1484005843, 1451044056, 933301370, 967311729, 733156972, 632953703, 260388950, 25965917, 328671808, 496906059, 1206477858, 1239443753, 1543208500, 1441952575, 2144161806, 1908694277, 1675577880, 1842759443, 3610369226, 3644379585, 3408119516, 3307916247, 4011190502, 3776767469, 4077384432, 4245618683, 2809771154, 2842737049, 3144396420, 3043140495, 2673705150, 2438237621, 2203032232, 2370213795], Ss = [0, 185469197, 370938394, 487725847, 741876788, 657861945, 975451694, 824852259, 1483753576, 1400783205, 1315723890, 1164071807, 1950903388, 2135319889, 1649704518, 1767536459, 2967507152, 3152976349, 2801566410, 2918353863, 2631447780, 2547432937, 2328143614, 2177544179, 3901806776, 3818836405, 4270639778, 4118987695, 3299409036, 3483825537, 3535072918, 3652904859, 2077965243, 1893020342, 1841768865, 1724457132, 1474502543, 1559041666, 1107234197, 1257309336, 598438867, 681933534, 901210569, 1052338372, 261314535, 77422314, 428819965, 310463728, 3409685355, 3224740454, 3710368113, 3593056380, 3875770207, 3960309330, 4045380933, 4195456072, 2471224067, 2554718734, 2237133081, 2388260884, 3212035895, 3028143674, 2842678573, 2724322336, 4138563181, 4255350624, 3769721975, 3955191162, 3667219033, 3516619604, 3431546947, 3347532110, 2933734917, 2782082824, 3099667487, 3016697106, 2196052529, 2313884476, 2499348523, 2683765030, 1179510461, 1296297904, 1347548327, 1533017514, 1786102409, 1635502980, 2087309459, 2003294622, 507358933, 355706840, 136428751, 53458370, 839224033, 957055980, 605657339, 790073846, 2373340630, 2256028891, 2607439820, 2422494913, 2706270690, 2856345839, 3075636216, 3160175349, 3573941694, 3725069491, 3273267108, 3356761769, 4181598602, 4063242375, 4011996048, 3828103837, 1033297158, 915985419, 730517276, 545572369, 296679730, 446754879, 129166120, 213705253, 1709610350, 1860738147, 1945798516, 2029293177, 1239331162, 1120974935, 1606591296, 1422699085, 4148292826, 4233094615, 3781033664, 3931371469, 3682191598, 3497509347, 3446004468, 3328955385, 2939266226, 2755636671, 3106780840, 2988687269, 2198438022, 2282195339, 2501218972, 2652609425, 1201765386, 1286567175, 1371368976, 1521706781, 1805211710, 1620529459, 2105887268, 1988838185, 533804130, 350174575, 164439672, 46346101, 870912086, 954669403, 636813900, 788204353, 2358957921, 2274680428, 2592523643, 2441661558, 2695033685, 2880240216, 3065962831, 3182487618, 3572145929, 3756299780, 3270937875, 3388507166, 4174560061, 4091327024, 4006521127, 3854606378, 1014646705, 930369212, 711349675, 560487590, 272786309, 457992840, 106852767, 223377554, 1678381017, 1862534868, 1914052035, 2031621326, 1211247597, 1128014560, 1580087799, 1428173050, 32283319, 182621114, 401639597, 486441376, 768917123, 651868046, 1003007129, 818324884, 1503449823, 1385356242, 1333838021, 1150208456, 1973745387, 2125135846, 1673061617, 1756818940, 2970356327, 3120694122, 2802849917, 2887651696, 2637442643, 2520393566, 2334669897, 2149987652, 3917234703, 3799141122, 4284502037, 4100872472, 3309594171, 3460984630, 3545789473, 3629546796, 2050466060, 1899603969, 1814803222, 1730525723, 1443857720, 1560382517, 1075025698, 1260232239, 575138148, 692707433, 878443390, 1062597235, 243256656, 91341917, 409198410, 325965383, 3403100636, 3252238545, 3704300486, 3620022987, 3874428392, 3990953189, 4042459122, 4227665663, 2460449204, 2578018489, 2226875310, 2411029155, 3198115200, 3046200461, 2827177882, 2743944855], Ps = [0, 218828297, 437656594, 387781147, 875313188, 958871085, 775562294, 590424639, 1750626376, 1699970625, 1917742170, 2135253587, 1551124588, 1367295589, 1180849278, 1265195639, 3501252752, 3720081049, 3399941250, 3350065803, 3835484340, 3919042237, 4270507174, 4085369519, 3102249176, 3051593425, 2734591178, 2952102595, 2361698556, 2177869557, 2530391278, 2614737639, 3145456443, 3060847922, 2708326185, 2892417312, 2404901663, 2187128086, 2504130317, 2555048196, 3542330227, 3727205754, 3375740769, 3292445032, 3876557655, 3926170974, 4246310725, 4027744588, 1808481195, 1723872674, 1910319033, 2094410160, 1608975247, 1391201670, 1173430173, 1224348052, 59984867, 244860394, 428169201, 344873464, 935293895, 984907214, 766078933, 547512796, 1844882806, 1627235199, 2011214180, 2062270317, 1507497298, 1423022939, 1137477952, 1321699145, 95345982, 145085239, 532201772, 313773861, 830661914, 1015671571, 731183368, 648017665, 3175501286, 2957853679, 2807058932, 2858115069, 2305455554, 2220981195, 2474404304, 2658625497, 3575528878, 3625268135, 3473416636, 3254988725, 3778151818, 3963161475, 4213447064, 4130281361, 3599595085, 3683022916, 3432737375, 3247465558, 3802222185, 4020912224, 4172763771, 4122762354, 3201631749, 3017672716, 2764249623, 2848461854, 2331590177, 2280796200, 2431590963, 2648976442, 104699613, 188127444, 472615631, 287343814, 840019705, 1058709744, 671593195, 621591778, 1852171925, 1668212892, 1953757831, 2037970062, 1514790577, 1463996600, 1080017571, 1297403050, 3673637356, 3623636965, 3235995134, 3454686199, 4007360968, 3822090177, 4107101658, 4190530515, 2997825956, 3215212461, 2830708150, 2779915199, 2256734592, 2340947849, 2627016082, 2443058075, 172466556, 122466165, 273792366, 492483431, 1047239e3, 861968209, 612205898, 695634755, 1646252340, 1863638845, 2013908262, 1963115311, 1446242576, 1530455833, 1277555970, 1093597963, 1636604631, 1820824798, 2073724613, 1989249228, 1436590835, 1487645946, 1337376481, 1119727848, 164948639, 81781910, 331544205, 516552836, 1039717051, 821288114, 669961897, 719700128, 2973530695, 3157750862, 2871682645, 2787207260, 2232435299, 2283490410, 2667994737, 2450346104, 3647212047, 3564045318, 3279033885, 3464042516, 3980931627, 3762502690, 4150144569, 4199882800, 3070356634, 3121275539, 2904027272, 2686254721, 2200818878, 2384911031, 2570832044, 2486224549, 3747192018, 3528626907, 3310321856, 3359936201, 3950355702, 3867060991, 4049844452, 4234721005, 1739656202, 1790575107, 2108100632, 1890328081, 1402811438, 1586903591, 1233856572, 1149249077, 266959938, 48394827, 369057872, 418672217, 1002783846, 919489135, 567498868, 752375421, 209336225, 24197544, 376187827, 459744698, 945164165, 895287692, 574624663, 793451934, 1679968233, 1764313568, 2117360635, 1933530610, 1343127501, 1560637892, 1243112415, 1192455638, 3704280881, 3519142200, 3336358691, 3419915562, 3907448597, 3857572124, 4075877127, 4294704398, 3029510009, 3113855344, 2927934315, 2744104290, 2159976285, 2377486676, 2594734927, 2544078150], Ns = [0, 151849742, 303699484, 454499602, 607398968, 758720310, 908999204, 1059270954, 1214797936, 1097159550, 1517440620, 1400849762, 1817998408, 1699839814, 2118541908, 2001430874, 2429595872, 2581445614, 2194319100, 2345119218, 3034881240, 3186202582, 2801699524, 2951971274, 3635996816, 3518358430, 3399679628, 3283088770, 4237083816, 4118925222, 4002861748, 3885750714, 1002142683, 850817237, 698445255, 548169417, 529487843, 377642221, 227885567, 77089521, 1943217067, 2061379749, 1640576439, 1757691577, 1474760595, 1592394909, 1174215055, 1290801793, 2875968315, 2724642869, 3111247143, 2960971305, 2405426947, 2253581325, 2638606623, 2487810577, 3808662347, 3926825029, 4044981591, 4162096729, 3342319475, 3459953789, 3576539503, 3693126241, 1986918061, 2137062819, 1685577905, 1836772287, 1381620373, 1532285339, 1078185097, 1229899655, 1040559837, 923313619, 740276417, 621982671, 439452389, 322734571, 137073913, 19308535, 3871163981, 4021308739, 4104605777, 4255800159, 3263785589, 3414450555, 3499326569, 3651041127, 2933202493, 2815956275, 3167684641, 3049390895, 2330014213, 2213296395, 2566595609, 2448830231, 1305906550, 1155237496, 1607244650, 1455525988, 1776460110, 1626319424, 2079897426, 1928707164, 96392454, 213114376, 396673818, 514443284, 562755902, 679998e3, 865136418, 983426092, 3708173718, 3557504664, 3474729866, 3323011204, 4180808110, 4030667424, 3945269170, 3794078908, 2507040230, 2623762152, 2272556026, 2390325492, 2975484382, 3092726480, 2738905026, 2857194700, 3973773121, 3856137295, 4274053469, 4157467219, 3371096953, 3252932727, 3673476453, 3556361835, 2763173681, 2915017791, 3064510765, 3215307299, 2156299017, 2307622919, 2459735317, 2610011675, 2081048481, 1963412655, 1846563261, 1729977011, 1480485785, 1362321559, 1243905413, 1126790795, 878845905, 1030690015, 645401037, 796197571, 274084841, 425408743, 38544885, 188821243, 3613494426, 3731654548, 3313212038, 3430322568, 4082475170, 4200115116, 3780097726, 3896688048, 2668221674, 2516901860, 2366882550, 2216610296, 3141400786, 2989552604, 2837966542, 2687165888, 1202797690, 1320957812, 1437280870, 1554391400, 1669664834, 1787304780, 1906247262, 2022837584, 265905162, 114585348, 499347990, 349075736, 736970802, 585122620, 972512814, 821712160, 2595684844, 2478443234, 2293045232, 2174754046, 3196267988, 3079546586, 2895723464, 2777952454, 3537852828, 3687994002, 3234156416, 3385345166, 4142626212, 4293295786, 3841024952, 3992742070, 174567692, 57326082, 410887952, 292596766, 777231668, 660510266, 1011452712, 893681702, 1108339068, 1258480242, 1343618912, 1494807662, 1715193156, 1865862730, 1948373848, 2100090966, 2701949495, 2818666809, 3004591147, 3122358053, 2235061775, 2352307457, 2535604243, 2653899549, 3915653703, 3764988233, 4219352155, 4067639125, 3444575871, 3294430577, 3746175075, 3594982253, 836553431, 953270745, 600235211, 718002117, 367585007, 484830689, 133361907, 251657213, 2041877159, 1891211689, 1806599355, 1654886325, 1568718495, 1418573201, 1335535747, 1184342925];
function xn(n) {
  const e = [];
  for (let t = 0; t < n.length; t += 4)
    e.push(n[t] << 24 | n[t + 1] << 16 | n[t + 2] << 8 | n[t + 3]);
  return e;
}
class Ln {
  get key() {
    return V(this, vt, "f").slice();
  }
  constructor(e) {
    if (vt.set(this, void 0), ae.set(this, void 0), ge.set(this, void 0), !(this instanceof Ln))
      throw Error("AES must be instanitated with `new`");
    an(this, vt, new Uint8Array(e), "f");
    const t = ls[this.key.length];
    if (t == null)
      throw new TypeError("invalid key size (must be 16, 24 or 32 bytes)");
    an(this, ge, [], "f"), an(this, ae, [], "f");
    for (let o = 0; o <= t; o++)
      V(this, ge, "f").push([0, 0, 0, 0]), V(this, ae, "f").push([0, 0, 0, 0]);
    const c = (t + 1) * 4, r = this.key.length / 4, a = xn(this.key);
    let x;
    for (let o = 0; o < r; o++)
      x = o >> 2, V(this, ge, "f")[x][o % 4] = a[o], V(this, ae, "f")[t - x][o % 4] = a[o];
    let s = 0, i = r, f;
    for (; i < c; ) {
      if (f = a[r - 1], a[0] ^= ce[f >> 16 & 255] << 24 ^ ce[f >> 8 & 255] << 16 ^ ce[f & 255] << 8 ^ ce[f >> 24 & 255] ^ us[s] << 24, s += 1, r != 8)
        for (let u = 1; u < r; u++)
          a[u] ^= a[u - 1];
      else {
        for (let u = 1; u < r / 2; u++)
          a[u] ^= a[u - 1];
        f = a[r / 2 - 1], a[r / 2] ^= ce[f & 255] ^ ce[f >> 8 & 255] << 8 ^ ce[f >> 16 & 255] << 16 ^ ce[f >> 24 & 255] << 24;
        for (let u = r / 2 + 1; u < r; u++)
          a[u] ^= a[u - 1];
      }
      let o = 0, d, l;
      for (; o < r && i < c; )
        d = i >> 2, l = i % 4, V(this, ge, "f")[d][l] = a[o], V(this, ae, "f")[t - d][l] = a[o++], i++;
    }
    for (let o = 1; o < t; o++)
      for (let d = 0; d < 4; d++)
        f = V(this, ae, "f")[o][d], V(this, ae, "f")[o][d] = Is[f >> 24 & 255] ^ Ss[f >> 16 & 255] ^ Ps[f >> 8 & 255] ^ Ns[f & 255];
  }
  encrypt(e) {
    if (e.length != 16)
      throw new TypeError("invalid plaintext size (must be 16 bytes)");
    const t = V(this, ge, "f").length - 1, c = [0, 0, 0, 0];
    let r = xn(e);
    for (let s = 0; s < 4; s++)
      r[s] ^= V(this, ge, "f")[0][s];
    for (let s = 1; s < t; s++) {
      for (let i = 0; i < 4; i++)
        c[i] = hs[r[i] >> 24 & 255] ^ ys[r[(i + 1) % 4] >> 16 & 255] ^ ps[r[(i + 2) % 4] >> 8 & 255] ^ gs[r[(i + 3) % 4] & 255] ^ V(this, ge, "f")[s][i];
      r = c.slice();
    }
    const a = new Uint8Array(16);
    let x = 0;
    for (let s = 0; s < 4; s++)
      x = V(this, ge, "f")[t][s], a[4 * s] = (ce[r[s] >> 24 & 255] ^ x >> 24) & 255, a[4 * s + 1] = (ce[r[(s + 1) % 4] >> 16 & 255] ^ x >> 16) & 255, a[4 * s + 2] = (ce[r[(s + 2) % 4] >> 8 & 255] ^ x >> 8) & 255, a[4 * s + 3] = (ce[r[(s + 3) % 4] & 255] ^ x) & 255;
    return a;
  }
  decrypt(e) {
    if (e.length != 16)
      throw new TypeError("invalid ciphertext size (must be 16 bytes)");
    const t = V(this, ae, "f").length - 1, c = [0, 0, 0, 0];
    let r = xn(e);
    for (let s = 0; s < 4; s++)
      r[s] ^= V(this, ae, "f")[0][s];
    for (let s = 1; s < t; s++) {
      for (let i = 0; i < 4; i++)
        c[i] = ms[r[i] >> 24 & 255] ^ ws[r[(i + 3) % 4] >> 16 & 255] ^ As[r[(i + 2) % 4] >> 8 & 255] ^ Es[r[(i + 1) % 4] & 255] ^ V(this, ae, "f")[s][i];
      r = c.slice();
    }
    const a = new Uint8Array(16);
    let x = 0;
    for (let s = 0; s < 4; s++)
      x = V(this, ae, "f")[t][s], a[4 * s] = (It[r[s] >> 24 & 255] ^ x >> 24) & 255, a[4 * s + 1] = (It[r[(s + 3) % 4] >> 16 & 255] ^ x >> 16) & 255, a[4 * s + 2] = (It[r[(s + 2) % 4] >> 8 & 255] ^ x >> 8) & 255, a[4 * s + 3] = (It[r[(s + 1) % 4] & 255] ^ x) & 255;
    return a;
  }
}
vt = /* @__PURE__ */ new WeakMap(), ae = /* @__PURE__ */ new WeakMap(), ge = /* @__PURE__ */ new WeakMap();
class Cr {
  constructor(e, t, c) {
    if (c && !(this instanceof c))
      throw new Error(`${e} must be instantiated with "new"`);
    Object.defineProperties(this, {
      aes: { enumerable: !0, value: new Ln(t) },
      name: { enumerable: !0, value: e }
    });
  }
}
var St = globalThis && globalThis.__classPrivateFieldSet || function(n, e, t, c, r) {
  if (c === "m")
    throw new TypeError("Private method is not writable");
  if (c === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return c === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}, f0 = globalThis && globalThis.__classPrivateFieldGet || function(n, e, t, c) {
  if (t === "a" && !c)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !c : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? c : t === "a" ? c.call(n) : c ? c.value : e.get(n);
}, Z0, Ie;
class Fn extends Cr {
  constructor(e, t) {
    if (super("ECC", e, Fn), Z0.set(this, void 0), Ie.set(this, void 0), t) {
      if (t.length % 16)
        throw new TypeError("invalid iv size (must be 16 bytes)");
      St(this, Z0, new Uint8Array(t), "f");
    } else
      St(this, Z0, new Uint8Array(16), "f");
    St(this, Ie, this.iv, "f");
  }
  get iv() {
    return new Uint8Array(f0(this, Z0, "f"));
  }
  encrypt(e) {
    if (e.length % 16)
      throw new TypeError("invalid plaintext size (must be multiple of 16 bytes)");
    const t = new Uint8Array(e.length);
    for (let c = 0; c < e.length; c += 16) {
      for (let r = 0; r < 16; r++)
        f0(this, Ie, "f")[r] ^= e[c + r];
      St(this, Ie, this.aes.encrypt(f0(this, Ie, "f")), "f"), t.set(f0(this, Ie, "f"), c);
    }
    return t;
  }
  decrypt(e) {
    if (e.length % 16)
      throw new TypeError("invalid ciphertext size (must be multiple of 16 bytes)");
    const t = new Uint8Array(e.length);
    for (let c = 0; c < e.length; c += 16) {
      const r = this.aes.decrypt(e.subarray(c, c + 16));
      for (let a = 0; a < 16; a++)
        t[c + a] = r[a] ^ f0(this, Ie, "f")[a], f0(this, Ie, "f")[a] = e[c + a];
    }
    return t;
  }
}
Z0 = /* @__PURE__ */ new WeakMap(), Ie = /* @__PURE__ */ new WeakMap();
var o0 = globalThis && globalThis.__classPrivateFieldSet || function(n, e, t, c, r) {
  if (c === "m")
    throw new TypeError("Private method is not writable");
  if (c === "a" && !r)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof e == "function" ? n !== e || !r : !e.has(n))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return c === "a" ? r.call(n, t) : r ? r.value = t : e.set(n, t), t;
}, re = globalThis && globalThis.__classPrivateFieldGet || function(n, e, t, c) {
  if (t === "a" && !c)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof e == "function" ? n !== e || !c : !e.has(n))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? c : t === "a" ? c.call(n) : c ? c.value : e.get(n);
}, Y0, Ze, xe;
class G0 extends Cr {
  constructor(e, t) {
    super("CTR", e, G0), Y0.set(this, void 0), Ze.set(this, void 0), xe.set(this, void 0), o0(this, xe, new Uint8Array(16), "f"), re(this, xe, "f").fill(0), o0(this, Y0, re(this, xe, "f"), "f"), o0(this, Ze, 16, "f"), t == null && (t = 1), typeof t == "number" ? this.setCounterValue(t) : this.setCounterBytes(t);
  }
  get counter() {
    return new Uint8Array(re(this, xe, "f"));
  }
  setCounterValue(e) {
    if (!Number.isInteger(e) || e < 0 || e > Number.MAX_SAFE_INTEGER)
      throw new TypeError("invalid counter initial integer value");
    for (let t = 15; t >= 0; --t)
      re(this, xe, "f")[t] = e % 256, e = Math.floor(e / 256);
  }
  setCounterBytes(e) {
    if (e.length !== 16)
      throw new TypeError("invalid counter initial Uint8Array value length");
    re(this, xe, "f").set(e);
  }
  increment() {
    for (let e = 15; e >= 0; e--)
      if (re(this, xe, "f")[e] === 255)
        re(this, xe, "f")[e] = 0;
      else {
        re(this, xe, "f")[e]++;
        break;
      }
  }
  encrypt(e) {
    var t, c;
    const r = new Uint8Array(e);
    for (let a = 0; a < r.length; a++)
      re(this, Ze, "f") === 16 && (o0(this, Y0, this.aes.encrypt(re(this, xe, "f")), "f"), o0(this, Ze, 0, "f"), this.increment()), r[a] ^= re(this, Y0, "f")[o0(this, Ze, (c = re(this, Ze, "f"), t = c++, c), "f"), t];
    return r;
  }
  decrypt(e) {
    return this.encrypt(e);
  }
}
Y0 = /* @__PURE__ */ new WeakMap(), Ze = /* @__PURE__ */ new WeakMap(), xe = /* @__PURE__ */ new WeakMap();
function Ts(n) {
  if (n.length < 16)
    throw new TypeError("PKCS#7 invalid length");
  const e = n[n.length - 1];
  if (e > 16)
    throw new TypeError("PKCS#7 padding byte out of range");
  const t = n.length - e;
  for (let c = 0; c < e; c++)
    if (n[t + c] !== e)
      throw new TypeError("PKCS#7 invalid padding byte");
  return new Uint8Array(n.subarray(0, t));
}
function Ur(n) {
  return typeof n == "string" && !n.startsWith("0x") && (n = "0x" + n), Ye(n);
}
function W0(n, e) {
  for (n = String(n); n.length < e; )
    n = "0" + n;
  return n;
}
function lt(n) {
  return typeof n == "string" ? n0(n, "NFKC") : Ye(n);
}
function $(n, e) {
  const t = e.match(/^([a-z0-9$_.-]*)(:([a-z]+))?(!)?$/i);
  b(t != null, "invalid path", "path", e);
  const c = t[1], r = t[3], a = t[4] === "!";
  let x = n;
  for (const s of c.toLowerCase().split(".")) {
    if (Array.isArray(x)) {
      if (!s.match(/^[0-9]+$/))
        break;
      x = x[parseInt(s)];
    } else if (typeof x == "object") {
      let i = null;
      for (const f in x)
        if (f.toLowerCase() === s) {
          i = x[f];
          break;
        }
      x = i;
    } else
      x = null;
    if (x == null)
      break;
  }
  if (b(!a || x != null, "missing required value", "path", c), r && x != null) {
    if (r === "int") {
      if (typeof x == "string" && x.match(/^-?[0-9]+$/))
        return parseInt(x);
      if (Number.isSafeInteger(x))
        return x;
    }
    if (r === "number" && typeof x == "string" && x.match(/^-?[0-9.]*$/))
      return parseFloat(x);
    if (r === "data" && typeof x == "string")
      return Ur(x);
    if (r === "array" && Array.isArray(x) || r === typeof x)
      return x;
    b(!1, `wrong type found for ${r} `, "path", c);
  }
  return x;
}
const Lr = "m/44'/60'/0'/0/0";
function Sc(n) {
  try {
    const e = JSON.parse(n);
    if ((e.version != null ? parseInt(e.version) : 0) === 3)
      return !0;
  } catch {
  }
  return !1;
}
function ks(n, e, t) {
  if ($(n, "crypto.cipher:string") === "aes-128-ctr") {
    const r = $(n, "crypto.cipherparams.iv:data!"), a = new G0(e, r);
    return m(a.decrypt(t));
  }
  T(!1, "unsupported cipher", "UNSUPPORTED_OPERATION", {
    operation: "decrypt"
  });
}
function Gt(n, e) {
  const t = g(e), c = $(n, "crypto.ciphertext:data!"), r = m(G(W([t.slice(16, 32), c]))).substring(2);
  b(r === $(n, "crypto.mac:string!").toLowerCase(), "incorrect password", "password", "[ REDACTED ]");
  const a = ks(n, t.slice(0, 16), c), x = bt(a);
  if (n.address) {
    let f = n.address.toLowerCase();
    f.startsWith("0x") || (f = "0x" + f), b(J(f) === x, "keystore address/privateKey mismatch", "address", n.address);
  }
  const s = { address: x, privateKey: a };
  if ($(n, "x-ethers.version:string") === "0.1") {
    const f = t.slice(32, 64), o = $(n, "x-ethers.mnemonicCiphertext:data!"), d = $(n, "x-ethers.mnemonicCounter:data!"), l = new G0(f, d);
    s.mnemonic = {
      path: $(n, "x-ethers.path:string") || Lr,
      locale: $(n, "x-ethers.locale:string") || "en",
      entropy: m(g(l.decrypt(o)))
    };
  }
  return s;
}
function Fr(n) {
  const e = $(n, "crypto.kdf:string");
  if (e && typeof e == "string") {
    if (e.toLowerCase() === "scrypt") {
      const t = $(n, "crypto.kdfparams.salt:data!"), c = $(n, "crypto.kdfparams.n:int!"), r = $(n, "crypto.kdfparams.r:int!"), a = $(n, "crypto.kdfparams.p:int!");
      b(c > 0 && (c & c - 1) === 0, "invalid kdf.N", "kdf.N", c), b(r > 0 && a > 0, "invalid kdf", "kdf", e);
      const x = $(n, "crypto.kdfparams.dklen:int!");
      return b(x === 32, "invalid kdf.dklen", "kdf.dflen", x), { name: "scrypt", salt: t, N: c, r, p: a, dkLen: 64 };
    } else if (e.toLowerCase() === "pbkdf2") {
      const t = $(n, "crypto.kdfparams.salt:data!"), c = $(n, "crypto.kdfparams.prf:string!"), r = c.split("-").pop();
      b(r === "sha256" || r === "sha512", "invalid kdf.pdf", "kdf.pdf", c);
      const a = $(n, "crypto.kdfparams.c:int!"), x = $(n, "crypto.kdfparams.dklen:int!");
      return b(x === 32, "invalid kdf.dklen", "kdf.dklen", x), { name: "pbkdf2", salt: t, count: a, dkLen: x, algorithm: r };
    }
  }
  b(!1, "unsupported key-derivation function", "kdf", e);
}
function vs(n, e) {
  const t = JSON.parse(n), c = lt(e), r = Fr(t);
  if (r.name === "pbkdf2") {
    const { salt: d, count: l, dkLen: u, algorithm: y } = r, p = _e(c, d, l, u, y);
    return Gt(t, p);
  }
  T(r.name === "scrypt", "cannot be reached", "UNKNOWN_ERROR", { params: r });
  const { salt: a, N: x, r: s, p: i, dkLen: f } = r, o = z0(c, a, x, s, i, f);
  return Gt(t, o);
}
function Pc(n) {
  return new Promise((e) => {
    setTimeout(() => {
      e();
    }, n);
  });
}
async function Rs(n, e, t) {
  const c = JSON.parse(n), r = lt(e), a = Fr(c);
  if (a.name === "pbkdf2") {
    t && (t(0), await Pc(0));
    const { salt: l, count: u, dkLen: y, algorithm: p } = a, I = _e(r, l, u, y, p);
    return t && (t(1), await Pc(0)), Gt(c, I);
  }
  T(a.name === "scrypt", "cannot be reached", "UNKNOWN_ERROR", { params: a });
  const { salt: x, N: s, r: i, p: f, dkLen: o } = a, d = await K0(r, x, s, i, f, o, t);
  return Gt(c, d);
}
function Dr(n) {
  const e = n.salt != null ? g(n.salt, "options.salt") : Te(32);
  let t = 1 << 17, c = 8, r = 1;
  return n.scrypt && (n.scrypt.N && (t = n.scrypt.N), n.scrypt.r && (c = n.scrypt.r), n.scrypt.p && (r = n.scrypt.p)), b(typeof t == "number" && t > 0 && Number.isSafeInteger(t) && (BigInt(t) & BigInt(t - 1)) === BigInt(0), "invalid scrypt N parameter", "options.N", t), b(typeof c == "number" && c > 0 && Number.isSafeInteger(c), "invalid scrypt r parameter", "options.r", c), b(typeof r == "number" && r > 0 && Number.isSafeInteger(r), "invalid scrypt p parameter", "options.p", r), { name: "scrypt", dkLen: 32, salt: e, N: t, r: c, p: r };
}
function $r(n, e, t, c) {
  const r = g(t.privateKey, "privateKey"), a = c.iv != null ? g(c.iv, "options.iv") : Te(16);
  b(a.length === 16, "invalid options.iv length", "options.iv", c.iv);
  const x = c.uuid != null ? g(c.uuid, "options.uuid") : Te(16);
  b(x.length === 16, "invalid options.uuid length", "options.uuid", c.iv);
  const s = n.slice(0, 16), i = n.slice(16, 32), f = new G0(s, a), o = g(f.encrypt(r)), d = G(W([i, o])), l = {
    address: t.address.substring(2).toLowerCase(),
    id: ca(x),
    version: 3,
    Crypto: {
      cipher: "aes-128-ctr",
      cipherparams: {
        iv: m(a).substring(2)
      },
      ciphertext: m(o).substring(2),
      kdf: "scrypt",
      kdfparams: {
        salt: m(e.salt).substring(2),
        n: e.N,
        dklen: 32,
        p: e.p,
        r: e.r
      },
      mac: d.substring(2)
    }
  };
  if (t.mnemonic) {
    const u = c.client != null ? c.client : `ethers/${Oc}`, y = t.mnemonic.path || Lr, p = t.mnemonic.locale || "en", I = n.slice(32, 64), S = g(t.mnemonic.entropy, "account.mnemonic.entropy"), U = Te(16), w = new G0(I, U), D = g(w.encrypt(S)), P = /* @__PURE__ */ new Date(), q = "UTC--" + (P.getUTCFullYear() + "-" + W0(P.getUTCMonth() + 1, 2) + "-" + W0(P.getUTCDate(), 2) + "T" + W0(P.getUTCHours(), 2) + "-" + W0(P.getUTCMinutes(), 2) + "-" + W0(P.getUTCSeconds(), 2) + ".0Z") + "--" + l.address;
    l["x-ethers"] = {
      client: u,
      gethFilename: q,
      path: y,
      locale: p,
      mnemonicCounter: m(U).substring(2),
      mnemonicCiphertext: m(D).substring(2),
      version: "0.1"
    };
  }
  return JSON.stringify(l);
}
function Hr(n, e, t) {
  t == null && (t = {});
  const c = lt(e), r = Dr(t), a = z0(c, r.salt, r.N, r.r, r.p, 64);
  return $r(g(a), r, n, t);
}
async function Gr(n, e, t) {
  t == null && (t = {});
  const c = lt(e), r = Dr(t), a = await K0(c, r.salt, r.N, r.r, r.p, 64, t.progressCallback);
  return $r(g(a), r, n, t);
}
const sn = "m/44'/60'/0'/0/0", Os = new Uint8Array([66, 105, 116, 99, 111, 105, 110, 32, 115, 101, 101, 100]), $e = 2147483648, Bs = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"), Cs = "0123456789abcdef";
function _t(n, e) {
  let t = "";
  for (; n; )
    t = Cs[n % 16] + t, n = Math.trunc(n / 16);
  for (; t.length < e * 2; )
    t = "0" + t;
  return "0x" + t;
}
function pn(n) {
  const e = g(n), t = En(he(he(e)), 0, 4), c = W([e, t]);
  return ea(c);
}
const me = {};
function _r(n, e, t, c) {
  const r = new Uint8Array(37);
  n & $e ? (T(c != null, "cannot derive child of neutered node", "UNSUPPORTED_OPERATION", {
    operation: "deriveChild"
  }), r.set(g(c), 1)) : r.set(g(t));
  for (let x = 24; x >= 0; x -= 8)
    r[33 + (x >> 3)] = n >> 24 - x & 255;
  const a = g(x0("sha512", e, r));
  return { IL: a.slice(0, 32), IR: a.slice(32) };
}
function Mr(n, e) {
  const t = e.split("/");
  b(t.length > 0 && (t[0] === "m" || n.depth > 0), "invalid path", "path", e), t[0] === "m" && t.shift();
  let c = n;
  for (let r = 0; r < t.length; r++) {
    const a = t[r];
    if (a.match(/^[0-9]+'$/)) {
      const x = parseInt(a.substring(0, a.length - 1));
      b(x < $e, "invalid path index", `path[${r}]`, a), c = c.deriveChild($e + x);
    } else if (a.match(/^[0-9]+$/)) {
      const x = parseInt(a);
      b(x < $e, "invalid path index", `path[${r}]`, a), c = c.deriveChild(x);
    } else
      b(!1, "invalid path component", `path[${r}]`, a);
  }
  return c;
}
var it, gn, t0, X0;
const le = class le extends $t {
  /**
   *  @private
   */
  constructor(t, c, r, a, x, s, i, f, o) {
    super(c, o);
    R(this, it);
    /**
     *  The compressed public key.
     */
    B(this, "publicKey");
    /**
     *  The fingerprint.
     *
     *  A fingerprint allows quick qay to detect parent and child nodes,
     *  but developers should be prepared to deal with collisions as it
     *  is only 4 bytes.
     */
    B(this, "fingerprint");
    /**
     *  The parent fingerprint.
     */
    B(this, "parentFingerprint");
    /**
     *  The mnemonic used to create this HD Node, if available.
     *
     *  Sources such as extended keys do not encode the mnemonic, in
     *  which case this will be ``null``.
     */
    B(this, "mnemonic");
    /**
     *  The chaincode, which is effectively a public key used
     *  to derive children.
     */
    B(this, "chainCode");
    /**
     *  The derivation path of this wallet.
     *
     *  Since extended keys do not provider full path details, this
     *  may be ``null``, if instantiated from a source that does not
     *  enocde it.
     */
    B(this, "path");
    /**
     *  The child index of this wallet. Values over ``2 *\* 31`` indicate
     *  the node is hardened.
     */
    B(this, "index");
    /**
     *  The depth of this wallet, which is the number of components
     *  in its path.
     */
    B(this, "depth");
    zt(t, me, "HDNodeWallet"), fe(this, { publicKey: c.compressedPublicKey });
    const d = En(M0(he(this.publicKey)), 0, 4);
    fe(this, {
      parentFingerprint: r,
      fingerprint: d,
      chainCode: a,
      path: x,
      index: s,
      depth: i
    }), fe(this, { mnemonic: f });
  }
  connect(t) {
    return new le(me, this.signingKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.mnemonic, t);
  }
  /**
   *  Resolves to a [JSON Keystore Wallet](json-wallets) encrypted with
   *  %%password%%.
   *
   *  If %%progressCallback%% is specified, it will receive periodic
   *  updates as the encryption process progreses.
   */
  async encrypt(t, c) {
    return await Gr(Z(this, it, gn).call(this), t, { progressCallback: c });
  }
  /**
   *  Returns a [JSON Keystore Wallet](json-wallets) encryped with
   *  %%password%%.
   *
   *  It is preferred to use the [async version](encrypt) instead,
   *  which allows a [[ProgressCallback]] to keep the user informed.
   *
   *  This method will block the event loop (freezing all UI) until
   *  it is complete, which may be a non-trivial duration.
   */
  encryptSync(t) {
    return Hr(Z(this, it, gn).call(this), t);
  }
  /**
   *  The extended key.
   *
   *  This key will begin with the prefix ``xpriv`` and can be used to
   *  reconstruct this HD Node to derive its children.
   */
  get extendedKey() {
    return T(this.depth < 256, "Depth too deep", "UNSUPPORTED_OPERATION", { operation: "extendedKey" }), pn(W([
      "0x0488ADE4",
      _t(this.depth, 1),
      this.parentFingerprint,
      _t(this.index, 4),
      this.chainCode,
      W(["0x00", this.privateKey])
    ]));
  }
  /**
   *  Returns true if this wallet has a path, providing a Type Guard
   *  that the path is non-null.
   */
  hasPath() {
    return this.path != null;
  }
  /**
   *  Returns a neutered HD Node, which removes the private details
   *  of an HD Node.
   *
   *  A neutered node has no private key, but can be used to derive
   *  child addresses and other public data about the HD Node.
   */
  neuter() {
    return new rt(me, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, this.provider);
  }
  /**
   *  Return the child for %%index%%.
   */
  deriveChild(t) {
    const c = Ae(t, "index");
    b(c <= 4294967295, "invalid index", "index", c);
    let r = this.path;
    r && (r += "/" + (c & ~$e), c & $e && (r += "'"));
    const { IR: a, IL: x } = _r(c, this.chainCode, this.publicKey, this.privateKey), s = new we(F0((Lc(x) + BigInt(this.privateKey)) % Bs, 32));
    return new le(me, s, this.fingerprint, m(a), r, c, this.depth + 1, this.mnemonic, this.provider);
  }
  /**
   *  Return the HDNode for %%path%% from this node.
   */
  derivePath(t) {
    return Mr(this, t);
  }
  /**
   *  Creates a new HD Node from %%extendedKey%%.
   *
   *  If the %%extendedKey%% will either have a prefix or ``xpub`` or
   *  ``xpriv``, returning a neutered HD Node ([[HDNodeVoidWallet]])
   *  or full HD Node ([[HDNodeWallet) respectively.
   */
  static fromExtendedKey(t) {
    const c = ie(ta(t));
    b(c.length === 82 || pn(c.slice(0, 78)) === t, "invalid extended key", "extendedKey", "[ REDACTED ]");
    const r = c[4], a = m(c.slice(5, 9)), x = parseInt(m(c.slice(9, 13)).substring(2), 16), s = m(c.slice(13, 45)), i = c.slice(45, 78);
    switch (m(c.slice(0, 4))) {
      case "0x0488b21e":
      case "0x043587cf": {
        const f = m(i);
        return new rt(me, bt(f), f, a, s, null, x, r, null);
      }
      case "0x0488ade4":
      case "0x04358394 ":
        if (i[0] !== 0)
          break;
        return new le(me, new we(i.slice(1)), a, s, null, x, r, null, null);
    }
    b(!1, "invalid extended key prefix", "extendedKey", "[ REDACTED ]");
  }
  /**
   *  Creates a new random HDNode.
   */
  static createRandom(t, c, r) {
    var x;
    t == null && (t = ""), c == null && (c = sn), r == null && (r = a0.wordlist());
    const a = H0.fromEntropy(Te(16), t, r);
    return Z(x = le, t0, X0).call(x, a.computeSeed(), a).derivePath(c);
  }
  /**
   *  Create an HD Node from %%mnemonic%%.
   */
  static fromMnemonic(t, c) {
    var r;
    return c || (c = sn), Z(r = le, t0, X0).call(r, t.computeSeed(), t).derivePath(c);
  }
  /**
   *  Creates an HD Node from a mnemonic %%phrase%%.
   */
  static fromPhrase(t, c, r, a) {
    var s;
    c == null && (c = ""), r == null && (r = sn), a == null && (a = a0.wordlist());
    const x = H0.fromPhrase(t, c, a);
    return Z(s = le, t0, X0).call(s, x.computeSeed(), x).derivePath(r);
  }
  /**
   *  Creates an HD Node from a %%seed%%.
   */
  static fromSeed(t) {
    var c;
    return Z(c = le, t0, X0).call(c, t, null);
  }
};
it = new WeakSet(), gn = function() {
  const t = { address: this.address, privateKey: this.privateKey }, c = this.mnemonic;
  return this.path && c && c.wordlist.locale === "en" && c.password === "" && (t.mnemonic = {
    path: this.path,
    locale: "en",
    entropy: c.entropy
  }), t;
}, t0 = new WeakSet(), X0 = function(t, c) {
  b(Uc(t), "invalid seed", "seed", "[REDACTED]");
  const r = g(t, "seed");
  b(r.length >= 16 && r.length <= 64, "invalid seed", "seed", "[REDACTED]");
  const a = g(x0("sha512", Os, r)), x = new we(m(a.slice(0, 32)));
  return new le(me, x, "0x00000000", m(a.slice(32)), "m", 0, 0, c, null);
}, R(le, t0);
let et = le;
class rt extends hn {
  /**
   *  @private
   */
  constructor(t, c, r, a, x, s, i, f, o) {
    super(c, o);
    /**
     *  The compressed public key.
     */
    B(this, "publicKey");
    /**
     *  The fingerprint.
     *
     *  A fingerprint allows quick qay to detect parent and child nodes,
     *  but developers should be prepared to deal with collisions as it
     *  is only 4 bytes.
     */
    B(this, "fingerprint");
    /**
     *  The parent node fingerprint.
     */
    B(this, "parentFingerprint");
    /**
     *  The chaincode, which is effectively a public key used
     *  to derive children.
     */
    B(this, "chainCode");
    /**
     *  The derivation path of this wallet.
     *
     *  Since extended keys do not provider full path details, this
     *  may be ``null``, if instantiated from a source that does not
     *  enocde it.
     */
    B(this, "path");
    /**
     *  The child index of this wallet. Values over ``2 *\* 31`` indicate
     *  the node is hardened.
     */
    B(this, "index");
    /**
     *  The depth of this wallet, which is the number of components
     *  in its path.
     */
    B(this, "depth");
    zt(t, me, "HDNodeVoidWallet"), fe(this, { publicKey: r });
    const d = En(M0(he(r)), 0, 4);
    fe(this, {
      publicKey: r,
      fingerprint: d,
      parentFingerprint: a,
      chainCode: x,
      path: s,
      index: i,
      depth: f
    });
  }
  connect(t) {
    return new rt(me, this.address, this.publicKey, this.parentFingerprint, this.chainCode, this.path, this.index, this.depth, t);
  }
  /**
   *  The extended key.
   *
   *  This key will begin with the prefix ``xpub`` and can be used to
   *  reconstruct this neutered key to derive its children addresses.
   */
  get extendedKey() {
    return T(this.depth < 256, "Depth too deep", "UNSUPPORTED_OPERATION", { operation: "extendedKey" }), pn(W([
      "0x0488B21E",
      _t(this.depth, 1),
      this.parentFingerprint,
      _t(this.index, 4),
      this.chainCode,
      this.publicKey
    ]));
  }
  /**
   *  Returns true if this wallet has a path, providing a Type Guard
   *  that the path is non-null.
   */
  hasPath() {
    return this.path != null;
  }
  /**
   *  Return the child for %%index%%.
   */
  deriveChild(t) {
    const c = Ae(t, "index");
    b(c <= 4294967295, "invalid index", "index", c);
    let r = this.path;
    r && (r += "/" + (c & ~$e), c & $e && (r += "'"));
    const { IR: a, IL: x } = _r(c, this.chainCode, this.publicKey, null), s = we.addPoints(x, this.publicKey, !0), i = bt(s);
    return new rt(me, i, s, this.fingerprint, m(a), r, c, this.depth + 1, this.provider);
  }
  /**
   *  Return the signer for %%path%% from this node.
   */
  derivePath(t) {
    return Mr(this, t);
  }
}
function Nc(n) {
  try {
    if (JSON.parse(n).encseed)
      return !0;
  } catch {
  }
  return !1;
}
function Tc(n, e) {
  const t = JSON.parse(n), c = lt(e), r = J($(t, "ethaddr:string!")), a = Ur($(t, "encseed:string!"));
  b(a && a.length % 16 === 0, "invalid encseed", "json", n);
  const x = g(_e(c, c, 2e3, 32, "sha256")).slice(0, 16), s = a.slice(0, 16), i = a.slice(16), f = new Fn(x, s), o = Ts(g(f.decrypt(i)));
  let d = "";
  for (let l = 0; l < o.length; l++)
    d += String.fromCharCode(o[l]);
  return { address: r, privateKey: jt(d) };
}
function kc(n) {
  return new Promise((e) => {
    setTimeout(() => {
      e();
    }, n);
  });
}
var ft, wn;
const qe = class qe extends $t {
  /**
   *  Create a new wallet for the %%privateKey%%, optionally connected
   *  to %%provider%%.
   */
  constructor(e, t) {
    typeof e == "string" && !e.startsWith("0x") && (e = "0x" + e);
    let c = typeof e == "string" ? new we(e) : e;
    super(c, t);
  }
  connect(e) {
    return new qe(this.signingKey, e);
  }
  /**
   *  Resolves to a [JSON Keystore Wallet](json-wallets) encrypted with
   *  %%password%%.
   *
   *  If %%progressCallback%% is specified, it will receive periodic
   *  updates as the encryption process progreses.
   */
  async encrypt(e, t) {
    const c = { address: this.address, privateKey: this.privateKey };
    return await Gr(c, e, { progressCallback: t });
  }
  /**
   *  Returns a [JSON Keystore Wallet](json-wallets) encryped with
   *  %%password%%.
   *
   *  It is preferred to use the [async version](encrypt) instead,
   *  which allows a [[ProgressCallback]] to keep the user informed.
   *
   *  This method will block the event loop (freezing all UI) until
   *  it is complete, which may be a non-trivial duration.
   */
  encryptSync(e) {
    const t = { address: this.address, privateKey: this.privateKey };
    return Hr(t, e);
  }
  /**
   *  Creates (asynchronously) a **Wallet** by decrypting the %%json%%
   *  with %%password%%.
   *
   *  If %%progress%% is provided, it is called periodically during
   *  decryption so that any UI can be updated.
   */
  static async fromEncryptedJson(e, t, c) {
    var a;
    let r = null;
    return Sc(e) ? r = await Rs(e, t, c) : Nc(e) && (c && (c(0), await kc(0)), r = Tc(e, t), c && (c(1), await kc(0))), Z(a = qe, ft, wn).call(a, r);
  }
  /**
   *  Creates a **Wallet** by decrypting the %%json%% with %%password%%.
   *
   *  The [[fromEncryptedJson]] method is preferred, as this method
   *  will lock up and freeze the UI during decryption, which may take
   *  some time.
   */
  static fromEncryptedJsonSync(e, t) {
    var r;
    let c = null;
    return Sc(e) ? c = vs(e, t) : Nc(e) ? c = Tc(e, t) : b(!1, "invalid JSON wallet", "json", "[ REDACTED ]"), Z(r = qe, ft, wn).call(r, c);
  }
  /**
   *  Creates a new random [[HDNodeWallet]] using the avavilable
   *  [cryptographic random source](randomBytes).
   *
   *  If there is no crytographic random source, this will throw.
   */
  static createRandom(e) {
    const t = et.createRandom();
    return e ? t.connect(e) : t;
  }
  /**
   *  Creates a [[HDNodeWallet]] for %%phrase%%.
   */
  static fromPhrase(e, t) {
    const c = et.fromPhrase(e);
    return t ? c.connect(t) : c;
  }
};
ft = new WeakSet(), wn = function(e) {
  if (b(e, "invalid JSON wallet", "json", "[ REDACTED ]"), "mnemonic" in e && e.mnemonic && e.mnemonic.locale === "en") {
    const c = H0.fromEntropy(e.mnemonic.entropy), r = et.fromMnemonic(c, e.mnemonic.path);
    if (r.address === e.address && r.privateKey === e.privateKey)
      return r;
    console.log("WARNING: JSON mismatch address/privateKey != mnemonic; fallback onto private key");
  }
  const t = new qe(e.privateKey);
  return b(t.address === e.address, "address/privateKey mismatch", "json", "[ REDACTED ]"), t;
}, R(qe, ft);
let mn = qe;
const vc = "t";
class Mt {
  constructor(e, t) {
    B(this, "x");
    B(this, "y");
    this.x = e, this.y = t;
  }
  static toRawFormat(e) {
    const t = e.split(vc);
    return new Mt(BigInt("0x" + t[0]), BigInt("0x" + t[1]));
  }
  static toHexString(e, t) {
    const c = e.toString(16), r = t.toString(16);
    return c + vc + r;
  }
}
class Rc {
  /**
   *
   * @param degree - coefficient of equation
   * @param secret - data to hide
   */
  constructor(e, t) {
    B(this, "degree");
    B(this, "secret");
    B(this, "params");
    this.secret = t, this.degree = e;
    const c = new BigUint64Array(this.degree), r = window.crypto.getRandomValues(c);
    this.params = [...r], this.params.push(t), this.degree || (this.params = null);
  }
  /**
   * compute result of equation
   */
  run(e, t = BigInt(this.degree)) {
    if (typeof t != "bigint")
      throw new Error('Validation Error:: Wrong Type for param "deg"');
    if (t === 0n)
      return this.params[this.params.length - 1];
    const c = this.params[this.degree - Number(t)] * e ** t, r = this.run(e, t - 1n);
    return c + r;
  }
}
class Ls extends Rc {
  constructor(e, t) {
    if (typeof t == "string" || typeof t == "number") {
      if (t = t.toString(), !He(t))
        throw new Error("Validation Error: provided secret is not valid type.");
      t = BigInt(t);
    }
    super(e, t);
  }
  /**
   *
   * @param n - fragment cnt to generate
   * @param k - minimum fragment count to recover
   * @returns
   */
  static createWalletFragment(e, t) {
    if (e < 2)
      throw new Error(
        "Validation Error: Share Count is less than 2. You won't be able to recover back."
      );
    const r = mn.createRandom().privateKey, a = new Rc(t, BigInt(r)), x = [], s = new BigUint64Array(
      a.degree + 1 >= e ? a.degree + 1 : e
    ), i = window.crypto.getRandomValues(s);
    for (const f of i) {
      const o = a.run(f, BigInt(a.degree));
      x.push(new Mt(f, o));
    }
    return x;
  }
  /**
   * Resolve PrivateKey Back
   */
  static recover(e, t = 0n) {
    const c = e.length;
    let r = 0n;
    for (let s = 0; s < c; s++) {
      let i = e[s].y, f = 1n;
      for (let d = 0; d < c; d++)
        d != s && (i = i * (t - e[d].x), f = f * (e[s].x - e[d].x));
      const o = i * BigInt(Math.pow(10, 18)) / f;
      r += o;
    }
    const a = r % BigInt(Math.pow(10, 18));
    let x = r / BigInt(Math.pow(10, 18));
    return Number(a.toString()[0]) >= 5 ? "0x" + (x + 1n).toString(16) : "0x" + x.toString(16);
  }
  /**
   * creates (degree + 1) count of fragment
   * @params {number} n - fragment count to generate. n should be higher than k (degree + 1) (default : degree + 1)
   * @returns Data[]
   */
  fragmentize(e = this.degree + 1) {
    if (!this.degree)
      throw new Error(
        "Validation Error:: seems Error occured while constructing Generator."
      );
    const t = [], c = new BigUint64Array(
      this.degree + 1 >= e ? this.degree + 1 : e
    ), r = window.crypto.getRandomValues(c);
    for (const a of r) {
      const x = this.run(a, BigInt(this.degree));
      t.push(new Mt(a, x));
    }
    return t;
  }
}
export {
  Mt as Data,
  Ls as Generator
};
