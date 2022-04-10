import { getTeacherMsg } from "@/api/teacherUser"
import { getToken } from "@/utils/auth"
// import { get } from "sortablejs"

// 结构采用mvc

let getData = (type, obj) => {
    console.log(obj)
    // 工厂模式
    let utils = {
        token: getToken(),
        get: getTeacherMsg
    }
    let gitTeacherMsg = (obj) => {
         // 请求数据显示loading图标
        obj.listLoading = true;
        let data = {
            page: "10",
            page_num: "1",
            token: utils.token
        }
        utils.get("list", data).then(res => {
            obj.list = res.data.list
            obj.listLoading = false
            console.log(res,"12121")
        })

    }
    //  获取学科年级，班级
    let gitClass= async (obj)=>{
        let data={
            token:utils.token
        }
        let res=await utils.get("class",data)
        obj.importanceOptions=res.data.grade
        obj.calendarTypeOptions=res.data.class
        obj.subject=res.data.subject
        
    }
    // 下载名册
    let gitClaod= async()=>{
        let data={
            page:100,
            page_num:"1",
            token:utils.token
        }
        utils.get("load",data).then(res=>{
            console.info("打印错误信息",res)
        })
    }
    switch (type) {
        case 'ListMsg':
            return gitTeacherMsg(obj);
            break;
        case 'Class':
            return gitClass(obj);
            break;
        case "load":
            return gitClaod(obj)
            break;
        default:
            throw new Error('参数错误')
    }
}




export {
    getData
}








