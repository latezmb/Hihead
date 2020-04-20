// 云函数入口文件
const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");
tcb.init({
  env: "azhuo-id"
});
tcb.registerExtension(extCi);
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let imgPath = 'my-image' + event.imgPath.match(/\.[^.]+?$/)[0]
  try {
    const opts = {
      type: "porn,terrorist,politics"
    }
    const res = await tcb.invokeExtension('CloudInfinite', {
      action: 'DetectType',
      cloudPath: imgPath, // 需要分析的图像的绝对路径，与tcb.uploadFile中一致
      operations: opts
    })
    return res.data.RecognitionResult
  } catch (err) {
    return "" + err
  }
}