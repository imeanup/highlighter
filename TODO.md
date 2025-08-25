Unrecognized manifest key 'host_permission'.

```
"host_permission" : [
    "http://*/*",
    "https://*/*"
  ],
```

Service worker registration failed. Status code: 15

```
 "background": {
    "service_worker": "js/background.js"
  },
  ```

Uncaught ReferenceError: $ is not defined

context `js/background.js`

js/background.js:2 (anonymous function)

```
! function(a, b) {
```

Error handling response: TypeError: Cannot read properties of undefined (reading 'background')

popup.js
```
}(b.background)
```

Unchecked runtime.lastError: You do not have a background page.

popup.html:0 (anonymous function)

Refused to run the JavaScript URL because it violates the following Content Security Policy directive: "script-src 'self'". Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present.

popup.html

<!doctype html>

Refused to run the JavaScript URL because it violates the following Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules' http://localhost:* http://127.0.0.1:*". Either the 'unsafe-inline' keyword, a hash ('sha256-...'), or a nonce ('nonce-...') is required to enable inline execution. Note that hashes do not apply to event handlers, style attributes and javascript: navigations unless the 'unsafe-hashes' keyword is present.