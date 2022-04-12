import request from '@/utils/request'

 let getMsg=(type,data)=> {
    //  工厂
    console.log(type,"打印他的类型")
  let obj={
      add:"/add",
      list:"/show_monitor",
      updata:"/monitor_modify",
      del:"/del_monitors",
      search:"/select_monitor",
      import:"/teacher_import",
      details:"/monitor_detail",
      control:"/monitor_control",
      box:"/get_monitor_kind"
      
  }
  let url=`/api/monitor${obj[type]}`
  console.log(url,"值为")
  return request({
    url,
    method: 'post',
    data,
    // responseType: 'blob'
  })
}

export {
    getMsg
}