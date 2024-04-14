var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const PREFIX = "fragment";
const SEPERATOR = "|";
function toHexString(arraybuffer) {
  const iterableArray = new Uint8Array(arraybuffer);
  let hexStr = "";
  iterableArray.map((elem) => {
    let hex = elem.toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hexStr += hex;
    return elem.toString(16);
  });
  return hexStr;
}
function hex2Array(hexStr, length = 32) {
  const typedArray = new Uint8Array(length);
  let carry = 0;
  while (hexStr) {
    const hex = hexStr.slice(0, 2);
    hexStr = hexStr.slice(2);
    typedArray[carry] = parseInt(hex, 16);
    carry++;
  }
  return typedArray;
}
async function sha256(crypto, text) {
  const bytish = new TextEncoder().encode(text);
  const hashedByte = await crypto.sha256(bytish);
  const hashedText = toHexString(hashedByte);
  return hashedText;
}
async function aesGcmEncrypt(crypto, privateKey, password) {
  const cipherableText = PREFIX + SEPERATOR + privateKey;
  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await crypto.sha256(pwUtf8);
  const iv = hex2Array(
    "6531fe7437af1902b61766f8b1359386ccdf9032cbbf10ad8b0a50d7ce1d8dee",
    32
  ).buffer;
  const hashedDkey = toHexString(pwHash);
  const alg = { name: "AES-GCM", iv };
  const key = await crypto.importKey(pwHash, alg);
  window.crypto.subtle.importKey;
  const ptUint8 = new TextEncoder().encode(cipherableText);
  const ctBuffer = await crypto.encrypt(alg, key, ptUint8);
  const encryptedSecret = toHexString(ctBuffer);
  return [encryptedSecret, hashedDkey];
}
async function aesGcmDecrypt(crypto, encryptedSecret, password) {
  const iv = hex2Array(
    "6531fe7437af1902b61766f8b1359386ccdf9032cbbf10ad8b0a50d7ce1d8dee",
    32
  ).buffer;
  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await crypto.sha256(pwUtf8);
  const alg = { name: "AES-GCM", iv };
  const key = await crypto.importKey(pwHash, alg);
  const ctUint8 = hex2Array(encryptedSecret, encryptedSecret.length / 2);
  try {
    const plainBuffer = await window.crypto.subtle.decrypt(
      alg,
      key,
      ctUint8.buffer
    );
    const plaintext = new TextDecoder().decode(plainBuffer);
    const privateKeyValidationList = plaintext.split(SEPERATOR);
    if (privateKeyValidationList[0] !== PREFIX) {
      throw new Error("Fragment Recover Failed");
    }
    privateKeyValidationList.shift();
    const privateKey = privateKeyValidationList[0];
    return privateKey;
  } catch (e) {
    throw new Error("Fragment Recover Failed");
  }
}
function isHexString(value, length) {
  if (typeof value !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }
  if (typeof length === "number" && value.length !== 2 + 2 * length) {
    return false;
  }
  if (length === true && value.length % 2 !== 0) {
    return false;
  }
  return true;
}
function cryptoFactory(crypto) {
  const cryptoModule = initializeCryptoModule(crypto);
  return {
    isHexString,
    aesGcmDecrypt: aesGcmDecrypt.bind(cryptoModule._context, cryptoModule),
    aesGcmEncrypt: aesGcmEncrypt.bind(cryptoModule._context, cryptoModule),
    sha256: sha256.bind(cryptoModule._context, cryptoModule),
    hex2Array,
    toHexString,
    getRandomValues: cryptoModule.getRandomValues.bind(cryptoModule._context),
    _context: cryptoModule
  };
}
const initializeCryptoModule = (cryptoModule) => {
  let crypto = cryptoModule;
  if ("window" in globalThis) {
    crypto = refineBuiltInCryptoModule("browser", cryptoModule);
  } else if (typeof process === "object") {
    crypto = refineBuiltInCryptoModule("node", cryptoModule);
  }
  return crypto;
};
function refineBuiltInCryptoModule(env, cryptoModule) {
  console.log("hi");
  if (env === "browser") {
    console.log("hit");
    return {
      getRandomValues: cryptoModule.getRandomValues,
      sha256: (data) => cryptoModule.subtle.digest("SHA-256", data),
      encrypt: cryptoModule.subtle.encrypt,
      decrypt: cryptoModule.subtle.decrypt,
      importKey: (data, aesgcmAlgorithmParam) => cryptoModule.subtle.importKey("raw", data, aesgcmAlgorithmParam, true, [
        "encrypt",
        "decrypt"
      ]),
      _context: cryptoModule
    };
  }
  if (env === "node") {
    return {
      getRandomValues: cryptoModule.webcrypto.getRandomValues,
      sha256: (data) => cryptoModule.webcrypto.subtle.digest("SHA-256", data),
      encrypt: cryptoModule.webcrypto.subtle.encrypt,
      decrypt: cryptoModule.webcrypto.subtle.decrypt,
      importKey: (data, aesgcmAlgorithmParam) => cryptoModule.webcrypto.subtle.importKey(
        "raw",
        data,
        aesgcmAlgorithmParam,
        true,
        ["encrypt", "decrypt"]
      ),
      _context: cryptoModule
    };
  }
}
class Equation {
  /**
   *
   * @param degree - coefficient of equation
   * @param secret - data to hide
   */
  constructor(degree, secret, cryptoUtil) {
    __publicField(this, "degree");
    __publicField(this, "secret");
    __publicField(this, "params");
    this.secret = secret;
    this.degree = degree - 1;
    const rawParams = new BigUint64Array(this.degree);
    const params = cryptoUtil.getRandomValues(rawParams);
    this.params = [...params];
    this.params.push(secret);
    if (!this.degree) {
      this.params = null;
    }
  }
  /**
   * compute result of equation
   */
  run(x, deg = BigInt(this.degree)) {
    if (typeof deg !== "bigint") {
      throw new Error('Validation Error:: Wrong Type for param "deg"');
    }
    if (deg === 0n) {
      return this.params[this.params.length - 1];
    }
    const value = this.params[this.degree - Number(deg)] * x ** deg;
    const stack = this.run(x, deg - 1n);
    return value + stack;
  }
}
const identifier = "t";
class Data {
  constructor(x, y) {
    __publicField(this, "x");
    __publicField(this, "y");
    this.x = x;
    this.y = y;
  }
  static toRawFormat(s) {
    const p = s.split(identifier);
    return new Data(BigInt("0x" + p[0]), BigInt("0x" + p[1]));
  }
  static toHexString(x, y) {
    const leftHand = x.toString(16);
    const rightHand = y.toString(16);
    return leftHand + identifier + rightHand;
  }
}
const _Generator = class _Generator extends Equation {
  constructor(recoveryCnt, secret) {
    if (typeof secret === "string" || typeof secret === "number") {
      secret = secret.toString();
      const isHex = _Generator.cryptoUtil.isHexString(secret);
      if (!isHex) {
        throw new Error("Validation Error: provided secret is not valid type.");
      }
      secret = BigInt(secret);
    }
    super(recoveryCnt - 1, secret || 0n, _Generator.cryptoUtil);
    __publicField(this, "recoveryCnt");
    this.recoveryCnt = recoveryCnt;
  }
  static async initialize(cryptoModule) {
    _Generator.cryptoUtil = cryptoFactory(cryptoModule);
  }
  /**
   *
   * @param fragmentCnt - Numbers of fragment to generate
   * @returns Fragments[]
   */
  createWalletFragment(fragmentCnt) {
    if (fragmentCnt < 2 || fragmentCnt < this.recoveryCnt) {
      throw new Error(
        "Validation Error: Fragment Count is less than recoveryCnt. You won't be able to recover back."
      );
    }
    const fragments = [];
    const rawXDomain = new BigUint64Array(fragmentCnt);
    const xDomain = _Generator.cryptoUtil.getRandomValues(rawXDomain);
    for (const x of xDomain) {
      const correspondingY = this.run(x, BigInt(this.degree));
      fragments.push(new Data(x, correspondingY));
    }
    const stringedFragments = [];
    for (let i = 0; i < fragments.length; i++) {
      stringedFragments[i] = fragments[i].x.toString(16) + "Z" + fragments[i].y.toString(16);
    }
    return stringedFragments;
  }
  /**
   * Resolve PrivateKey Back
   */
  recover(fragments, point = 0n) {
    const dataFragments = fragments.map((fragment) => {
      const d = fragment.split("Z");
      return new Data(BigInt("0x" + d[0]), BigInt("0x" + d[1]));
    });
    const fragCnt = dataFragments.length;
    let result = 0n;
    for (let i = 0; i < fragCnt; i++) {
      let termY = dataFragments[i].y;
      let termX = 1n;
      for (let j = 0; j < fragCnt; j++) {
        if (j != i) {
          termY = termY * (point - dataFragments[j].x);
          termX = termX * (dataFragments[i].x - dataFragments[j].x);
        }
      }
      const term = termY * BigInt(Math.pow(10, 18)) / termX;
      result += term;
    }
    const offset = result % BigInt(Math.pow(10, 18));
    let recoveredPK = result / BigInt(Math.pow(10, 18));
    if (Number(offset.toString()[0]) >= 5) {
      return "0x" + (recoveredPK + 1n).toString(16);
    }
    return "0x" + recoveredPK.toString(16);
  }
  /**
   * creates k(degree + 1) count of fragment
   * @params {number} n - fragment count to generate. n should be higher than k (degree + 1) (default : degree + 1)
   * @returns Data[]
   */
  async fragmentize(n = this.recoveryCnt) {
    const fragments = [];
    const rawXDomain = new BigUint64Array(
      this.recoveryCnt >= n ? this.recoveryCnt : n
    );
    const xDomain = _Generator.cryptoUtil.getRandomValues(rawXDomain);
    for (const x of xDomain) {
      const correspondingY = this.run(x, BigInt(this.degree));
      fragments.push(new Data(x, correspondingY));
    }
    const stringedFragments = [];
    for (let i = 0; i < fragments.length; i++) {
      stringedFragments[i] = fragments[i].x.toString(16) + "Z" + fragments[i].y.toString(16);
    }
    return stringedFragments;
  }
  static async generateFragmentRecoveryPhase(fragment, password) {
    const [recoveryPhase] = await _Generator.cryptoUtil.aesGcmEncrypt(
      fragment,
      password
    );
    return recoveryPhase;
  }
  static async recoverFragment(recoveryPhase, password) {
    const fragment = await _Generator.cryptoUtil.aesGcmDecrypt(
      recoveryPhase,
      password
    );
    return fragment;
  }
};
__publicField(_Generator, "cryptoUtil");
let Generator = _Generator;
export {
  Data,
  Generator
};
