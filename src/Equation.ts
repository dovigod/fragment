import { CryptoUtil } from "./crypto";

/**
 * Basic Polynominal Equation
 */
export class Equation {
  degree: number;
  secret: bigint;
  params: any;
  /**
   *
   * @param degree - coefficient of equation
   * @param secret - data to hide
   */
  constructor(degree: number, secret: bigint, cryptoUtil: CryptoUtil) {
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
  run(x: bigint, deg = BigInt(this.degree)): BigInt {
    if (typeof deg !== "bigint") {
      throw new Error('Validation Error:: Wrong Type for param "deg"');
    }
    if (deg === 0n) {
      return this.params[this.params.length - 1];
    }
    const value = this.params[this.degree - Number(deg)] * x ** deg;
    const stack = this.run(x, deg - 1n) as bigint;
    return value + stack;
  }
}
