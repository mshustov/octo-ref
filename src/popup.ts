import syncer from './lib/sync-storage';
import * as objectAssign from 'object-assign';

var defColorElem = document.getElementsByName('definition-color')[0] as HTMLInputElement;
var refColorElem = document.getElementsByName('reference-color')[0] as HTMLInputElement;

let settings: any = {};
syncer.getData('octoRef', data => {
  settings = objectAssign({}, data.octoRef);
  console.log('settings.defColor', settings.defColor);
  defColorElem.setAttribute('value', settings.defColor);
  refColorElem.setAttribute('value', settings.refColor);
});

defColorElem.addEventListener('input', function(e: Event){
  var value = defColorElem.value;
  console.log('set', value);
  const newValue = objectAssign(settings, { defColor: value });
  syncer.setData({octoRef: newValue});
});

refColorElem.addEventListener('input', function(e: Event){
  var value = refColorElem.value;
  console.log('set', value);
  const newValue = objectAssign(settings, { refColor: value });
  syncer.setData({octoRef: newValue});
});

