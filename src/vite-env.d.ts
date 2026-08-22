/// <reference types="vite/client" />

// Third-party scripts that attach themselves to `window`, declared one property
// at a time. An index signature here (`[key: string]: any`) would switch off
// type checking for every window access in the app, which is what it used to do.
interface Window {
  // Google Maps JS API namespace. Left untyped on purpose - we don't pull in
  // @types/google.maps. See src/lib/googleMaps.ts.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  google?: any;
  // Resolve callback the Maps loader passes via the script's `callback` param.
  __livelyInitGoogleMapsPlaces__?: () => void;
  // Cloudinary upload widget, loaded from a script tag. Also untyped upstream.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cloudinary?: any;
  // DEV-only guard so the CSP logger isn't attached twice across HMR reloads.
  __cspLoggerAdded?: boolean;
}
