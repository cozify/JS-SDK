# cozify-sdk

> JavaScript SDK for Cozify REST API




## Usage

```browsers (should use iife-version)
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script type="text/javascript" src="../dist/sdk-browser.js"></script>
<script type="text/javascript">
      let state = CozifySDK.state;
      console.log(`Initial connection state now ${state.connectionState}`);
      ...
</script>
 (more in /browser-example)
```

```react-projects (should use es-version)
import { state } from 'cozify-sdk'
console.log(`Initial connection state now ${state.connectionState}`);
...
(...more in /example)
```

```node-projects (should use cjs-version)
import { state } from 'cozify-sdk'
console.log(`Initial connection state now ${state.connectionState}`);
...
(... more in /node-example)
```

## License

MIT © [tech-admin](https://github.com/tech-admin)
