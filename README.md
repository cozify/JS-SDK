# cozify-sdk

> JavaScript SDK for Cozify REST API


### Usage

#### Browsers (should use iife-version)
```
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script type="text/javascript" src="../dist/sdk-browser.js"></script>
<script type="text/javascript">
      let state = CozifySDK.state;
      console.log(`Initial connection state now ${state.connectionState}`);

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
