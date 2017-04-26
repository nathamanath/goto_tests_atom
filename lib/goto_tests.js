'use babel'

import TestFinder from './test_finder'
import {CompositeDisposable} from 'atom'

/**
 * Locate target file, and open it
 */
function go() {
  let editor = atom.workspace.getActivePaneItem()
  let file =  editor.buffer.file
  let path = file.path

  let target = TestFinder.find(path)

  if(target) {
    atom.workspace.open(target)
  } else {
    atom.notifications.addError('Goto-tests: Couldnt locate file.')
  }
}

let subscriptions = null;

export default {

  activate: () => {
    subscriptions = new CompositeDisposable();

    // Register commands
    subscriptions.add(atom.commands.add('atom-text-editor', 'goto-tests:go', go));
  },

  deactivate: () => {
    subscriptions.dispose();
  }
}
