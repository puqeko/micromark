/**
 * @typedef {import('../micromark/index.js').Construct} Construct
 * @typedef {import('../micromark/index.js').Tokenizer} Tokenizer
 * @typedef {import('../micromark/index.js').State} State
 */

import assert from 'assert'
import {labelEnd} from './label-end.js'
import {codes} from '../micromark-core-symbol/codes.js'
import {types} from '../micromark-core-symbol/types.js'

/** @type {Construct} */
export const labelStartImage = {
  name: 'labelStartImage',
  tokenize: tokenizeLabelStartImage,
  resolveAll: labelEnd.resolveAll
}

/** @type {Tokenizer} */
function tokenizeLabelStartImage(effects, ok, nok) {
  const self = this

  return start

  /** @type {State} */
  function start(code) {
    assert(code === codes.exclamationMark, 'expected `!`')
    effects.enter(types.labelImage)
    effects.enter(types.labelImageMarker)
    effects.consume(code)
    effects.exit(types.labelImageMarker)
    return open
  }

  /** @type {State} */
  function open(code) {
    if (code === codes.leftSquareBracket) {
      effects.enter(types.labelMarker)
      effects.consume(code)
      effects.exit(types.labelMarker)
      effects.exit(types.labelImage)
      return after
    }

    return nok(code)
  }

  /** @type {State} */
  function after(code) {
    /* Hidden footnotes hook */
    /* c8 ignore next 3 */
    return code === codes.caret &&
      '_hiddenFootnoteSupport' in self.parser.constructs
      ? nok(code)
      : ok(code)
  }
}