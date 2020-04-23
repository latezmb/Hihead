// 云函数入口文件
const cloud = require('wx-server-sdk')
const extCi = require("@cloudbase/extension-ci");
const tcb = require("tcb-admin-node");
//let fileContent = imageBuffer; // Uint8Array|Buffer格式图像内容
tcb.init({
  env: "azhuo-id"
});
tcb.registerExtension(extCi);
cloud.init()

//裁剪函数
async function process(cloudPath) {
  try {
    const opts = {
      rules: [
        {
          // 处理结果的文件路径，如以’/’开头，则存入指定文件夹中，否则，存入原图文件存储的同目录
          fileid: "/image_process/demo.jpeg",
          rule: "imageView2/rradius/100" // 处理样式参数，与下载时处理图像在url拼接的参数一致
        }
      ]
    };
    const res = await tcb.invokeExtension("CloudInfinite", {
      action: "ImageProcess",
      cloudPath: cloudPath, // 存储图像的绝对路径，与tcb.uploadFile中一致
      //fileContent: "", // 该字段可选，文件内容：Uint8Array|Buffer。有值，表示上传时处理图像；为空，则处理已经上传的图像
      operations: opts
    });
    return res.data
  } catch (err) {
    return "" + err
  }
}


// 获取图⽚临时链接
const getImageUrl = async (fileID) => {
  const { fileList } = await tcb.getTempFileURL({
    fileList: [fileID]
  })
  return fileList[0].tempFileURL
}


// 云函数入口函数
exports.main = async (event, context) => {
  return getImageUrl(event.fileID)
}