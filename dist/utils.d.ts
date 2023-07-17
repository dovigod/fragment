export declare function toHexString(arraybuffer: ArrayBuffer): string;
export declare function hex2Array(hexStr: string, length?: number): Uint8Array;
export declare function sha256(text: string): Promise<string>;
export declare function aesGcmEncrypt(privateKey: string, password: string): Promise<string[]>;
export declare function aesGcmDecrypt(encryptedSecret: string, password: string): Promise<string>;
