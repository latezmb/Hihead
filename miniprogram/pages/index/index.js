let fileID
// miniprogram/pages/index/index.js
Page({
  data: {
    yuan_img: "",
    cai1_img: "",
    cai2_img: "",
    cai3_img: ""
  }, 
  upload: function () {
    //选择上传的图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      //选择图片成功回调
      success: (res) => {
        console.log(res)
        console.log(res.tempFilePaths)
        const filePath = res.tempFilePaths[0]
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        //上传图片到云储存
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          //上传图片成功的回调
          success: (res) => {
            fileID = res.fileID
            //调用图片安全审查函数
            wx.cloud.callFunction({
              name: "trialImage",
              data: {
                imgPath: fileID
              }
            }).then(res => {
              console.log(res)
              if (res.result.PoliticsInfo.Code == 0 && res.result.PornInfo.Code == 0 && res.result.TerroristInfo.Code == 0) {
                //智能截图
                wx.cloud.callFunction({
                  name: "CJimage",
                  data: {
                    fileID: fileID
                  }
                }).then(res => {
                  console.log(res)
                  this.setData({
                    yuan_img: fileID,
                    cai1_img: res.result + "?imageMogr2/scrop/100x100",
                    cai2_img: res.result + "?imageMogr2/scrop/300x200",
                    cai3_img: res.result + "?imageMogr2/scrop/160x90"
                  })
                })
              }else {
                wx.showToast({
                  title: '上传图片不规范，请重试',
                  icon: 'none'
                })
              }
            })
          },
          fail: res => {
            console.log("上传失败" + res)
          }
        })
      }
    })
  },
})