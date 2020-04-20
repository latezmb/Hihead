// miniprogram/pages/index/index.js
Page({
  data: {
    yuan_img: "",
    cai1_img: "",
    cai2_img: "",
    cai3_img: ""
  }, 
  upload: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        console.log(res.tempFilePaths)
        const filePath = res.tempFilePaths[0]
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            console.log(res.fileID)
          },
          fail: res => {
            console.log("上传失败")
          }
        })
        this.setData({
          yuan_img: res.tempFilePaths
        })
      }
    })
  },
})