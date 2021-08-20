// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.api) {
    case 'login': {
    return 1;
      const res = await db.collection('admin_user').where({
        userId:event.userId
      }).get()
      if(res.data.length){
        if(res.data[0].password === event.password){
            return {code:1,data:res.data[0],msg:'登录成功'}
        }
        else{
            return {code:1,msg:'账号或密码错误'}
        }
      }
      else{
        return {code:-1,msg:'用户不存在'}
      }
      
    }
  }

}