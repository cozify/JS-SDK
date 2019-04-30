# cozify-sdk

> JavaScript SDK for Cozify REST API


### Usage

#### Browsers (should use iife-version)
```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script type="text/javascript" src="../dist/sdk-browser.js"></script>
<script type="text/javascript">
      let LANGUAGES = CozifySDK.LANGUAGES;
      let USER_STATES = CozifySDK.USER_STATES;
      console.info(`Initial user state ${CozifySDK.getUserState()}`);
      CozifySDK.changeLanguage(LANGUAGES.FI_FI);
      ... more in /browser-example

```

#### React-projects (should use es-version)
```
import { LANGUAGES, USER_STATES, getUserState } from 'cozify-sdk'
console.info(`Initial user state ${getUserState()}`);
CozifySDK.changeLanguage(LANGUAGES.FI_FI);

... more in /example

```

#### Node-projects (should use cjs-version)
```
const CozifySDK = require('../dist/sdk-node.js');
let LANGUAGES = CozifySDK.LANGUAGES;
let USER_STATES = CozifySDK.USER_STATES;
console.info(`Initial user state ${CozifySDK.getUserState()}`);
CozifySDK.changeLanguage(LANGUAGES.FI_FI);

... more in /node-example

```

## License

MIT © [cozify/JS-SDK]
