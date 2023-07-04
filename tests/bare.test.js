// @ts-check

// Right now this file just checks that we properly configured type declarations.
// Perhaps we'll actually have real tests in the future...

import { LinkClickObserver } from "link-click-observer"
import { LinkClickObserver as LCO } from "link-click-observer/exports/index.js"

const linkClickObserver = new LinkClickObserver();
linkClickObserver.start();
linkClickObserver.stop()
linkClickObserver.started

/** @type {import("link-click-observer").LinkClickObserver["shouldNavigate"]} */
linkClickObserver.shouldNavigate = (_event, _location) => true

/** @type {import("link-click-observer").LinkClickObserver["navigate"]} */
linkClickObserver.navigate = (_location) => console.log('do stuff')

// Make sure exports works.
const lco = new LCO()
lco.start();
lco.stop()
lco.started

/** @type {import("link-click-observer").LinkClickObserver["shouldNavigate"]} */
lco.shouldNavigate = (_event, _location) => true

/** @type {import("link-click-observer").LinkClickObserver["navigate"]} */
lco.navigate = (_location) => console.log('do stuff')

