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
      <!-- <el-select
        v-model="listQuery.importance"
        :placeholder="$t('请选择年级')"
        clearable
        style="width: 140px"
        class="filter-item"
      >
        <el-option
          v-for="item in importanceOptions"
          :key="item"
          :label="item"
          :value="item"
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
          :key="item.key"
          :label="item.display_name + '(' + item.key + ')'"
          :value="item.key"
        />
      </el-select> -->
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
        {{ $t("添加学生") }}
      </el-button>
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        {{ $t("下载老师名册") }}
      </el-button> -->
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
      <el-table-column :label="$t('班级')" width="" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('班级')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.timestamp | parseTime("{y}-{m}-{d} {h}:{i}") }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('绑定老师')" width="">
        <template slot-scope="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{
            row.title
          }}</span>
          <el-tag>{{ row.type | typeFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('性别')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showReviewer"
        :label="$t('学科')"
        width="110px"
        align="center"
      >
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.reviewer }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('学校邮箱（登陆账号）')" width="">
        <template slot-scope="{ row }">
          <svg-icon
            v-for="n in +row.importance"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('登陆密码')" align="center" width="">
        <template slot-scope="{ row }">
          <span
            v-if="row.pageviews"
            class="link-type"
            @click="handleFetchPv(row.pageviews)"
            >{{ row.pageviews }}</span
          >
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('添加时间')" align="center" width="">
        <template slot-scope="{ row }">
          <span
            v-if="row.pageviews"
            class="link-type"
            @click="handleFetchPv(row.pageviews)"
            >{{ row.pageviews }}</span
          >
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('电话')" class-name="status-col" width="">
        <template slot-scope="{ row }">
          <el-tag :type="row.status | statusFilter"> </el-tag>
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
        <el-form-item :label="$t('角色')" prop="type">
          <el-select
            v-model="temp.type"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('姓名')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('手机号')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <div class="now-wrap">
          <el-form-item :label="$t('年级')">
            <el-select
              v-model="temp.status"
              class="filter-item"
              placeholder="Please select"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div>
            <el-form-item :label="$t('班级')">
              <el-select
                v-model="temp.status"
                class="filter-item"
                placeholder="Please select"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="now-wrap">
          <el-form-item :label="$t('性别')">
            <el-select
              v-model="temp.status"
              class="filter-item"
              placeholder="Please select"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div>
            <el-form-item :label="$t('学科')">
              <el-select
                v-model="temp.status"
                class="filter-item"
                placeholder="Please select"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="$t('账号')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
      </el-form>
      <!-- 选择，确定或取消 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t("table.cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          {{ $t("table.confirm") }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchPv,
  createArticle,
  updateArticle
} from "@/api/article";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
// 这里选择班级
const calendarTypeOptions = [
  { key: "CN", display_name: "一班" },
  { key: "US", display_name: "二班" },
  { key: "JP", display_name: "三班" },
  { key: "EU", display_name: "四班" },
];

// arr to obj, such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.display_name;
//   return acc;
// }, {});

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
    return {
      tableKey: 0,
      // 模拟数据
      list: [
        {
          id: 1,
          timestamp: 588136958915,
          author: "Ronald",
          reviewer: "Elizabeth",
          title:
            "Ctbvmppmlf Xnpoa Opmv Ebgjek Bfkzjoye Mfmyvdlbgr Rezb Dhjujdnxyr Cgj Vjdwg",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 86.78,
          importance: 2,
          type: "US",
          status: "published",
          display_time: "1975-03-28 11:01:31",
          comment_disabled: true,
          pageviews: 3685,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle:
            "Ctbvmppmlf Xnpoa Opmv Ebgjek Bfkzjoye Mfmyvdlbgr Rezb Dhjujdnxyr Cgj Vjdwg",
        },
        {
          id: 2,
          timestamp: 450579301723,
          author: "Betty",
          reviewer: "Deborah",
          title: "Orwc Nqkrazt Udmppo Hryuhvy Dky Mqbuujw Kqdectxdg",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 76.18,
          importance: 2,
          type: "US",
          status: "draft",
          display_time: "1982-04-15 18:17:41",
          comment_disabled: true,
          pageviews: 2068,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle: "Orwc Nqkrazt Udmppo Hryuhvy Dky Mqbuujw Kqdectxdg",
        },
        {
          id: 3,
          timestamp: 1552081935806,
          author: "Jennifer",
          reviewer: "Sarah",
          title: "Goyrqbc Ydvhzbkn Lhj Rndellrcbo Zuctnil",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 86.22,
          importance: 2,
          type: "EU",
          status: "published",
          display_time: "1991-06-23 03:52:00",
          comment_disabled: true,
          pageviews: 3473,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle: "Goyrqbc Ydvhzbkn Lhj Rndellrcbo Zuctnil",
        },
        {
          id: 4,
          timestamp: 155523994006,
          author: "Cynthia",
          reviewer: "Sarah",
          title:
            "Svwibwldxr Mrmahxeub Kncepb Lxgbomwn Jfuavlvn Aut Myy Gokoqvolpq Mdmfdr Opwiwk",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 53.58,
          importance: 2,
          type: "JP",
          status: "published",
          display_time: "1987-02-05 11:56:36",
          comment_disabled: true,
          pageviews: 774,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle:
            "Svwibwldxr Mrmahxeub Kncepb Lxgbomwn Jfuavlvn Aut Myy Gokoqvolpq Mdmfdr Opwiwk",
        },
        {
          id: 5,
          timestamp: 474696722757,
          author: "Joseph",
          reviewer: "Mary",
          title: "Owsidejiso Hzcf Mhclsc Duiv Kcdqclsc",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 59.19,
          importance: 2,
          type: "JP",
          status: "published",
          display_time: "1980-10-25 21:06:46",
          comment_disabled: true,
          pageviews: 3646,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle: "Owsidejiso Hzcf Mhclsc Duiv Kcdqclsc",
        },
        {
          id: 6,
          timestamp: 765704921734,
          author: "Michelle",
          reviewer: "Elizabeth",
          title:
            "Hdhbfscls Fulsow Jrsuvsyx Cddchvtywv Xpij Rlrgdomo Nchvnt Pgxuw Otcbhxuew",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 74.32,
          importance: 2,
          type: "CN",
          status: "published",
          display_time: "1971-12-30 02:01:02",
          comment_disabled: true,
          pageviews: 4300,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle:
            "Hdhbfscls Fulsow Jrsuvsyx Cddchvtywv Xpij Rlrgdomo Nchvnt Pgxuw Otcbhxuew",
        },
        {
          id: 7,
          timestamp: 1387853316487,
          author: "Jeffrey",
          reviewer: "Jennifer",
          title:
            "Nelvirt Wljlff Qbdowetnh Mszb Uqbyeix Lkqrtkwxt Ujdi Xyednaflt",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 60.26,
          importance: 3,
          type: "US",
          status: "published",
          display_time: "1999-04-26 12:23:18",
          comment_disabled: true,
          pageviews: 3651,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle:
            "Nelvirt Wljlff Qbdowetnh Mszb Uqbyeix Lkqrtkwxt Ujdi Xyednaflt",
        },
        {
          id: 8,
          timestamp: 436393361046,
          author: "George",
          reviewer: "Susan",
          title:
            "Hbrelh Ymtdxcz Echmm Yiygleghc Rjoaunsb Grgpyohjt Vytv Hukjtdihcm Wsrg",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 67.66,
          importance: 2,
          type: "JP",
          status: "published",
          display_time: "2008-05-08 16:11:13",
          comment_disabled: true,
          pageviews: 4910,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle:
            "Hbrelh Ymtdxcz Echmm Yiygleghc Rjoaunsb Grgpyohjt Vytv Hukjtdihcm Wsrg",
        },
        {
          id: 9,
          timestamp: 728429411293,
          author: "Karen",
          reviewer: "Elizabeth",
          title: "Eesmglefa Truv Qlury Clsp Bfxidgdac Imlgpdwp Gtkxwsawmb",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 31.74,
          importance: 1,
          type: "JP",
          status: "draft",
          display_time: "1997-08-31 17:01:38",
          comment_disabled: true,
          pageviews: 3525,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle:
            "Eesmglefa Truv Qlury Clsp Bfxidgdac Imlgpdwp Gtkxwsawmb",
        },
        {
          id: 10,
          timestamp: 1111425074833,
          author: "Betty",
          reviewer: "Charles",
          title: "Ygy Pfycs Thv Bpcjpzugc Laixumwc Ytujve Mopl Tmzbf",
          content_short: "mock data",
          content:
            '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>',
          forecast: 30.38,
          importance: 3,
          type: "US",
          status: "draft",
          display_time: "1997-09-30 07:45:40",
          comment_disabled: true,
          pageviews: 2811,
          image_uri:
            "https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3",
          platforms: ["a-platform"],
          edit: false,
          originalTitle: "Ygy Pfycs Thv Bpcjpzugc Laixumwc Ytujve Mopl Tmzbf",
        },
      ],
      total: 0,
      total2: 0,
      listLoading: true,
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
      importanceOptions: ["一年级", "二年级", "三年级", "四年级", "五年级"],
      calendarTypeOptions,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
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
        type: [
          { required: true, message: "type is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 进入页面获取数据
    getList() {
      // 请求数据显示loading图标
      this.listLoading = false;
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   // 请求完成隐藏loding图标
      //   // Just to simulate the time of the request
      //   setTimeout(() => {
      //     this.listLoading = false
      //   }, 1.5 * 1000)
      // })
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
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
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
          this.temp.author = "vue-element-admin";
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
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
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
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
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = ["timestamp", "title", "type", "importance", "status"];
        const filterVal = [
          "timestamp",
          "title",
          "type",
          "importance",
          "status",
        ];
        const data = this.formatJson(filterVal);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list",
        });
        this.downloadLoading = false;
      });
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
.head{
  display: flex;
}
</style>
