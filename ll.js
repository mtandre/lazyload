var ll = (function () {

  'use strict';

  var ll = {};
  
  var root = window;

  var offset, poll, delay;

  var isHidden = function (element) {
    return (element.offsetParent === null);
  };
  
  var inView = function (element, view) {
    if (isHidden(element)) {
      return false;
    }
    var box = element.getBoundingClientRect();
    return (box.top <= view);
  };

  var throttle = function(func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function() {
      previous = new Date().getTime();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
        var now = new Date().getTime();
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout) {
           timeout = setTimeout(later, remaining);
        }
        return result;
    };
  }

  ll.init = function () {
    offset = 300;
    delay = 300;
    ll.render();
    if (document.addEventListener) {
      root.addEventListener('scroll', throttle(ll.render,delay), false);
      root.addEventListener('load', throttle(ll.render,delay), false);
    } else {
      root.attachEvent('onscroll', throttle);
      root.attachEvent('onload', throttle);
    }
  };

  ll.render = function () {
    var nodes = document.querySelectorAll('img[data-src]');
    var length = nodes.length;
    var src, elem;
    var view = (root.innerHeight || document.documentElement.clientHeight) + offset;
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (inView(elem, view)) {
        elem.src = elem.getAttribute('data-src');
        elem.removeAttribute('data-src');
      }
    }
    if (!length) {
      ll.detach();
    }
  };

  ll.detach = function () {
    if (document.removeEventListener) {
      root.removeEventListener('scroll', throttle);
    } else {
      root.detachEvent('onscroll', throttle);
    }
    clearTimeout(poll);
  };

  return ll;

}());