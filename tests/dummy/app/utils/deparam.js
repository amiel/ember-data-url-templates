/* NOTE: This was taken from https://github.com/canjs/can-deparam/blob/master/can-deparam.js */

/**
 * @module {function} can-deparam can-deparam
 * @parent can-routing
 * @collection can-infrastructure
 * @description Deserialize a query string into an array or object.
 * @signature `deparam(params)`
 *
 * @param {String} params a form-urlencoded string of key-value pairs
 * @return {Object} The params formatted into an object
 *
 * Takes a string of name value pairs and returns a Object literal that represents those params.
 *
 * ```js
 * console.log(JSON.stringify(deparam("?foo=bar&number=1234"))); // -> '{"foo" : "bar", "number": 1234}'
 * console.log(JSON.stringify(deparam("#foo[]=bar&foo[]=baz"))); // -> '{"foo" : ["bar", "baz"]}'
 * console.log(JSON.stringify(deparam("foo=bar%20%26%20baz"))); // -> '{"foo" : "bar & baz"}'
 * ```
 * @body
 *
 * ## Try it
 *
 * Use this JS Bin to play around with this package:
 *
 * <a class="jsbin-embed" href="https://jsbin.com/mobimok/3/embed?js,console">can-deparam on jsbin.com</a>
 * <script src="https://static.jsbin.com/js/embed.min.js?4.0.4"></script>
 */
var digitTest = /^\d+$/,
  keyBreaker = /([^\[\]]+)|(\[\])/g,
  paramTest = /([^?#]*)(#.*)?$/,
  entityRegex = /%([^0-9a-f][0-9a-f]|[0-9a-f][^0-9a-f]|[^0-9a-f][^0-9a-f])/i,
  prep = function (str) {
    str = str.replace(/\+/g, ' ');

    try {
      return decodeURIComponent(str);
    }
    catch (e) {
      return decodeURIComponent(str.replace(entityRegex, function(match, hex) {
        return '%25' + hex;
      }));
    }
  };

export default function(params) {
  var data = {}, pairs, lastPart;
  if (params && paramTest.test(params)) {
    pairs = params.split('&');
    pairs.forEach(function (pair) {
      var parts = pair.split('='),
        key = prep(parts.shift()),
        value = prep(parts.join('=')),
        current = data;
      if (key) {
        parts = key.match(keyBreaker);
        for (var j = 0, l = parts.length - 1; j < l; j++) {
          if (!current[parts[j]]) {
            // If what we are pointing to looks like an `array`
            current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] === '[]' ? [] : {};
          }
          current = current[parts[j]];
        }
        lastPart = parts.pop();
        if (lastPart === '[]') {
          current.push(value);
        } else {
          current[lastPart] = value;
        }
      }
    });
  }
  return data;
}
