export function isSysName() {
  let ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    return 'iphone';
  } else if (/android/.test(ua)) {
    return 'android';
  }
}
//获取cookie、
export function getCookie(name: any) {
  let arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  //alert(document.cookie.match(reg))
  if ((arr = document.cookie.match(reg))) return arr[2];
  else return '';
}

//设置cookie,增加到vue实例方便全局调用
export function setCookie(c_name: any, value: any, expiredays?: any) {
  let exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie =
    c_name +
    '=' +
    escape(value) +
    (expiredays == null ? '' : ';expires=' + exdate.toGMTString()) +
    ';path=/';
}

//删除cookie
export function delCookie(name: any) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let cval = getCookie(name);
  if (cval != null)
    document.cookie =
      name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/';
}
