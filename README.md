# Purpose

To intercept any and all link clicks (including inside shadow roots!) and be
able to apply your routing function. No more `<Link />` components or routing directives!

## Installation

`npm install link-click-observer`

## Examples

### Regular ole JS

`link-click-observer` isn't generally intended for use in vanilla JS. It is generally
reserved for frameworks and libraries that implement client-side routing. That said,
nothing is stopping you from doing it either.

```js
// index.js

import { LinkClickObserver } from "link-click-observer"

const linkClickObserver = new LinkClickObserver(document)
linkClickObserver.shouldNavigate = ({location, event, anchorElement}) => true
linkClickObserver.navigate = ({location, event, anchorElement}) => {
  // Don't do this. Just an example.
  window.location.href = location
}
```

### React Router

Leave those silly `<Link />` components in the past and simply use `<a href="/{path}">`

```js
// src/App.js

import { LinkClickObserver } from "link-click-observer"
import { useNavigate } from "react-router-dom";

export function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const linkClickObserver = new LinkClickObserver(document);
    linkClickObserver.shouldStopNativeNavigation = ({location, event, anchorElement}) => {
      // if this returns `true`, it will call `event.preventDefault`, `event.stopPropagation`,
      // and `event.stopImmediatePropagation` for you allowing your
      // client side router to take over.
      return true
    }
    linkClickObserver.navigate = ({ location, event, anchorElement }) => {
      // This is where you call your client side routing function.
      navigate(location);
    };
    linkClickObserver.start();

    // cleanup
    return () => linkClickObserver.stop();
  }, []);

  return <></>
}
```
