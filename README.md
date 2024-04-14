# Fragment-key

Private Key Fragmentize & recover module.

Split your private key and share to trustworthies in case of losing your key!

![fragment drawio](https://github.com/dovigod/fragment/assets/30416914/b7498135-543f-4182-8dae-0064968a93d3)


## 🏃‍♂Usage

### Common (Initialization)

```
//node.js
import crypto from 'node:crypto'
import { Generator } from 'fragment-key'

Generator.initialize(crypto);
```

```
//Browser
import { Generator } from 'fragment-key'

Generator.initialize(window.crypto);
```

```
//Any custom Crypto library
import { Generator } from 'fragment-key'
import CustomCryptoLibrary from 'my-custom-library'

Generator.initialize(CustomCryptoLibrary);
```

\*\*\* NOTE Custom Crypto library should implement `CryptoModule` interface

### Create Fragments

```
const key = '123123123'
const gen = new Generator(3, key); // at least 3 fragment will be required to recover key
const fragments = await gen.fragmentize(10); // will generate 10 fragment

```

### recover

```
const myKey = Generator.recover(fragments);
```

### Create Fragment recovery phase

In case, forgetting fragment, generate your fragment recovery phase.
**You won't be able to find back your fragment if you lose recovery phase**

```
const recoveryPhase = await Generator.generateFragmentRecoveryPhase(fragment, password)

```

### Recover Fragment

```
  const fragment = await Generator.recoverFragment(recoveryPhase, password);
```
