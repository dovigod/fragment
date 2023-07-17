
# Fragment-key

Private Key Fragmentize & recover module.

Split your private key and share with others!🙉

As long as you keep your fragment, you'll treated as **VIP** by other co-sharers⭐️

Shamir , Elliptic curve , two-way enctyption algorith used.

## 🏃‍♂Usage

### Create Fragments
````
const key = '123123123'
const gen = new Generator(3, key); // at least 3 fragment will be required to recover key
const fragments = await gen.fragmentize(10); // will generate 10 fragment

````

### recover
````
const myKey = Generator.recover(fragments); 
````

### Create Fragment recovery phase

In case, forgetting fragment, generate your fragment recovery phase.
**You won't be able to find back your fragment if you lose recovery phase**

````
const recoveryPhase = await Generator.generateFragmentRecoveryPhase(fragment, password)

````

### Recover Fragment
````
  const fragment = await Generator.recoverFragment(recoveryPhase, password);
````



