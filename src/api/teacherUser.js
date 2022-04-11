import request from '@/utils/request'

 let getTeacherMsg=(type,data)=> {
    //  工厂
    console.log(type,"打印他的类型")
  let obj={
      add:"/add",
      list:"/teacher_list",
      updata:"/update_users",
      del:"/del_teacher",
      search:"/search_teachers",
      loa:"/teacher_export",
      import:"/teacher_import",
      class:"/show_class",
      load:"/teacher_export",
      id:"/all_monitor"
  }
  let url=`/api/teacher${obj[type]}`
  console.log(url,"值为")
  return request({
    url,
    method: 'post',
    data,
    // responseType: 'blob'
  })
}

export {
    getTeacherMsg
}