import { getMsg } from "@/api/device"
import { getToken } from "@/utils/auth"
// import { getTeacherMsg } from "@/api/teacherUser"
let getData = (type, obj, data) => {
    // 工厂模式
    console.log(type, "进入到这里")
    let utils = {
        token: getToken(),
        get: getMsg,
    }
    // 列表数据
    let gitTeacherMsg = (obj, value) => {
        // 请求数据显示loading图标
        obj.listLoading = true;
        let data = {
            page: value,
            page_num: "13",
            token: utils.token
        }
        utils.get("list", data).then(res => {
            obj.list = res.data.list
            obj.paging.page = res.data.page * 1
            obj.paging.total = res.data.total * 1
            obj.listLoading = false
        })

    }
    // 添加学生
    let gitAdd = async (obj, data) => {
        data.token = utils.token
        let res = await utils.get("add", data)
        return res.err_code
    }
    //  搜索
    let gitSearch = (obj, data) => {
        let msg = {
            keyword: data,
            token: utils.token
        }
        utils.get("search", msg).then(res => {
            obj.list = res.data
            obj.listLoading = false
        })
    }
    //  编辑或更新

    let update = async (obj, data) => {
        data.token = utils.token
        let res = await utils.get("updata", data)
        return res.err_code
    }
    //  删除
    let del = (obj, data) => {
        let msg = {
            token: utils.token,
            group_id: data
        }
        utils.get("del", msg)
    }
    // 获取规格信息
    let box = (obj) => {
        let data = {
            token: utils.token
        }
        utils.get("box", data).then(res => {
            obj.box = res.data
        })
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
            return gitTeacherMsg(obj, data);
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
            return update(obj, data)
        case "del":
            return del(obj, data)
        case "box":
            return box(obj, data)
        default:
            throw new Error('参数错误')
    }
}



export {
    getData
}








