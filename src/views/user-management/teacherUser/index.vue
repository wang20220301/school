<template>
  <div class="app-container">
    <div class="head">
      <div class="filter-container">
        <el-input
          v-model="listQuery.title"
          :placeholder="$t('输入电话或姓名')"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <el-select
          v-model="listQuery.importance"
          :placeholder="$t('请选择年级')"
          clearable
          style="width: 140px"
          class="filter-item"
        >
          <el-option
            v-for="item in importanceOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="listQuery.type"
          :placeholder="$t('请选择班级')"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in calendarTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          @click="handleFilter"
        >
          {{ $t("搜索") }}
        </el-button>
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate"
        >
          {{ $t("添加老师") }}
        </el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          icon="el-icon-download"
          @click="handleDownload"
        >
          {{ $t("下载老师名册") }}
        </el-button>
      </div>
      <div style="margin-left: 20px">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button type="primary" class="el-icon-upload2"
            >导入更新老师列表</el-button
          >
        </el-upload>
      </div>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :max-height="currentHeight"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('年级')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('班级')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('绑定老师')" width="">
        <template slot-scope="{ row }">
          <span>{{ row.real_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('性别')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        :label="$t('学科')"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('学校邮箱（登陆账号）')" width="">
        <template slot-scope="{ row }">
          <span>
            {{ row.username }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('添加时间')" align="center" width="">
        <template slot-scope="{ row }">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('电话')" class-name="status-col" width="">
        <template slot-scope="{ row }">
          <span>
            {{ row.mobile }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('操作')"
        align="center"
        width=""
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t("编辑") }}
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t("删除") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog title="添加老师" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item :label="$t('角色')" prop="value">
          <el-input v-model="value" disabled />
        </el-form-item>
        <el-form-item :label="$t('姓名')" prop="real_name">
          <el-input v-model="temp.real_name" />
        </el-form-item>
        <el-form-item :label="$t('电话')" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item :label="$t('分配柜机')" prop="subjext">
          <el-select
            v-model="temp.subjext"
            class="filter-item"
            placeholder="选择柜机"
          >
            <el-option
              v-for="item in subject"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="now-wrap">
          <el-form-item :label="$t('年级')" prop="grade">
            <el-select
              v-model="temp.grade"
              class="filter-item"
              placeholder="选择年级"
            >
              <el-option
                v-for="item in importanceOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div>
            <el-form-item :label="$t('班级')" prop="class">
              <el-select
                v-model="temp.class"
                class="filter-item"
                placeholder="选择班级"
              >
                <el-option
                  v-for="item in calendarTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="now-wrap">
          <el-form-item :label="$t('性别')" prop="sex">
            <el-select
              v-model="temp.sex"
              class="filter-item"
              placeholder="选择性别"
            >
              <el-option
                v-for="item in sex"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div>
            <el-form-item :label="$t('学科')" prop="subjext">
              <el-select
                v-model="temp.subject"
                class="filter-item"
                placeholder="选择学科"
              >
                <el-option
                  v-for="item in subject"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>

        <el-form-item :label="$t('账号')" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
      </el-form>
      <!-- 选择，确定或取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("取消") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("确定") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { getData } from "./api";
// 这里选择班级
const calendarTypeOptions = [
  { key: "CN", display_name: "一班" },
  { key: "US", display_name: "二班" },
  { key: "JP", display_name: "三班" },
  { key: "EU", display_name: "四班" },
];

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "SchoolUser",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    // 验证用户名不能为空,用户名不能超过6个字符
    let validatePass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("姓名不能为空"));
      } else if (value.length > 5) {
        return callback(new Error("姓名最多不能超过6个字符"));
      } else {
        return callback();
      }
    };
    let validatePass5 = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请选择柜机"));
      } else {
        return callback();
      }
    };
    let validatePass6 = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请选择年级"));
      } else {
        return callback();
      }
    };
    let validatePass7 = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请选择班级"));
      } else {
        return callback();
      }
    };
    let validatePass8 = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请选择性别"));
      } else {
        return callback();
      }
    };
    let validatePass9 = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请选择学科"));
      } else {
        return callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5]{2,4}$/;
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else if (value.length > 5) {
        return callback(new Error("账号最多不能超过6个字符"));
      } else if (reg.test(value)) {
        return callback(new Error("账号最多不能为中文"));
      } else {
        return callback();
      }
    };
    var checkAge2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      }
      let pattern = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      setTimeout(() => {
        if (!pattern.test(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      }, 1000);
    };
    let validatePass4 = (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5]{2,4}$/;
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else if (reg.test(value)) {
        return callback(new Error("密码不能为中文"));
      } else if (value.length > 10) {
        return callback(new Error("密码不能超过10个字符"));
      } else {
        return callback();
      }
    };
    return {
      value: "老师",
      tableKey: 0,
      subject: "",
      // 模拟数据
      list: [],
      total: 0,
      listLoading: false,
      // from表单或输入框默认显示值
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      currentHeight: 500,
      // 选择年级
      importanceOptions: [],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      sex: ["男", "女"],
      showReviewer: false,
      // 添加老师
      temp: {
        id: 4,
        real_name: "",
        grade: "",
        class: "",
        importance: 1,
        mobile: "",
        remark: "",
        sex: "",
        subjext: "",
        username: "",
        password: "",
        timestamp: new Date(),
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        real_name: [{ validator: validatePass, trigger: "blur" }],
        mobile: [{ validator: checkAge2, trigger: "blur" }],
        username: [{ validator: validatePass2, trigger: "blur" }],
        password: [{ validator: validatePass4, trigger: "blur" }],
        subjext: [{ validator: validatePass5, trigger: "blur" }],
        grade: [{ validator: validatePass7, trigger: "blur" }],
        class: [{ validator: validatePass6, trigger: "blur" }],
        sex: [{ validator: validatePass8, trigger: "blur" }],
        subjext: [{ validator: validatePass9, trigger: "blur" }],
      },
      downloadLoading: false,
    };
  },
  created() {
    // 进入页面获取数据
    getData("ListMsg", this);
    getData("Class", this);
  },
  methods: {
    //  点击搜索获取表单数据,发送请求搜索
    handleFilter() {
      console.log(this.$data.listQuery, "121343");
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      // this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        // valid判断是否验证通过
        if (valid) {
          // 这里发送请求添加老师数据
          // 需要使用自定义方法
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            // this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 在这里更新数据
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        // 验证是否通过
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          console.log(this.temp, "编辑或更新");
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        duration: 2000,
      });
      this.list.splice(index, 1);
    },
    handleFetchPv(pv) {
      // fetchPv(pv).then((response) => {
      //   this.pvData = response.data.pvData;
      //   this.dialogPvVisible = true;
      // });
    },
    handleDownload() {
      // this.downloadLoading = true;
      // import("@/vendor/Export2Excel").then((excel) => {
      //   const tHeader = ["timestamp", "title", "type", "importance", "status"];
      //   const filterVal = [
      //     "timestamp",
      //     "title",
      //     "type",
      //     "importance",
      //     "status",
      //   ];
      //   const data = this.formatJson(filterVal);
      //   excel.export_json_to_excel({
      //     header: tHeader,
      //     data,
      //     filename: "table-list",
      //   });
      //   this.downloadLoading = false;
      // });
    },
    formatJson(filterVal) {
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style scoped>
.now-wrap {
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: center;
  /* background: red; */
}
.now-wrap div {
  margin-left: 10px;
}
.head {
  display: flex;
}
</style>
