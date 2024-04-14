export declare class Data {
    x: bigint;
    y: bigint;
    constructor(x: bigint, y: bigint);
    static toRawFormat(s: string): Data;
    static toHexString(x: bigint, y: bigint): string;
}
