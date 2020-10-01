import { LogContexts, LogLevels } from 'bs-logger'
import type { ConfigSet } from 'ts-jest/dist/config/config-set';
import type * as _ts from 'typescript'

// this is a unique identifier for your transformer. `ts-jest` uses this for jest cache key
export const name = 'remove-vue-import'
// increment this each time you change the behavior of your transformer. `ts-jest` uses this for jest cache key
export const version = 1
const VUE_GLOBAL_NAME = 'vue'
const VUE_GLOBAL_VARIABLE_NAME = 'vue_1'
const ROOT_LEVEL_AST = 1

/**
 * @usage In jest config, define as
 * // jest.config.js
 * module.exports = {
 *   // other configs
 *   globals: {
 *     'ts-jest': {
 *       astTransformers: {
 *         before: ['vue-ts-jest/dist/transformers/remove-vue-import']
 *       }
 *     }
 *   }
 * }
 */
export function factory(cs: ConfigSet): (ctx: _ts.TransformationContext) => _ts.Transformer<_ts.SourceFile> {
  const logger = cs.logger.child({ namespace: 'remove-vue-import' })
  const ts = cs.compilerModule
  const importNames: Set<string> = new Set<string>();
  const isRequire = (node: _ts.Node): node is _ts.CallExpression =>
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'require' &&
    ts.isStringLiteral(node.arguments[0]) &&
    node.arguments.length === 1
  /**
   * e.g. const vue2 = require('vue')
   */
  const isVueRequireStmt = (node: _ts.Node) => isRequire(node)
    && (node.arguments[0] as _ts.StringLiteral).text === VUE_GLOBAL_NAME
  const isVueRequireImportStmt = (node: _ts.Node) => ts.isVariableStatement(node) && node.declarationList.declarations.length === 1
    && ts.isVariableDeclaration(node.declarationList.declarations[0])
    && node.declarationList.declarations[0].initializer
    && isVueRequireStmt(node.declarationList.declarations[0].initializer)
  /**
   * e.g.
   * - import { defineComponent, ref } from 'vue'
   * - import * as vue1 from 'vue'
   */
  const isVueNamespaceImport = (node: _ts.Node): node is _ts.ImportDeclaration => ts.isImportDeclaration(node)
    && ts.isStringLiteral(node.moduleSpecifier)
    && node.moduleSpecifier.text === VUE_GLOBAL_NAME

  const createVisitor = (ctx: _ts.TransformationContext, _sf: _ts.SourceFile) => {
    /**
     * Current block level
     */
    let level = 0
    /**
     * Called when we enter a block to increase the level
     */
    const enter = () => {
      level++
    }
    /**
     * Called when we leave a block to decrease the level
     */
    const exit = () => level--
    const visitor: _ts.Visitor = node => {
      // enter this level
      enter()

      // visit each child
      let resultNode = ts.visitEachChild(node, visitor, ctx)
      /**
       * Check require syntax, e.g. `const vue2 = require('vue')`
       * and get the variable name to replace with global name vue_1
       */
      if (ts.isVariableDeclaration(resultNode) && resultNode.initializer && isVueRequireStmt(resultNode.initializer)
        && ts.isIdentifier(resultNode.name)) {
        importNames.add(resultNode.name.text)
      }
      /**
       * Check import namespace syntax's, e.g. `import * as vue1 from 'vue'`
       * and get the import name to replace with global name vue_1 later.
       */
      if (isVueNamespaceImport(resultNode)
        && resultNode.importClause?.namedBindings
        && ts.isNamespaceImport(resultNode.importClause.namedBindings)
        && resultNode.importClause.namedBindings.name) {
        importNames.add(resultNode.importClause.namedBindings.name.text)
      }

      // Filter all vue import statements and remove them
      if (level === ROOT_LEVEL_AST) {
        const newNode = ts.getMutableClone(resultNode) as _ts.Block
        const otherStmts = (resultNode as _ts.Block).statements.filter(
          (s) => !isVueNamespaceImport(s) && !isVueRequireImportStmt(s),
        )
        resultNode = {
          ...newNode,
          statements: ts.createNodeArray([...otherStmts]),
        } as _ts.Statement
      }
      /**
       * Replace all call expressions' identifier by global vue variable name `vue_1`
       */
      if (ts.isCallExpression(resultNode)
        && ts.isPropertyAccessExpression(resultNode.expression)
        && ts.isIdentifier(resultNode.expression.expression) && importNames.has(resultNode.expression.expression.text)) {
        const newNode = ts.getMutableClone(resultNode)

        resultNode = {
          ...newNode,
          expression: {
            ...newNode.expression,
            expression: ts.createIdentifier(VUE_GLOBAL_VARIABLE_NAME)
          }
        } as _ts.CallExpression
      }

      // exit the level
      exit()

      // finally returns the currently visited node
      return resultNode
    }

    return visitor
  }

  // returns the transformer factory
  return (ctx: _ts.TransformationContext): _ts.Transformer<_ts.SourceFile> =>
    logger.wrap(
      { [LogContexts.logLevel]: LogLevels.debug, call: null },
      'visitSourceFileNode(): remove vue import',
      (sf: _ts.SourceFile) => ts.visitNode(sf, createVisitor(ctx, sf)),
    )
}
