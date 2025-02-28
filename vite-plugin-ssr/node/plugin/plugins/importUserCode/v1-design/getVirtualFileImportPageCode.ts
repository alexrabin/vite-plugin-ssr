export { getVirtualFileImportPageCode }

import { assert } from '../../../utils'
import type { PageConfigData } from '../../../../../shared/page-configs/PageConfig'
import { generateEagerImport } from '../helpers/generateEagerImport'
import {
  getVirtualFileIdImportPageCode,
  isVirtualFileIdImportPageCode
} from '../../../../commons/virtual-files/virtualFileImportPageCode'
import { getConfigData } from './getConfigData'
import { extractAssetsAddQuery } from '../../extractAssetsPlugin/extractAssetsAddQuery'
import { debug } from './debug'

async function getVirtualFileImportPageCode(
  id: string,
  userRootDir: string,
  isDev: boolean,
  includeAssetsImportedByServer: boolean
): Promise<string> {
  const result = isVirtualFileIdImportPageCode(id)
  assert(result)
  /* This assertion fails when using includeAssetsImportedByServer
  {
    const isForClientSide = !config.build.ssr
    assert(result.isForClientSide === isForClientSide)
  }
  */
  const { pageId, isForClientSide } = result
  const { pageConfigsData } = await getConfigData(userRootDir, isDev, false)
  assert(pageConfigsData)
  const pageConfigData = pageConfigsData.find((pageConfigData) => pageConfigData.pageId2 === pageId)
  assert(pageConfigData)
  const code = generateSourceCodeOfLoadCodeFileVirtualFile(
    pageConfigData,
    isForClientSide,
    pageId,
    includeAssetsImportedByServer,
    isDev
  )
  debug(id, isForClientSide ? 'CLIENT-SIDE' : 'SERVER-SIDE', code)
  return code
}

function generateSourceCodeOfLoadCodeFileVirtualFile(
  pageConfigData: PageConfigData,
  isForClientSide: boolean,
  pageId: string,
  includeAssetsImportedByServer: boolean,
  isDev: boolean
): string {
  const lines: string[] = []
  const importStatements: string[] = []
  lines.push('export default [')
  let varCounter = 0
  Object.entries(pageConfigData.configSources).forEach(([configName, configSource]) => {
    if (!configSource.codeFilePath2) return
    const { c_env, codeFilePath2 } = configSource
    if (c_env === 'c_routing' || c_env === 'c_config') return
    if (c_env === (isForClientSide ? 'server-only' : 'client-only')) return
    const { importVar, importStatement } = generateEagerImport(codeFilePath2, varCounter++)
    importStatements.push(importStatement)
    lines.push(`  {`)
    lines.push(`    configName: '${configName}',`)
    lines.push(`    codeFilePath3: '${codeFilePath2}',`)
    lines.push(`    codeFileExports: ${importVar}`)
    lines.push(`  },`)
  })
  lines.push('];')
  if (includeAssetsImportedByServer && isForClientSide && !isDev) {
    lines.push(`import '${extractAssetsAddQuery(getVirtualFileIdImportPageCode(pageId, false))}'`)
  }
  const code = [...importStatements, ...lines].join('\n')
  return code
}
