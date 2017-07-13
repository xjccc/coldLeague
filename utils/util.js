let app = getApp(),
    UT = require('./request.js');
const _exports = {
  analyticsDefaultData:{
    v:1,
    tid:'UA-77901546-10',
    cid:'',
    t:'event'
  },
  getUserInfo:function(callback,page){
    let that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
            //发起网络请求
            wx.request({
              url: app.ajaxurl,
              data: {
                  c:'caruser',
                  m:'coollogin',
                  code: res.code,
                  ts:+new Date()
              },
            success:function(res){
              if(res && res.data){
                  app.uid = res.data['msg'];
                  that.analyticsDefaultData['cid'] = app.uid;
                  wx.setStorageSync('userid',app.uid);
                  callback && callback(app.uid,page);
              }
            }
          })
        }
      }
    })
  },
  analytics:function(data){
    let d = this.analyticsDefaultData;
    for(let i in data){
        d[i] = data[i]
    };
    wx.request({
        url:'https://www.google-analytics.com/collect',
        data:d
    });
  },
  getRequest (data,suc,err) {   //进行请求
		wx.request({
			url:app.ajaxurl,
			data:data,
			success:function(res){
				UT.isFunction(suc) && suc(res.data)
			},
			fail:function(res){
				UT.isFunction(err) && err(res.data)
			}
		})
	},
  // 拨打客服电话
  makeCallToUs () {
    var that = this
    wx.makePhoneCall({
      phoneNumber:'15010638696',
      success:function(){
        that.analytics({
          t:'event',
          ec:'点击拨打客服电话',
          ea:'',
          el:'15010638696'
    		})
      }
    })
  },
  // 拨打电话
  makeCallToOthers (item,content,id) {
    var that = this
    wx.makePhoneCall({
      phoneNumber:item,
      success:function(){
        that.analytics({
          t:'event',
          ec:'点击拨打货源电话',
          ea:content,
          el:item
        })
    // 拨打成功储存电话
        wx.request({
          url: app.ajaxurl,
          data: {
            c: 'carnewapi',
            m: 'savephoneclick',
            id: id,
            ts: +new Date()
          }
        })
      }
    })
  },
  // 跳转个人中心
  jumpToUserCenter (unionId,nickname,avatar,isCarGo,openid) {
    wx.navigateTo({
      url: '/pages/userCenter/userCenter?unionId=' + unionId + '&nickname=' + nickname + '&avatar=' + avatar + '&isCarGo=' + isCarGo + '&openid=' + encodeURIComponent(openid)
    })
  },
  // 替换关键字
  replaceKeyWord (arr,key) {
    let reg = new RegExp(key,'g')
    arr.forEach((item) => {
      item.user_content = item.user_content.replace(reg,`<span style="color: #F76260;">${key}</span>`)
    })
  },
  getLocalTime (date) {  // 转换时间
    var past = new Date(parseInt(date)*1000)
    var now = new Date()
    var yestoday = new Date() - 24*60*60*1000
    var time = (now-past)/1000
    if (new Date(past).toDateString() === new Date().toDateString()) {
      return '今天'
    } else if((now.getDate() - 1) === past.getDate()){
      return '昨天'
    } else {
      var m = (past.getMonth()+1 < 10 ? '0'+(past.getMonth()+1) : past.getMonth()+1)
      var d = (past.getDate() < 10 ? '0'+(past.getDate()) : past.getDate())
      return m + '月' + d + '日'
    }
  },
  personLocalTime (date) { // 更换时间
    var past = new Date(parseInt(date)*1000)
    var now = new Date()
    var time = (now-past)/1000
    if (new Date(past).toDateString() === new Date().toDateString()) {
      return '今天'
    } else {
      var m = (past.getMonth()+1 < 10 ? '0'+(past.getMonth()+1) : past.getMonth()+1)
      var d = (past.getDate() < 10 ? '0'+(past.getDate()) : past.getDate())
      var arr = [d,(m + '月')]
      return arr
    }
  },
  getSetting (suc) {  // 拒绝授权的时候，自动跳转到授权页获取个人信息
    var that = this
    if (wx.getSetting) {
      wx.getSetting({ // 获取授权状态
        success:(r) => {
          if (!r.authSetting["scope.userInfo"]){
            wx.openSetting({ // 打开设置
              success:function(res){
                UT.isFunction(suc) && suc(res.data)
              }
            })
          }
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  getClipBoard (suc,err) {  // 获取剪切板
    var that = this
    if (wx.getClipboardData) {
      wx.getClipboardData({
        success:function(res){
          UT.isFunction(suc) && suc(res.data)
        },
        fail:function(res){
          UT.isFunction(err) && err(res.data)
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
}
function trims(str){  //去除前面空格
  var str = str.replace(/^\s*/g,"")
  return str
}
module.exports = _exports;
