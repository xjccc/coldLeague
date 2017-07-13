# coldLeague
冷藏联盟

### 合法域名

```
url: https://56-api.kcimg.cn/
```

### 获取openid接口

#### 传入参数

```
data:{
  c=caruser,
  m=coollogin,  
  code=0031fFs21IBwQM1Fols21txXs211fFsT,
  ts:+ new Date()  
}
```

#### 返回数据

```
msg:"oCuLv0GnvwF3rAi-HInXBdekealo"     对应的openid
status:1
```

### 获取unionid接口

```
url: https://56-api.kcimg.cn/wx/coolProject.php
```

#### 传入参数：

```
data:{
  code:r.code,
  encryptedData:res.encryptedData,   
  iv:res.iv,
  ts:+ new Date()  
}
```

#### 返回数据

```
返回codes 包含用户信息，openid，unionid等
```

### 获取首页列表接口

#### 传入参数

```
data:{
  c=carrefrigerateapi,
  m=getlist,     // 获取首页列表
  id=,            // 传入id 初始为空，下拉加载
  isCarGo=1,      // 货源为1 车源为2
  ts:+ new Date()  
}
```

#### 返回数据

```
data{
  info: 1,
  list:[
    {
      add_time:"1499846984",    // 添加时间
      click_phone:"0",          // 点击拨打次数
      form_id:"the formId is a mock one",   // 提交的formid
      id:"1",  // 货源id值
      open_id:"oCuLv0GnvwF3rAi-HInXBdekealo",  // 用户openid
      phone_num:[["18911900055"]],   // 用户电话
      status:"1",   // 发布状态
      unionId:"oEf6h0e_6etGVQ8gGVsZMWwKXLtQ",  // 用户的unionid
      user_content:"长春到昆明，需16.5厢车↵天津到济南，需16.5厢车↵",  // 用户发布内容
      user_name:"路遥",  // 用户昵称
      user_photo:"https://wx.qlogo.cn/mmopen/vi_32/ia3D7VYPwKffA3Hjic2jN4epJ0fklGpQ4bPic2fKgah4H3N70LLb3wlAekjibobhmxE8L6FNQKMB3Xefzicz55zbfXg/0"   // 用户头像
    }
  ]
}
```

### 储存用户身份信息

#### 传入参数

```
data:{
  c:'carrefrigerateapi',
  m:'saveuserposition',
  openId: app.uid,
  position: type
}
```

####  返回1为成功


### 进行用户信息储存

#### 传入参数

```
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
}
```

#### 返回1为成功,3为无身份,2为已存储


### 查询用户身份

#### 传入参数

```
data:{
  c:'carrefrigerateapi',
  m:'getuserposition',
  openId:app.uid
}
```

####  返回数据

```
data:{
  position: 2     // 1为车主，2为货主，3为无身份
}
```

### 提交表单

#### 传入参数

```
data:{
  c: 'carrefrigerateapi',
  m: 'savecargo',
  isCarGo: 1,   // 用户身份，1为货主，2为车主
  openId: app.uid,
  userName:userInfo.userName,
  photo:userInfo.photo,
  formId: e.detail.formId,
  content: c,    // 输入内容
  ts:+new Date()
}
```

#### 返回数据

```
data:{
  info: 1    // 1为发布成功，2为发布不成功，3为被拉黑
}
```

###  获取城市列表

#### 传入参数

```
data:{
  c:'carnewapi',
  m:'getcitylist',
  ts:+ new Date()
}
```

#### 返回参数

```
data:[
  {
    car_province:"京"
    id:"1"
    province:"北京"
    provinceid:"110000"
  }
]
```

### 获取省份搜索货源信息

#### 传入参数

```
data:{
  c:'carrefrigerateapi',
  m:'getcitycargolist',
  provinceId:that.data.provinceId,   // 省份id
  page:that.data.page,     // 请求页数
  isCarGo: 1,               // 1为货源，2为车源
  ts:+ new Date()
}
```

#### 返回参数

```
data:[
  {
    add_time:"1499915918"
    click_phone:"0"
    form_id:""
    id:"34850"
    open_id:"amlzdXBlaV9zaGVuZ3poZW5nd3Vs"
    phone_num:[["15201356407", "15210176588"]]
    status:"1"
    unionId:null
    user_content:"北京～～虎门菜需15米冷藏车↵北京～～广州蔬菜需15米冷藏车，↵张北～～广州蔬菜需15米冷藏车，↵张北～～虎门菜需15米13.7米12.5米冷藏车，↵廊坊～～凭祥卸货的蔬菜需15米13.7米冷藏车，↵张北～～广西南宁蔬菜需15米13.7米冷藏车，↵张北～～福建福州，厦门，泉州蔬菜需15米冷藏车，↵山东寿光～～广州，虎门萝卜需15米冷藏车↵山东寿光～～昆明萝卜需15米冷藏车↵.（微信同号），天天发货。空车来电，↵杨"
    user_name:"升正物流"
    user_photo:"https://s.kcimg.cn/gisopic/avatar/veimg-132.jpg"
  }
]
```

### 个人中心

#### 传入参数

```
data:{
  c:'carrefrigerateapi',
  m:'getsharedatelist',
  page: this.data.page, // 请求页数
  unionId:unionId,
  openid: openid,
  isCarGo:isCarGo,  // 用户身份
  ts: +new Date()
}
```

#### 返回数据

```
data:[
  info: 1,  // 1为有数据，2为没有数据，没有数据的时候，没有list
  list:[
    {
      add_time:"1499847861"
      click_phone:"0"
      form_id:"the formId is a mock one"
      id:"5"
      open_id:"oCuLv0GnvwF3rAi-HInXBdekealo"
      phone_num:[["18920859907"]]
      status:"1"
      user_content:"胜芳到西安户县要13米高栏拉钢管33吨"
      user_name:"路遥"
      user_photo:"https://wx.qlogo.cn/mmopen/vi_32/ia3D7VYPwKffA3Hjic2jN4epJ0fklGpQ4bPic2fKgah4H3N70LLb3wlAekjibobhmxE8L6FNQKMB3Xefzicz55zbfXg/0"
    }
  ]
]
```
