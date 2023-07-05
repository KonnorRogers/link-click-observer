# Purpose

To intercept any and all link clicks (including inside shadow roots!) and be
able to apply your routing function. No more `<Link />` components or routing directives!

## Examples

### Regular ole JS

`link-click-observer` isn't generally intended for use in vanilla JS. It is generally
reserved for frameworks and libraries that implement client-side routing. That said,
nothing is stopping you from doing it either.

```js
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
import { LinkClickObserver } from "link-click-observer"
import { useNavigate } from "react-router-dom";

export function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const linkClickObserver = new LinkClickObserver(document);
    linkClickObserver.shouldStopNativeNavigation = ({location, event, anchorElement}) => {
      // Use this to call `event.preventDefault`, `event.stopPropagation`, and `event.stopImmediatePropagation` to
      // allow your client side router to take over.
      return true
    }
    linkClickObserver.navigate = (path, anchorElement) => {
      // This is where you call your client side router.
      navigate(path);
    };
    linkClickObserver.start();

    // cleanup
    return () => linkClickObserver.stop();
  }, []);

  return <></>
}
```
