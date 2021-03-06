/* */ 
var http = require("http");
var util = require("util");
var sigmund = require("./sigmund");
var sreq,
    sres,
    creq,
    cres,
    test;
http.createServer(function(q, s) {
  sreq = q;
  sres = s;
  sres.end('ok');
  this.close(function() {
    setTimeout(function() {
      start();
    }, 200);
  });
}).listen(1337, function() {
  creq = http.get({port: 1337});
  creq.on('response', function(s) {
    cres = s;
  });
});
function start() {
  test = [sreq, sres, creq, cres];
  for (var i in exports.compare) {
    console.log(i);
    var hash = exports.compare[i]();
    console.log(hash);
    console.log(hash.length);
    console.log('');
  }
  require("bench").runMain();
}
function customWs(obj, md, d) {
  d = d || 0;
  var to = typeof obj;
  if (to === 'undefined' || to === 'function' || to === null)
    return '';
  if (d > md || !obj || to !== 'object')
    return ('' + obj).replace(/[\n ]+/g, '');
  if (Array.isArray(obj)) {
    return obj.map(function(i, _, __) {
      return customWs(i, md, d + 1);
    }).reduce(function(a, b) {
      return a + b;
    }, '');
  }
  var keys = Object.keys(obj);
  return keys.map(function(k, _, __) {
    return k + ':' + customWs(obj[k], md, d + 1);
  }).reduce(function(a, b) {
    return a + b;
  }, '');
}
function custom(obj, md, d) {
  d = d || 0;
  var to = typeof obj;
  if (to === 'undefined' || to === 'function' || to === null)
    return '';
  if (d > md || !obj || to !== 'object')
    return '' + obj;
  if (Array.isArray(obj)) {
    return obj.map(function(i, _, __) {
      return custom(i, md, d + 1);
    }).reduce(function(a, b) {
      return a + b;
    }, '');
  }
  var keys = Object.keys(obj);
  return keys.map(function(k, _, __) {
    return k + ':' + custom(obj[k], md, d + 1);
  }).reduce(function(a, b) {
    return a + b;
  }, '');
}
function sparseFE2(obj, maxDepth) {
  var seen = [];
  var soFar = '';
  function ch(v, depth) {
    if (depth > maxDepth)
      return;
    if (typeof v === 'function' || typeof v === 'undefined')
      return;
    if (typeof v !== 'object' || !v) {
      soFar += v;
      return;
    }
    if (seen.indexOf(v) !== -1 || depth === maxDepth)
      return;
    seen.push(v);
    soFar += '{';
    Object.keys(v).forEach(function(k, _, __) {
      if (k.charAt(0) === '_')
        return;
      var to = typeof v[k];
      if (to === 'function' || to === 'undefined')
        return;
      soFar += k + ':';
      ch(v[k], depth + 1);
    });
    soFar += '}';
  }
  ch(obj, 0);
  return soFar;
}
function sparseFE(obj, maxDepth) {
  var seen = [];
  var soFar = '';
  function ch(v, depth) {
    if (depth > maxDepth)
      return;
    if (typeof v === 'function' || typeof v === 'undefined')
      return;
    if (typeof v !== 'object' || !v) {
      soFar += v;
      return;
    }
    if (seen.indexOf(v) !== -1 || depth === maxDepth)
      return;
    seen.push(v);
    soFar += '{';
    Object.keys(v).forEach(function(k, _, __) {
      if (k.charAt(0) === '_')
        return;
      var to = typeof v[k];
      if (to === 'function' || to === 'undefined')
        return;
      soFar += k;
      ch(v[k], depth + 1);
    });
  }
  ch(obj, 0);
  return soFar;
}
function sparse(obj, maxDepth) {
  var seen = [];
  var soFar = '';
  function ch(v, depth) {
    if (depth > maxDepth)
      return;
    if (typeof v === 'function' || typeof v === 'undefined')
      return;
    if (typeof v !== 'object' || !v) {
      soFar += v;
      return;
    }
    if (seen.indexOf(v) !== -1 || depth === maxDepth)
      return;
    seen.push(v);
    soFar += '{';
    for (var k in v) {
      if (k.charAt(0) === '_')
        continue;
      var to = typeof v[k];
      if (to === 'function' || to === 'undefined')
        continue;
      soFar += k;
      ch(v[k], depth + 1);
    }
  }
  ch(obj, 0);
  return soFar;
}
function noCommas(obj, maxDepth) {
  var seen = [];
  var soFar = '';
  function ch(v, depth) {
    if (depth > maxDepth)
      return;
    if (typeof v === 'function' || typeof v === 'undefined')
      return;
    if (typeof v !== 'object' || !v) {
      soFar += v;
      return;
    }
    if (seen.indexOf(v) !== -1 || depth === maxDepth)
      return;
    seen.push(v);
    soFar += '{';
    for (var k in v) {
      if (k.charAt(0) === '_')
        continue;
      var to = typeof v[k];
      if (to === 'function' || to === 'undefined')
        continue;
      soFar += k + ':';
      ch(v[k], depth + 1);
    }
    soFar += '}';
  }
  ch(obj, 0);
  return soFar;
}
function flatten(obj, maxDepth) {
  var seen = [];
  var soFar = '';
  function ch(v, depth) {
    if (depth > maxDepth)
      return;
    if (typeof v === 'function' || typeof v === 'undefined')
      return;
    if (typeof v !== 'object' || !v) {
      soFar += v;
      return;
    }
    if (seen.indexOf(v) !== -1 || depth === maxDepth)
      return;
    seen.push(v);
    soFar += '{';
    for (var k in v) {
      if (k.charAt(0) === '_')
        continue;
      var to = typeof v[k];
      if (to === 'function' || to === 'undefined')
        continue;
      soFar += k + ':';
      ch(v[k], depth + 1);
      soFar += ',';
    }
    soFar += '}';
  }
  ch(obj, 0);
  return soFar;
}
exports.compare = {
  'JSON.stringify (guarded)': function() {
    var seen = [];
    return JSON.stringify(test, function(k, v) {
      if (typeof v !== 'object' || !v)
        return v;
      if (seen.indexOf(v) !== -1)
        return undefined;
      seen.push(v);
      return v;
    });
  },
  'flatten 10': function() {
    return flatten(test, 10);
  },
  'noCommas 10': function() {
    return noCommas(test, 10);
  },
  'sparse 10': function() {
    return sparse(test, 10);
  },
  'sparseFE 10': function() {
    return sparseFE(test, 10);
  },
  'sparseFE2 10': function() {
    return sparseFE2(test, 10);
  },
  sigmund: function() {
    return sigmund(test, 10);
  }
};
