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
import { state } from 'cozify-sdk'
console.log(`Initial connection state now ${state.connectionState}`);

... more in /example

```

#### Node-projects (should use cjs-version)
```
import { state } from 'cozify-sdk'
console.log(`Initial connection state now ${state.connectionState}`);

... more in /node-example

```

## License

MIT © [cozify/JS-SDK]
