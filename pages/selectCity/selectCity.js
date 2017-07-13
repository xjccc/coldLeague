var app = getApp(),
    util = require('../../utils/util.js'),
		UT = require('../../utils/request.js');
Page({
  data:{
    list:[],
    messages:[],
    showSelectCity:true,
    provinceId: '',
    province: '',
    page: 1,
    loading:true,
    loadMore:true,
    end:false,
    activeIndex: -1,
    search: '搜索货源',
    lastMessageId: '',
    scrollStatus: true
  },
  onLoad:function(options){
    var cityList = wx.getStorageSync('cityList')
    if(cityList){
      this.setData({
        list:cityList
      })
    }else{
      this.getCityList()
    }
  },
  getCityList () {  // 获取省份列表
    var that = this
    let data = {
      c:'carnewapi',
      m:'getcitylist',
      ts:+ new Date()
    }
    util.getRequest(data,(res) => {
      this.setData({
        list:res.data
      })
      wx.setStorage({  // 缓存省份
        key:'cityList',
        data:res.data
      })
    })
  },
  getCargoList () {  // 获取省份搜索货源信息
    var that = this
    let data = {
      c:'carnewapi',
      m:'getcitycargolist',
      provinceId:that.data.provinceId,
      page:that.data.page,
      isCarGo: 1,
      ts:+ new Date()
    }
    util.getRequest(data,(res) => {
      if(res.data.info != '2'){
        var c = []
        var data = res.data
        for (let key in data) {
          c.unshift(data[key])
        }
        // 替换时间
        c.forEach((item) => {
          item.add_time = util.getLocalTime(item.add_time)
        })
        // 替换关键字
        let a = that.data.province
        util.replaceKeyWord(c,a)
        that.setData({
          messages:c,
          lastMessageId:'maxlength',
          loading:true
        })
      } else {
        that.setData({
          messages: [],
          loading: true
        })
      }
    })
  },
  loadMore () { // 加载更多
    if(app.load) return
    app.load = true
    var that = this
    var id = that.data.messages[0].id
    that.setData({
				page:that.data.page + 1,
        loadMore:false,
        scrollStatus: false
			})
    let data = {  // 身份筛选data
      c:'carnewapi',
      m:'getcitycargolist',
      provinceId:that.data.provinceId,
      page:that.data.page,
      isCarGo: 1,
      ts:+ new Date()
    }
    util.getRequest(data,(res) => { // 省份筛选
      if(res.data.info !== 2){
        var c = []
        for (let key in res.data) {
          c.unshift(res.data[key])
        }
        // 替换时间
        c.forEach((item) => {
          item.add_time = util.getLocalTime(item.add_time)
        })
        // 替换关键字
        let a = that.data.province
        util.replaceKeyWord(c,a)
        
        that.setData({
          messages:c.concat(that.data.messages),
          scrollStatus: true
        })
        setTimeout(() => {
          that.setData ({
            lastMessageId :'item_' + id,
            loadMore:true
          })
        }, 0)
      } else {
        that.setData({
          end:true,
          loadMore:true,
          scrollStatus: true
        })
      }
      app.load = false
    })
  },
  makePhoneCall:function(e){ // 拨打电话
    var item = e.target.dataset.item
    var content = e.target.dataset.content
    var id = e.target.dataset.id
    util.makeCallToOthers(item,content,id)
  },
  selectedItem (e) { // 选择省份
    if(e.target.dataset.item == this.data.province) return
    this.setData({
      provinceId:e.target.dataset.id,
      province:e.target.dataset.item,
      activeIndex:e.target.dataset.index,
      page:1,
      end:false,
      search:e.target.dataset.item,
      messages: [],
      showSelectCity:false,
      loading:false
    })
    this.getCargoList()
  },
  closeShow () {  // 点击关闭弹层
    this.setData({
      showSelectCity:false
    })
  },
  showSearch () { // 显示弹层
    this.setData({
      showSelectCity:true
    })
  },
  goodToEdit () {  // 发布车源
    wx.navigateTo({
      url:'../add/add'
    })
  },
  jumpToUserCenter (e) { // 跳转个人中心
    let nickname = e.target.dataset.nickname
    let avatar = e.target.dataset.avatar
    let unionId = e.target.dataset.unionid
    let openid = e.target.dataset.openid
    util.jumpToUserCenter (unionId,nickname,avatar,1,openid)
  },
  toUpper:function(){ // 下拉加载
    if(this.data.end) return
    this.loadMore()
  }
})
