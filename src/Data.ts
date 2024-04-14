// To determine boundary of x coord and y coord data since hexadecimalized data can't have value bigger than 'f', we can use arbitrary alphabet with higher index that 'f'
const identifier = "t";

export class Data {
  x: bigint;
  y: bigint;
  constructor(x: bigint, y: bigint) {
    this.x = x;
    this.y = y;
  }

  public static toRawFormat(s: string) {
    const p = s.split(identifier);
    return new Data(BigInt("0x" + p[0]), BigInt("0x" + p[1]));
  }
  public static toHexString(x: bigint, y: bigint) {
    const leftHand = x.toString(16);
    const rightHand = y.toString(16);
    return leftHand + identifier + rightHand;
  }
}
