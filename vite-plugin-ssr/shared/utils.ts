// Utils needed by:
//  - runtime of server
//  - runtime of client (Client Routing)

// Ensure we don't bloat runtime of Server Routing with the utils down below
/* TODO
import { assertClientRouting } from '../utils/assertRoutingType'
import { isBrowser } from '../utils/isBrowser'
if (isBrowser()) {
  assertClientRouting()
}
*/

export * from '../utils/assert'
export * from '../utils/parseUrl'
export * from '../utils/objectAssign'
export * from '../utils/isCallable'
export * from '../utils/isObject'
export * from '../utils/unique'
export * from '../utils/slice'
export * from '../utils/sorter'
export * from '../utils/isBrowser'
export * from '../utils/hasProp'
export * from '../utils/isPlainObject'
export * from '../utils/compareString'
export * from '../utils/isNotNullish'
export * from '../utils/stringifyStringArray'
export * from '../utils/filesystemPathHandling'
export * from '../utils/cast'
export * from '../utils/projectInfo'
export * from '../utils/hasPropertyGetter'
export * from '../utils/isNpmPackageName'
export * from '../utils/isPromise'
export * from '../utils/checkType'
export * from '../utils/assertDefaultExport'
export * from '../utils/objectEntries'
