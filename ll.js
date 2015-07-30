var ll = (function (window) {

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

  var throttle = function() {
    var result;
    var timeout = null;
    var previous = 0;
    var later = function() {
      previous = new Date().getTime();
      timeout = null;
      result = ll.render();
    };
    return function() {
      var now = new Date().getTime();
      var remaining = delay - (now - previous);
      if (remaining <= 0 || remaining > delay) {
          if (timeout) {
              clearTimeout(timeout);
              timeout = null;
          }
          previous = now;
          result = ll.render();
      } else if (!timeout) {
         timeout = setTimeout(later, remaining);
      }
      return result;
    };
  }

  ll.init = function () {
    offset = (root.innerHeight || document.documentElement.clientHeight);
    delay = 200;
    ll.render();
    if (document.addEventListener) {
      root.addEventListener('scroll', throttle, false);
      root.addEventListener('load', throttle, false);
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
    console.log("view: %o", view);
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (inView(elem, view)) {
        console.log("true - elem: %o", elem);
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

}(window));