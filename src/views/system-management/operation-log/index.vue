<template>
  <div class="app-container">
    <div class="head">
      <div class="filter-container">
        <el-date-picker
          v-model="value"
          type="daterange"
          style="height: 35px"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button type="primary" style="margin-left: 20px">下载日志</el-button>
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
      <el-table-column :label="$t('角色信息')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('设备名称')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.class }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('柜格')" width="" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作')" width="110px" align="center">
        <template slot-scope="{ row }">
          <span style="color: red">{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('操作时间')" width="" align="center">
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
// import { fetchPv } from "@/api/article";
import waves from "@/directive/waves"; // waves directive
// import { parseTime } from "@/utils";
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
.head {
  display: flex;
}
.block {
  padding-top: 20px;
}
</style>
