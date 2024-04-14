import chai from "chai";
import crypto from "node:crypto";
import { Generator } from "../src/index";
import { ethers } from "ethers";

const assert = chai.assert;

let privateKey: string;
let fragmentCnt: number;
let recoveryCnt: number;

let generator: Generator;

describe("==== Module Test =====", () => {
  before(() => {
    Generator.initialize(crypto);
    privateKey = ethers.Wallet.createRandom().privateKey;

    recoveryCnt = Math.floor(Math.random() * 20) + 2;
    fragmentCnt = Math.floor(Math.random() * 20) + recoveryCnt;

    generator = new Generator(recoveryCnt, privateKey);
  });

  context("When createWalletFragment is called", () => {
    it(`should get fragments of length ${fragmentCnt}`, () => {
      const fragments = generator.createWalletFragment(fragmentCnt);
      assert.equal(fragments.length, fragmentCnt);
    });
  });

  context("When recover is called", () => {
    it(`should return privateKey when provided fragments are equal to recoveryCnt(${recoveryCnt})`, () => {
      const fragments = generator.createWalletFragment(fragmentCnt);
      const recoverRes = generator.recover(fragments.slice(0, recoveryCnt));
      assert.equal(recoverRes, privateKey);
    });

    it(`should return privateKey when provided fragments are greater to recoveryCnt(${recoveryCnt})`, () => {
      const fragments = generator.createWalletFragment(fragmentCnt);
      const recoverRes = generator.recover(fragments);
      assert.equal(recoverRes, privateKey);
    });
    it(`should return arbitrary string which isn't privateKey when provided fragments are lesser than recoveryCnt(${recoveryCnt})`, () => {
      const fragments = generator.createWalletFragment(fragmentCnt);
      const recoverRes = generator.recover(
        fragments.slice(0, Math.floor(recoveryCnt / 2))
      );
      assert.notEqual(recoverRes, privateKey);
    });
  });
});
