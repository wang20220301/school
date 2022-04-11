import { getMsg } from "@/api/studentUser"
import { getToken } from "@/utils/auth"
import { getTeacherMsg } from "@/api/teacherUser"
let getData = (type, obj, data) => {
    // 工厂模式
    console.log(type,obj)
    let utils = {
        token: getToken(),
        get: getMsg,
        get2:getTeacherMsg
    }
    // 列表数据
    let gitTeacherMsg = (obj,value) => {
        // 请求数据显示loading图标
        obj.listLoading = true;
        let data = {
            page: value,
            page_num: "13",
            token: utils.token
        }
        utils.get("list", data).then(res => {
            obj.list = res.data.list
            console.log(res.data.page,)
            obj.paging.page=res.data.page*1
            obj.paging.total=res.data.total*1
            obj.listLoading = false
        })

    }
    //  获取学科年级，班级
    let gitClass = async (obj) => {
        let data = {
            token: utils.token
        }
        let res = await utils.get2("class", data)
        obj.importanceOptions = res.data.grade
        obj.calendarTypeOptions = res.data.class
        obj.subject = res.data.subject

    }

    // //  获取柜机id
    // let gitId = async (obj) => {
    //     let data = {
    //         token: utils.token
    //     }
    //     let res = await utils.get("id", data)
    //     obj.group_id = res.data
    // }

    // 添加学生
    let gitAdd = async (obj, data) => {
        data.token = utils.token
        let arr=data.time
        data.admission_time=arr[0]
        data.graduation_time=arr[1]
        console.log(data.token,"的值为")
        let res = await utils.get("add", data)
        obj.code = res.err_code
    }
    //  搜索
    let gitSearch = (obj, data) => {
        // 请求数据显示loading图标
        obj.listLoading = true;
        data.token = utils.token
        utils.get("search", data).then(res => {
            obj.list = res.data
            obj.listLoading = false
        })
    }
    //  编辑或更新

     let  update=async (obj,data)=>{
         data.token=utils.token
         let res= await utils.get("updata",data)
         obj.code=res.err_code
     }
    //  删除
    let del= (obj,data)=>{
        let msg={
            token:utils.token,
            user_id:data
        }
         utils.get("del",msg)
    }
    // 下载名册
    let gitClaod = async () => {
        let data = {
            page: 100,
            page_num: "1",
            token: utils.token
        }
        utils.get("load", data).then(res => {
            console.info("打印错误信息", res)
        })
    }
    switch (type) {
        case 'List':
            return gitTeacherMsg(obj,data);
            break;
        case 'Class':
            return gitClass(obj);
            break;
        case "load":
            return gitClaod(obj)
            break;
        case "Add":
            return gitAdd(obj, data)
            break
        case "search":
            return gitSearch(obj, data)
        case "update":
            return update(obj,data)
        case "del":
            return del(obj,data)
        default:
            throw new Error('参数错误')
    }
}



export {
    getData
}








