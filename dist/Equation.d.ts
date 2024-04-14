import { CryptoUtil } from "./crypto";
/**
 * Basic Polynominal Equation
 */
export declare class Equation {
    degree: number;
    secret: bigint;
    params: any;
    /**
     *
     * @param degree - coefficient of equation
     * @param secret - data to hide
     */
    constructor(degree: number, secret: bigint, cryptoUtil: CryptoUtil);
    /**
     * compute result of equation
     */
    run(x: bigint, deg?: bigint): BigInt;
}
