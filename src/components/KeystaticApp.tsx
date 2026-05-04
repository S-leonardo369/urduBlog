// Thin wrapper so the Keystatic admin can be used as a client:only component
// in src/pages/keystatic/[...params].astro without triggering Astro's
// "no matching import" error for dynamically-created components.
import { makePage } from '@keystatic/astro/ui';
import keystaticConfig from '../../keystatic.config';

const KeystaticApp = makePage(keystaticConfig);
export default KeystaticApp;
