import { Generator, Data } from "../src/index";
import { ethers } from "ethers";
function pkEmitter() {
  const wallet = ethers.Wallet.createRandom();
  return wallet.privateKey;
}

// (async function () {
//   const pk = pkEmitter();
//   const gen = new Generator(3, pk);
//   const fragments = await gen.fragmentize(10);

//   console.log("10 Fragment & least required fragment = 4");
//   console.log("-- should Recover Private Key --");

//   console.log("private Key : ", pk);
//   console.log(fragments);

//   const a = await Generator.generateFragmentRecoveryPhase(fragments[0], "123");
//   console.log(a);
//   const x = await Generator.recoverFragment(a, "123");
//   console.log(x);

//   console.log("with 1 fragment..");
//   let collections = fragments.slice(0, 1);
//   let result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 2 fragment..");
//   collections = fragments.slice(0, 2);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 3 fragment..");
//   collections = fragments.slice(0, 3);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 4 fragment..");
//   collections = fragments.slice(0, 4);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 5 fragment..");
//   collections = fragments.slice(0, 5);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 6 fragment..");
//   collections = fragments.slice(0, 6);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 7 fragment..");
//   collections = fragments.slice(0, 7);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 8 fragment..");
//   collections = fragments.slice(0, 8);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 9 fragment..");
//   collections = fragments.slice(0, 9);
//   result = Generator.recover(collections);
//   console.log(result === pk);

//   console.log("with 10 fragment..");
//   collections = fragments.slice(0, 10);
//   result = Generator.recover(collections);
//   console.log(result === pk);
// })();

// console.log("-----------------------");

// (function () {
//   console.log("should generate Wallet & Fragment instantly.");
//   const fragments = Generator.createWalletFragment(10, 3);
//   const pkList: any = [];

//   for (let i = 1; i <= 10; i++) {
//     const pk = Generator.recover(fragments.slice(0, i));
//     pkList.push(pk);
//   }

//   console.log(pkList);
// })();

(async function () {
  const secret =
    "0x4bdc763aa9bcce4650081fc1d4f85c4e0a4621c5975ff8d2c4b398178ba0cc2f";
  const gen = new Generator(3, secret);
  const frags = await gen.fragmentize(5);
  console.log(frags);
  const recovered = await Generator.recover([frags[0], frags[2], frags[4]]);

  console.log(recovered);
})();
