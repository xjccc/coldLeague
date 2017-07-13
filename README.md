# coldLeague
冷藏联盟

## 获取openid接口
---
`url: https://56-api.kcimg.cn/`
---
### 传入参数
`data:{   `
`  c=caruser, `  
  `m=coollogin,`   
  `code=0031fFs21IBwQM1Fols21txXs211fFsT,`   
  `ts:+ new Date()`   
`}`
---
### 返回数据
`msg:"oCuLv0GnvwF3rAi-HInXBdekealo"     对应的openid   `   
`status:1`
---
## 获取unionid接口
---
`url: https://56-api.kcimg.cn/wx/coolProject.php`
---
### 传入参数：
`data:{`   
  `code:r.code,`   
  `encryptedData:res.encryptedData,`   
  `iv:res.iv,`   
  `ts:+ new Date()`   
`}` 
---
