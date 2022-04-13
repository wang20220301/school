<template>
  <div class="app-container">
    <div class="head">
      <div class="title">
        <p>时段管理模板</p>
      </div>
      <div class="instructions">
        <p>
          <span style="color: #f56c6c">限制学生使用,</span>
          在某些时段不可以使用柜机
        </p>
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
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('序号')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.grade }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('时段名称')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('描述')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('来源')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('时间')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('状态')" width="110px" align="center">
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[13]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paging.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
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
    return {
      value: "",
      currentPage4: 1,
      paging: {},
      block: true,
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      dialogFormVisible: false,
      dialogPvVisible: false,
      pvData: [],
      downloadLoading: false,
    };
  },
  created() {
    // 进入页面获取数据
  },
  methods: {
    //  点击搜索获取表单数据,发送请求搜索
  },
};
</script>

<style scoped>
.now-wrap {
  display: flex;
  align-items: center;
  margin: auto;
  justify-content: center;
}
.now-wrap div {
  margin-left: 10px;
}
.title {
  padding-left: 20px;
  padding-top: 20px;
}
.instructions {
  padding-left: 20px;
}
.instructions p {
  width: 550px;
  font-size: 14px;
  font-family: Source Han Sans CN, Source Han Sans CN-Regular;
  font-weight: 400;
  text-align: LEFT;
  color: #909399;
  line-height: 14px;
}
.title p {
  width: 150px;
  height: 27px;
  margin: 0px;
  font-size: 18px;
  font-family: Source Han Sans CN, Source Han Sans CN-Bold;
  font-weight: 700;
  text-align: LEFT;
  color: #606266;
  line-height: 18px;
}
.head {
  margin-bottom: 20px;
  height: 100px;
  background: #f8f9fb;
}
.block {
  padding-top: 20px;
}
</style>
