export declare class Data {
    x: bigint;
    y: bigint;
    constructor(x: bigint, y: bigint);
    static toRawFormat(s: string): Data;
    static toHexString(x: bigint, y: bigint): string;
}
/**
 * Basic Linear Equation
 */
declare class Equation {
    degree: number;
    secret: bigint;
    params: any;
    /**
     *
     * @param degree - coefficient of equation
     * @param secret - data to hide
     */
    constructor(degree: number, secret: bigint);
    /**
     * compute result of equation
     */
    run(x: bigint, deg?: bigint): BigInt;
}
type HexString = string;
type Secretish = HexString | number | bigint;
export declare class Generator extends Equation {
    constructor(degree: number, secret: Secretish);
    /**
     *
     * @param n - fragment cnt to generate
     * @param k - minimum fragment count to recover
     * @returns
     */
    static createWalletFragment(n: number, k: number): string[];
    /**
     * Resolve PrivateKey Back
     */
    static recover(fragments: string[], point?: bigint): string;
    /**
     * creates (degree + 1) count of fragment
     * @params {number} n - fragment count to generate. n should be higher than k (degree + 1) (default : degree + 1)
     * @returns Data[]
     */
    fragmentize(n?: number): Promise<string[]>;
    static generateFragmentRecoveryPhase(fragment: string, password: string): Promise<string>;
    static recoverFragment(recoveryPhase: string, password: string): Promise<string>;
}
export {};
