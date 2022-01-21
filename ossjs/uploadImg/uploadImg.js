import {showModal} from "../../utils/util";

const env = require('config.js');

const base64 = require('base64.js');
require('hmac.js');
require('sha1.js');
const Crypto = require('crypto.js');

/*
 *上传文件到阿里云oss
 *@param - filePath :图片的本地资源路径
  @param - path :上传oss哪个路径下
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
const uploadFile = function(stsTokenBean,filePath, path, callback) {
  if (!filePath || filePath.length < 9) {
    showModal(
      '请重试',
      '图片错误',
    )
    return;
  }
  //存放图片命名格式：自定义时间戳给图片名字(可以自己改)
  let aa = path.split('/')
  if (aa.length>0){
    path = aa[aa.length-1]
  }
  let uid = wx.getStorageSync('uid')
  if (wx.getStorageSync('usertype') === "1") {
    path = "student/"+uid+"/"+path
  } else {
    path = "teacher/"+uid+"/"+path
  }
  const aliyunFileKey = path;

  const aliyunServerURL = wx.getStorageSync('domain'); //OSS地址，https
  const accessid = stsTokenBean.AccessKeyId;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64,stsTokenBean.AccessKeySecret);

  wx.uploadFile({
    url: aliyunServerURL, //开发者服务器 url
    filePath: filePath, //要上传文件资源的路径
    name: 'file', //必须填file
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'x-oss-security-token': stsTokenBean.SecurityToken ,// 使用STS签名时必传。
      'success_action_status': '200',
    },
    success: function(res) {
      if (res.statusCode != 200) {
        callback.fail(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
      callback.success(aliyunFileKey);
    },
    fail: function(err) {
      err.wxaddinfo = aliyunServerURL;
      callback.fail(err);
    },
  })
}

const getPolicyBase64 = function() {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function(policyBase64,key) {
  const accesskey = key;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);
  return signature;
}

module.exports = uploadFile;