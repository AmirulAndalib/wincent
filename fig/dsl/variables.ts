import Context from '../Context.js';
import getCallers from '../getCallers.js';
import getAspectFromCallers from '../getAspectFromCallers.js';

/**
 * Register a callback to dynamically contribute variables when an aspect is
 * running (useful for values that cannot be determined statically ahead of time
 * and stored in JSON).
 */
export default function variables(callback: (v: Variables) => Variables) {
  const aspect = getAspectFromCallers(getCallers());

  Context.variables.registerDynamicCallback(aspect, callback);
}
