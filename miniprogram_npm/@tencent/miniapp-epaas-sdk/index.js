module.exports=function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=2)}({2:function(e,n){e.exports=async e=>{const n=wx.getSystemInfoSync().SDKVersion,t=((e,n)=>{const t=e.split("."),o=n.split("."),r=Math.max(t.length,o.length);for(;t.length<r;)t.push("0");for(;o.length<r;)o.push("0");for(let e=0;e<r;e++){const n=parseInt(t[e],10),r=parseInt(o[e],10);if(n>r)return 1;if(n<r)return-1}return 0})(n,"2.12.2")>=0;console.log("version",n,t);let o="";t||(o=await(async()=>new Promise((function(e,n){const t=wx.qy||wx;console.log("getQywxCode",t,wx.qy),t.login({success(t){console.log("wx.qy.login",t),t.code?e(t.code):(wx.showModal({title:"qy.login错误",content:t.errMsg,showCancel:!1}),n(t))},fail(e){wx.showModal({title:"qy.login fail",content:"code获取异常",showCancel:!1}),n(e)}})})))()),console.log("app qywxCode",o);let r="";for(const n in e)e[n]&&(r+=`&${n}=${e[n]}`);r+="&login_code="+o;const l="plugin://login-plugin/login?"+r.substr(1);wx.redirectTo({url:l})}}});