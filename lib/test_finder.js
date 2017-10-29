'use babel'

import Path from 'path'

// TODO: config from cson file

/**
 * lookup language config by file extension
 */
const extensionMap = {
  ex: 'elixir',
  exs: 'elixir',
  rb: 'ruby',
  js: 'javascript'
}

/**
 * default config
 *
 * extensions are taken from current file, and overritten in config. first by
 * default, then by languace speciffic config
 */
const defaults = {
  sourceDir: 'lib',
  testDir: 'test',
  testFileSuffix: '_test'
}

// TODO: get extensions from current file

/**
 * config overrides per language
 */
const config = {
  // TODO: phoenix uses web and lib... look in both
  // TODO: source or test file could be either ex or exs
  elixir: {
    sourceDir: 'lib',
    testDir: 'test',
    testExtension: 'exs',
    sourceExtension: 'ex',
    testFileSuffix: '_test'
  },

  ruby: {
    testFileSuffix: '_spec',
    testDir: 'spec',
  },

  // TODO: how to set project speciffic config?

  javascript: {
    sourceDir: 'lib',
    testDir: 'spec',
    testFileSuffix: '_spec'
  }
}



/**
 * const isSourceFile - classify current file as source or test based on
 * language config and defaults
 *
 * @param  {string} path - path to currrent file
 * @returns {boolean} - source file or not
 */
let isSourceFile = function(path, testFileSuffix, testExtension) {
  if(testFileSuffix) {
    let reg = new RegExp(`${testFileSuffix}.${testExtension}`)
    return !reg.test(path)
  }
}

export default {

  /**
   * classify `path` as sourcce or test, then find path of target file
   *
   * @param  {type} path - current file path
   * @returns {string} Path of file to jump to
   */
  find: function(path) {

    let extension = path.match(/\.([0-9a-z]+$)/i)[1]
    let basename = Path.basename(path, `.${extension}`)

    let currentConfig = config[extensionMap[extension]]
    let testExtension = currentConfig.testExtension || extension
    let sourceExtension = currentConfig.sourceExtension || extension

    // TODO: proper isSource check based on language
    // TODO: use config
    if(isSourceFile(path, currentConfig.testFileSuffix, testExtension)) {
      // go to test

      let split = path.split('/')
      let libIndex = split.indexOf(currentConfig.sourceDir)

      split[libIndex] = currentConfig.testDir
      split[split.length-1] = `${basename}${currentConfig.testFileSuffix}.${testExtension}`

      return split.join('/')
    } else {
      // go to source

      let split = path.split('/')
      let libIndex = split.indexOf(currentConfig.testDir)

      split[libIndex] = currentConfig.sourceDir
      split[split.length-1] = `${basename.replace(currentConfig.testFileSuffix, '')}.${sourceExtension}`

      return split.join('/')
    }

  }
}
