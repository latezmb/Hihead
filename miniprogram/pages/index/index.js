let fileID
// miniprogram/pages/index/index.js
Page({
  data: {
    primaryImg: "",
    cutImg1: "",
    cutImg2: "",
    cutImg3: ""
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
              const { result: { PoliticsInfo = {}, PornInfo = {}, TerroristInfo = {} } } = res
              if (PoliticsInfo.Code === 0 && PornInfo.Code === 0 && TerroristInfo.Code === 0) {
                //智能截图
                wx.cloud.callFunction({
                  name: "CJimage",
                  data: {
                    fileID: fileID
                  }
                }).then(res => {
                  console.log(res)
                  this.setData({
                    primaryImg: res.result,
                    cutImg1: res.result + "?imageMogr2/scrop/100x100",
                    cutImg2: res.result + "?imageMogr2/scrop/300x200",
                    cutImg3: res.result + "?imageMogr2/scrop/160x90"
                  })
                  fileID = ""
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