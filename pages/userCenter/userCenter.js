var app = getApp(),
    util = require('../../utils/util.js'),
    UT = require('../../utils/request.js');
Page({
  data:{
    userInfo: {},
    nickname: '',
    defaultImg: 'https://s.kcimg.cn/gisopic/avatar/wx_img_s.png',
    avatar: '',
    isCarGo: '',
    messages:[],
    page: 1,
    unionId: '',
    mineUid: '',
    openid: '',
    loadMore:true,
    showMsgAll:false,
    addTime: []
  },
  onReady () {
    this.setData({
      mineUid:app.uid
    })
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    app.close = false   // loadmore
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    that.setData({
      nickname:options['nickname'],
      avatar:options['avatar'],
      isCarGo:options['isCarGo'],
      openid: decodeURIComponent(options['openid'])
    })
    wx.setNavigationBarTitle({
      title:options['nickname'] + "的货源"
    })
    // var unionId = "ozjPGs7ZiXD4qB0LvCmJiAN2CzJI"
    var unionId = options['unionId']
    var isCarGo = options['isCarGo']
    var openid = decodeURIComponent(options['openid'])
    var shareData = { // 请求的data
      c:'carrefrigerateapi',
      m:'getsharedatelist',
      page: this.data.page,
      unionId:unionId,
      openid: openid,
      isCarGo:isCarGo,
      ts: +new Date()
    }
    util.getRequest(shareData,(res)=>{
      var data = res.data;
      console.log(data)
      if (data.info != '2') {
        // 替换时间
        data.list.forEach((item) => {
          item.add_time = util.personLocalTime(item.add_time)
        })
        that.setData({
          messages:data.list,
          loading:true,
          page:this.data.page + 1,
          unionId:unionId,
          sharesContent:{
            title:options['nickname'] + "的朋友圈货源",
            path:'/pages/close/close?unionId=' + unionId + '&nickname=' + options['nickname'] + '&avatar=' + options['avatar'] + '&isCarGo=1' + '&openid=' + openid,
            success: function (res) {
              util.analytics({
                t:'event',
                ec:'个人中心页分享成功',
                ea:'',
                el:'share'
          		})
            }
          }
        })
      } else {
        that.setData({
          message: [],
          loading:true
        })
      }
    })
  },
  jumpToHome () {
    wx.redirectTo({
      url:'/pages/selectUser/selectUser'
    })
  },
  makePhoneCall:function(e){
    var item = e.target.dataset.item;
    var content = e.target.dataset.content
    var id = e.target.dataset.id
    util.makeCallToOthers(item,content,id)
  },
  loadMore:function(){
    var that = this;
    if(app.close) return
    app.close = true;
    that.setData({
      loadMore:false
    })
    var d = { // 请求的数据
      c:'carrefrigerateapi',
      m:'getsharedatelist',
      page: that.data.page,
      unionId:that.data.unionId,
      openid: that.data.openid,
      isCarGo:that.data.isCarGo,
      ts: +new Date()
    }
    util.getRequest(d,(res)=>{
      var data = res.data;
      var more = [];
      if(data.info == 1){
        // 替换时间
        data.list.forEach((item) => {
          item.add_time = util.personLocalTime(item.add_time)
        })
        that.setData({
          messages:this.data.messages.concat(data.list),
          loadMore:true,
          page:this.data.page + 1
        })
        app.close = false;
      }else{
        that.setData({
          loadMore:true,
          showMsgAll: true
        })
      }
    })
  },
  toLower:function(){
    if(app.close) return;
		this.loadMore()
	},
  onShareAppMessage:function(){
		return this.data['sharesContent']
	}
})
