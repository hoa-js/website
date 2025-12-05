---
url: /middleware/secure-headers/permission-policy.md
---
# Permission-Policy

The Permission-Policy middleware sets the `Permissions-Policy` header to control which browser features and APIs can be used in the browser.

## Quick Start

```js
import { Hoa } from 'hoa'
import { permissionPolicy } from '@hoajs/secure-headers'

const app = new Hoa()

// Disable geolocation and microphone
app.use(permissionPolicy({
  geolocation: false,
  microphone: false
}))

app.use(async (ctx) => {
  ctx.res.body = 'Hello, Hoa!'
})

export default app
```

## Options

The options object accepts feature names as keys with the following value types:

| Value Type | Description | Example |
| --- | --- | --- |
| `boolean` | `true` allows all origins (`*`), `false` denies all origins | `camera: false` |
| `string[]` | Array of allowed origins. Special values: `'self'`, `'src'`, `'none'`, `'*'` | `geolocation: ['self', 'https://example.com']` |

## Available Features

### Standardized Features

* `accelerometer`, `ambientLightSensor`, `attributionReporting`, `autoplay`, `battery`, `bluetooth`, `camera`, `chUa`, `chUaArch`, `chUaBitness`, `chUaFullVersion`, `chUaFullVersionList`, `chUaMobile`, `chUaModel`, `chUaPlatform`, `chUaPlatformVersion`, `chUaWow64`, `computePressure`, `crossOriginIsolated`, `directSockets`, `displayCapture`, `encryptedMedia`, `executionWhileNotRendered`, `executionWhileOutOfViewport`, `fullscreen`, `geolocation`, `gyroscope`, `hid`, `identityCredentialsGet`, `idleDetection`, `keyboardMap`, `magnetometer`, `microphone`, `midi`, `navigationOverride`, `payment`, `pictureInPicture`, `publickeyCredentialsGet`, `screenWakeLock`, `serial`, `storageAccess`, `syncXhr`, `usb`, `webShare`, `windowManagement`, `xrSpatialTracking`

### Proposed Features

* `clipboardRead`, `clipboardWrite`, `gamepad`, `sharedAutofill`, `speakerSelection`

### Experimental Features

* `allScreensCapture`, `browsingTopics`, `capturedSurfaceControl`, `conversionMeasurement`, `digitalCredentialsGet`, `focusWithoutUserActivation`, `joinAdInterestGroup`, `localFonts`, `runAdAuction`, `smartCard`, `syncScript`, `trustTokenRedemption`, `unload`, `verticalScroll`

## Examples

### Disable Specific Features

```js
app.use(permissionPolicy({
  geolocation: false,
  microphone: false,
  camera: false,
  payment: false
}))
```

### Allow Features for Self Only

```js
app.use(permissionPolicy({
  geolocation: ['self'],
  camera: ['self'],
  microphone: ['self']
}))
```

### Allow Features for Specific Origins

```js
app.use(permissionPolicy({
  geolocation: ['self', 'https://maps.example.com'],
  camera: ['self', 'https://video.example.com'],
  payment: ['self', 'https://checkout.example.com']
}))
```

### Allow All Origins for Specific Features

```js
app.use(permissionPolicy({
  fullscreen: true,
  pictureInPicture: true
}))
```

### Mixed Configuration

```js
app.use(permissionPolicy({
  // Allow all origins
  fullscreen: true,
  // Allow self only
  geolocation: ['self'],
  camera: ['self'],
  // Allow specific origins
  payment: ['self', 'https://payment-provider.com'],
  // Deny all
  microphone: false,
  usb: false,
  bluetooth: false
}))
```

### Strict Privacy Configuration

```js
app.use(permissionPolicy({
  accelerometer: false,
  ambientLightSensor: false,
  battery: false,
  camera: false,
  geolocation: false,
  gyroscope: false,
  magnetometer: false,
  microphone: false,
  payment: false,
  usb: false
}))
```

### Content Site Configuration

```js
app.use(permissionPolicy({
  autoplay: ['self'],
  fullscreen: ['self'],
  pictureInPicture: ['self'],
  // Disable unnecessary features
  camera: false,
  microphone: false,
  geolocation: false,
  payment: false
}))
```

## Directive Naming

Directive names can be specified in camelCase or kebab-case:

```js
// These are equivalent
app.use(permissionPolicy({
  pictureInPicture: ['self']
}))

app.use(permissionPolicy({
  'picture-in-picture': ['self']
}))
```

## Special Values

* **`'self'`**: Allows the feature for the same origin
* **`'src'`**: Allows the feature for the iframe's src attribute (for iframe allow attribute)
* **`'none'`**: Denies the feature for all origins (equivalent to `false` or `[]`)
* **`'*'`**: Allows the feature for all origins (equivalent to `true`)
* **URLs**: Specific origins like `'https://example.com'`

## Header Format

The middleware generates headers in the format:

```
Permissions-Policy: feature1=(value1), feature2=(value2)
```

Examples:

* `geolocation=()` - Deny all
* `geolocation=(*)` - Allow all
* `geolocation=(self)` - Allow self only
* `geolocation=(self "https://example.com")` - Allow self and specific origin
