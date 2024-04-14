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
    importKey: (data: ArrayBuffer, aesgcmAlgorithmParam: SimplifiedAesKeyAlgo) => Promise<CryptoKey>;
    encrypt: (...params: any) => Promise<ArrayBuffer>;
    decrypt: (...params: any) => Promise<ArrayBuffer>;
    _context?: any;
}
export type BuiltInCryptoModule = any;
interface SimplifiedAesKeyAlgo {
    name: string;
    iv: ArrayBufferLike;
}
export declare function toHexString(arraybuffer: ArrayBuffer): string;
export declare function hex2Array(hexStr: string, length?: number): Uint8Array;
export declare function sha256(crypto: CryptoModule, text: string): Promise<string>;
export declare function aesGcmEncrypt(crypto: CryptoModule, privateKey: string, password: string): Promise<string[]>;
export declare function aesGcmDecrypt(crypto: CryptoModule, encryptedSecret: string, password: string): Promise<string>;
export declare function isHexString(value: any, length?: number | boolean): boolean;
export declare function cryptoFactory(crypto: CryptoModule): CryptoUtil;
export {};
