var app = getApp(),
    util = require('../../utils/util.js');
Page({
  data: {
    userInfo:{},
    sharesContent:{},
    lastMessageId:'',
    messages:[],
    messageContent: [],
    end:false,
    showStatement: false,
    id: '',
    unionId:'',
    mineUid: '',
    exist: false,
    loading:false,
    loadMore:true,
    scrollStatus:true,
    type: ''
  },
  listRender:function(...options){   // 渲染数据
    var that = this;
    var d = { // 请求的data
      c:'carrefrigerateapi',
      m:'getlist',
      id: that.data.id,
      isCarGo: 1,
      ts:+new Date()
    }
    util.getRequest(d,(res)=>{
      var data = res.data
      if (!data.list) {
        that.setData({
          end:true,
          loading:true,
          type:options[1].data.type
        })
      } else {
        if(data.list.length < 40){
          that.setData({
            end:true
          })
        }
        data.list.forEach((item) => {
          item.add_time = util.getLocalTime(item.add_time)
        })
        that.setData({
          messages:data.list
        })
        that.setData({
          lastMessageId:'maxlength',
          loading:true,
          type:options[1].data.type
        })
      }
    })
  },
  loadMore:function(){   // 下拉加载更多
    if(app.load || (this.data.messages.length < 40)) return;
    app.load = true;   /// 判断是否在进行loadmore
    var id = this.data.messages[0].id
    this.setData({
      loadMore:false,
      scrollStatus:false
    })
    var d = {
      c:'carrefrigerateapi',
      m:'getlist',
      id: id,
      isCarGo: 1,
      ts:+new Date()
    }
    util.getRequest(d,(res)=>{
      var data = res.data;
      if(data.info == 1){
        data.list.forEach((item) => {
          item.add_time = util.getLocalTime(item.add_time)
        })
        this.setData({
          messages: data.list.concat(this.data.messages),
          scrollStatus: true
        })
        this.setData ({
          lastMessageId: 'item_' + id,
          loadMore: true
        })
        app.load = false;
      }else{
        this.setData({
          end:true,
          loadMore:true,
          scrollStatus:true
        })
      }
    })
  },
  toUpper:function(){ // 下拉加载
    if (app.load) return
    this.loadMore()
  },
  carType (type) {  // 储存用户身份
    wx.request({
      url:app.ajaxurl,
      data:{
        c:'carrefrigerateapi',
        m:'saveuserposition',
        openId: app.uid,
        position: type
      }
    })
  },
  showTheSelectCity () {
    wx.navigateTo({
      url:'/pages/selectCity/selectCity'
    })
  },
  saveUserInfo (unionId) {
    var that = this
    wx.request({ // 进行用户信息储存
      url:app.ajaxurl,
      data:{
        c:'carrefrigerateapi',
        m:'savelittleuserinfo',
        unionId:unionId,
        openId:app.uid,
        nickName:that.data.userInfo.nickName,
        headImgUrl:that.data.userInfo.avatarUrl,
        sex:that.data.userInfo.gender,
        language:that.data.userInfo.language,
        country:that.data.userInfo.country,
        province:that.data.userInfo.province,
        city:that.data.userInfo.city
      },
      success:function(res){
        if(res.data.data.info == '1' || res.data.data.info == '3'){
          that.carType(that.data.type)
        }
      }
    })
  },
  searchType (...options) { // 重新获取一下身份
    let that = this
    wx.request({
      url:app.ajaxurl,
      data:{
        c:'carrefrigerateapi',
        m:'getuserposition',
        openId:app.uid
      },
      success:function(res){
        var position = res.data.data.position
        if(position == '2' || position == '1'){
          that.setData({
            type: position
          })
          // 没有unionid 无法获取个人中心页。
          var unionId = wx.getStorageSync('unionId')
          // 获取到type才能设置分享 否则无法获取
          app.getUserInfo(function(userInfo){
            let nickname = userInfo.nickName
            let avatar = userInfo.avatarUrl
            // 货主登陆统计
            if (unionId && position == '2') {
              util.analytics({
                t:'event',
                ec:'货主登陆',
                ea:'货主登陆',
                el:nickname
              })
              app.searchType = true
              console.log('货主登陆')
            }
            if (position == '1') return
        		that.setData({
              userInfo:userInfo,
              sharesContent:{
                title: nickname + "的货源",
                path:'/pages/close/close?unionId=' + unionId + '&nickname=' + nickname + '&avatar=' + avatar + '&isCarGo=1' + '&openid=' + that.data.mineUid
              }
        		})
        	})
        } else {
          wx.hideShareMenu()
        }
      }
    })
  },
  onLoad: function (e) {
    if(this.loaded) return;
    if(e.from){  // 判断是否通过选择身份进入的
      this.setData({
        type:e.type,
        select:e.from
      })
    }else{
      util.getUserInfo(this.searchType,this)
    }
    if(!app.uid){
      util.getUserInfo(this.listRender,this)
    }else{
      this.listRender(app.uid,this)
    }
    var that = this
    var unionId = wx.getStorageSync('unionId')
    var mineUid = wx.getStorageSync('userid')
    that.setData({
      mineUid: mineUid
    })
    if(unionId && that.data.select){
      that.saveUserInfo(unionId)
    }
  },
  onShow:function(){
    if(this.loaded){
      this.listRender(app.uid,this)
      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo && !app.searchType) {
        util.getUserInfo(this.searchType,this)
        app.searchType = true
      }
    }else{
      this.loaded = true
    }
  },
  callToUs () {  // 联系客服
    util.makeCallToUs()
  },
  makePhoneCall:function(e){  // 拨打电话
    var item = e.target.dataset.item
    var content = e.target.dataset.content
    var id = e.target.dataset.id
    util.makeCallToOthers(item,content,id)
  },
  goodsToEdit:function(){
    wx.navigateTo({
      url:'/pages/add/add'
    })
  },
  showStatement () { // 显示声明
    this.setData({
      showStatement: true,
      scrollStatus: false
    })
  },
  cancleStatement () { // 取消声明
    this.setData({
      showStatement: false,
      scrollStatus: true
    })
  },
  jumpToUserCenter (e) { // 跳转别人个人中心
    let nickname = e.target.dataset.nickname
    let avatar = e.target.dataset.avatar
    let unionId = e.target.dataset.unionid
    let openid = e.target.dataset.openid
    util.jumpToUserCenter (unionId,nickname,avatar,1,openid)
  },
  jumpToMineCenter () { // 跳转自己个人中心
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {

    }
    let unionId = wx.getStorageSync('unionId')
    if(!unionId) return
    util.jumpToUserCenter(unionId,this.data.userInfo.nickName,this.data.userInfo.avatarUrl,1,this.data.mineUid)
  },
  onShareAppMessage:function(){
    return this.data['sharesContent']
	}
})
