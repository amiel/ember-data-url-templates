// This was inspired by https://stackoverflow.com/a/34514143/223519
// and ultimately reconfigured by @basz
// https://github.com/amiel/ember-data-url-templates/issues/17#issuecomment-379232452

export default function flattenQueryParams(arr) {
  let newObj = {};
  dive('', arr, newObj);
  return newObj;
}

function dive(currentKey, into, target) {
  for (let i in into) {
    if (into.hasOwnProperty(i)) {
      let newKey = i;
      let newVal = into[i];

      if (currentKey.length > 0) {
        newKey = `${currentKey}[${i}]`;
      }

      if (typeof newVal === 'object') {
        dive(newKey, newVal, target);
      } else {
        target[newKey] = newVal;
      }
    }
  }
}
