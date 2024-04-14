import {
  cryptoFactory,
  CryptoModule,
  CryptoUtil,
  BuiltInCryptoModule,
} from "./crypto";
import { Equation } from "./Equation";
import { Data } from "./Data";

type HexString = string;
type Secretish = HexString | number | bigint;
type Fragment = string;

export class Generator extends Equation {
  public recoveryCnt: number;
  private static cryptoUtil: CryptoUtil;

  public static async initialize(
    cryptoModule: CryptoModule | BuiltInCryptoModule
  ) {
    Generator.cryptoUtil = cryptoFactory(cryptoModule);
  }

  constructor(recoveryCnt: number, secret: Secretish) {
    if (typeof secret === "string" || typeof secret === "number") {
      secret = secret.toString();
      const isHex = Generator.cryptoUtil.isHexString(secret);
      if (!isHex) {
        throw new Error("Validation Error: provided secret is not valid type.");
      }
      secret = BigInt(secret);
    }
    super(recoveryCnt - 1, secret || 0n, Generator.cryptoUtil);
    this.recoveryCnt = recoveryCnt;
  }

  /**
   *
   * @param fragmentCnt - Numbers of fragment to generate
   * @returns Fragments[]
   */
  public createWalletFragment(fragmentCnt: number) {
    if (fragmentCnt < 2 || fragmentCnt < this.recoveryCnt) {
      throw new Error(
        "Validation Error: Fragment Count is less than recoveryCnt. You won't be able to recover back."
      );
    }
    const fragments = [];

    const rawXDomain = new BigUint64Array(fragmentCnt);
    const xDomain = Generator.cryptoUtil.getRandomValues(rawXDomain);
    for (const x of xDomain) {
      const correspondingY = this.run(x, BigInt(this.degree));
      fragments.push(new Data(x, correspondingY as bigint));
    }
    const stringedFragments = [];
    for (let i = 0; i < fragments.length; i++) {
      stringedFragments[i] =
        fragments[i].x!.toString(16) + "Z" + fragments[i].y!.toString(16);
    }
    return stringedFragments;
  }
  /**
   * Resolve PrivateKey Back
   */
  public recover(fragments: Fragment[], point = 0n) {
    const dataFragments = fragments.map((fragment: string) => {
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
      const term = (termY * BigInt(Math.pow(10, 18))) / termX;
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
    const fragments: Data[] = [];
    const rawXDomain = new BigUint64Array(
      this.recoveryCnt >= n ? this.recoveryCnt : n
    );

    const xDomain = Generator.cryptoUtil.getRandomValues(rawXDomain);

    for (const x of xDomain) {
      const correspondingY = this.run(x, BigInt(this.degree));
      fragments.push(new Data(x, correspondingY as bigint));
    }
    const stringedFragments: Fragment[] = [];
    for (let i = 0; i < fragments.length; i++) {
      stringedFragments[i] =
        fragments[i].x!.toString(16) + "Z" + fragments[i].y!.toString(16);
    }
    return stringedFragments;
  }

  public static async generateFragmentRecoveryPhase(
    fragment: string,
    password: string
  ) {
    const [recoveryPhase] = await Generator.cryptoUtil.aesGcmEncrypt(
      fragment,
      password
    );
    return recoveryPhase;
  }
  public static async recoverFragment(recoveryPhase: string, password: string) {
    const fragment = await Generator.cryptoUtil.aesGcmDecrypt(
      recoveryPhase,
      password
    );
    return fragment;
  }
}
