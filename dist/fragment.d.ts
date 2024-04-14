import { CryptoModule } from "./crypto";
import { Equation } from "./Equation";
type HexString = string;
type Secretish = HexString | number | bigint;
type Fragment = string;
export declare class Generator extends Equation {
    recoveryCnt: number;
    private static cryptoUtil;
    static initialize(cryptoModule: CryptoModule): Promise<void>;
    constructor(recoveryCnt: number, secret: Secretish);
    /**
     *
     * @param fragmentCnt - Numbers of fragment to generate
     * @returns Fragments[]
     */
    createWalletFragment(fragmentCnt: number): string[];
    /**
     * Resolve PrivateKey Back
     */
    recover(fragments: Fragment[], point?: bigint): string;
    /**
     * creates k(degree + 1) count of fragment
     * @params {number} n - fragment count to generate. n should be higher than k (degree + 1) (default : degree + 1)
     * @returns Data[]
     */
    fragmentize(n?: number): Promise<string[]>;
    static generateFragmentRecoveryPhase(fragment: string, password: string): Promise<string>;
    static recoverFragment(recoveryPhase: string, password: string): Promise<string>;
}
export {};
