/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CryptoUtil {
  isHexString: (data: any, length?: boolean) => boolean;
  aesGcmDecrypt: (encryptedSecret: string, password: string) => Promise<string>;
  aesGcmEncrypt: (privateKey: string, password: string) => Promise<string[]>;
  sha256: (data: string) => Promise<string>;
  hex2Array: (data: string) => ArrayBuffer | Uint8Array;
  toHexString: (data: ArrayBuffer) => string;
  getRandomValues: (array: any) => any;
  _context: any;
}

export interface CryptoModule {
  getRandomValues: (array: BigUint64Array) => BigUint64Array;
  sha256: (...params: any) => Promise<ArrayBuffer>;
  importKey: (
    data: ArrayBuffer,
    aesgcmAlgorithmParam: SimplifiedAesKeyAlgo
  ) => Promise<CryptoKey>;
  encrypt: (...params: any) => Promise<ArrayBuffer>;
  decrypt: (...params: any) => Promise<ArrayBuffer>;
  _context?: any;
}

export type BuiltInCryptoModule = any;

interface SimplifiedAesKeyAlgo {
  name: string;
  iv: ArrayBufferLike;
}
const PREFIX = "fragment";
const SEPERATOR = "|";

export function toHexString(arraybuffer: ArrayBuffer) {
  const iterableArray: any = new Uint8Array(arraybuffer);
  let hexStr = "";
  iterableArray.map((elem: number) => {
    let hex = elem.toString(16);
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    hexStr += hex;
    return elem.toString(16);
  });
  return hexStr;
}
export function hex2Array(hexStr: string, length = 32) {
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
export async function sha256(crypto: CryptoModule, text: string) {
  const bytish = new TextEncoder().encode(text);
  // const hashedByte = await crypto.subtle.digest("SHA-256", bytish);
  const hashedByte = await crypto.sha256(bytish);
  const hashedText = toHexString(hashedByte);
  return hashedText;
}

// encrype privateKey using AES-GCM with FIXED initial vector (iv)
export async function aesGcmEncrypt(
  crypto: CryptoModule,
  privateKey: string,
  password: string
) {
  const cipherableText = PREFIX + SEPERATOR + privateKey;
  const pwUtf8 = new TextEncoder().encode(password);
  // const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
  const pwHash = await crypto.sha256(pwUtf8);
  const iv = hex2Array(
    "6531fe7437af1902b61766f8b1359386ccdf9032cbbf10ad8b0a50d7ce1d8dee",
    32
  ).buffer;
  const hashedDkey = toHexString(pwHash);

  const alg = { name: "AES-GCM", iv: iv };
  const key = await crypto.importKey(pwHash, alg);
  window.crypto.subtle.importKey;
  const ptUint8 = new TextEncoder().encode(cipherableText);
  // const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);
  const ctBuffer = await crypto.encrypt(alg, key, ptUint8);
  const encryptedSecret = toHexString(ctBuffer);
  return [encryptedSecret, hashedDkey];
}

export async function aesGcmDecrypt(
  crypto: CryptoModule,
  encryptedSecret: string,
  password: string
) {
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

export function isHexString(value: any, length?: number | boolean) {
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

export function cryptoFactory(crypto: CryptoModule, isBuiltIn?: boolean) {
  const cryptoModule = initializeCryptoModule(crypto, isBuiltIn);
  return {
    isHexString,
    aesGcmDecrypt: aesGcmDecrypt.bind(cryptoModule._context, cryptoModule),
    aesGcmEncrypt: aesGcmEncrypt.bind(cryptoModule._context, cryptoModule),
    sha256: sha256.bind(cryptoModule._context, cryptoModule),
    hex2Array,
    toHexString,
    getRandomValues: cryptoModule.getRandomValues.bind(cryptoModule._context),
    _context: cryptoModule,
  } as CryptoUtil;
}

const initializeCryptoModule = (
  cryptoModule: CryptoModule | BuiltInCryptoModule,
  isBuiltIn?: boolean
) => {
  let crypto = cryptoModule;

  if ("window" in globalThis && isBuiltIn) {
    crypto = refineBuiltInCryptoModule("browser", cryptoModule) as CryptoModule;
  } else if (typeof process === "object" && isBuiltIn) {
    crypto = refineBuiltInCryptoModule("node", cryptoModule) as CryptoModule;
  }
  return crypto as CryptoModule;
};

function refineBuiltInCryptoModule(env: "browser" | "node", cryptoModule: any) {
  if (env === "browser") {
    return {
      getRandomValues: cryptoModule.getRandomValues,
      sha256: (data: Uint8Array) => cryptoModule.subtle.digest("SHA-256", data),
      encrypt: cryptoModule.subtle.encrypt,
      decrypt: cryptoModule.subtle.decrypt,
      importKey: (
        data: BufferSource,
        aesgcmAlgorithmParam: SimplifiedAesKeyAlgo
      ) =>
        cryptoModule.subtle.importKey("raw", data, aesgcmAlgorithmParam, true, [
          "encrypt",
          "decrypt",
        ]),
      _context: cryptoModule,
    } as CryptoModule;
  }

  if (env === "node") {
    return {
      getRandomValues: cryptoModule.webcrypto.getRandomValues,
      sha256: (data: Uint8Array) =>
        cryptoModule.webcrypto.subtle.digest("SHA-256", data),
      encrypt: cryptoModule.webcrypto.subtle.encrypt,
      decrypt: cryptoModule.webcrypto.subtle.decrypt,
      importKey: (
        data: BufferSource,
        aesgcmAlgorithmParam: SimplifiedAesKeyAlgo
      ) =>
        cryptoModule.webcrypto.subtle.importKey(
          "raw",
          data,
          aesgcmAlgorithmParam,
          true,
          ["encrypt", "decrypt"]
        ),
      _context: cryptoModule.webcrypto,
    } as CryptoModule;
  }
}
