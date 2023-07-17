const { describe } = require("node:test");
const { ethers } = require("ethers");
import { Generator } from ("../src/index");
function pkEmitter() {
  const wallet = ethers.Wallet.createRandom();
  return wallet.privateKey;
}

describe("should recover privateKey with given k", () => {
  const pk = pkEmitter();
  const gen = Generator(3, pk);
  const fragments = gen.fragmentize(10);

  test(" case :: n = 10 , k = 3, should recover privatekey with 3 fragment", () => {
    const collections = fragments.slice(0, 3);

    const result = gen.recover(collections);
    console.log(result);
    expect(result).toEqual(pk);
  });
});
