<template>
  <div class="app-container">
    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20" class="addRow">
        <el-col :span="8">
          <el-input
            placeholder="根据电影名查询"
            v-model="queryInfo.name"
            clearable
            @clear="fetchData"
            @input="searchList"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchList">
            </el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格视图区域 -->
      <el-table
        :cell-style="rowStyle"
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column header-align="center" prop="name" label="电影名" width="150px" fixed>
          <template scope="scope">
            <el-tooltip :content="scope.row.name" placement="top">
              <div
                style="
                  overflow: hidden;
                  display: -webkit-box;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  white-space: normal;
                "
              >
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          prop="descri"
          label="描述"
          width="300"
        >
          <template scope="scope">
            <el-tooltip :content="scope.row.descri" placement="top">
              <div
                style="
                  overflow: hidden;
                  display: -webkit-box;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  white-space: normal;
                "
              >
                {{ scope.row.descri }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          label="电影时长(分)"
          prop="timelong"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="shoot"
          header-align="center"
          label="电影拍摄日期"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="issue"
          header-align="center"
          label="电影发行日期"
          width="120"
        ></el-table-column>
        <el-table-column prop="language" header-align="center" label="电影语言">
        </el-table-column>
        <el-table-column prop="genres" header-align="center" label="电影类别">
        </el-table-column>
        <el-table-column prop="director" header-align="center" label="导演">
        </el-table-column>
        <el-table-column prop="actors" header-align="center" label="演员">
          <template scope="scope">
            <el-tooltip :content="scope.row.actors" placement="top">
              <div
                style="
                  overflow: hidden;
                  display: -webkit-box;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  white-space: normal;
                "
              >
                {{ scope.row.actors }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          label="上传时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="updateTime"
          header-align="center"
          label="最近一次更新时间"
          width="200"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.$index, userData)"
              type="text"
              size="small"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.curPage"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getList } from "@/api/movie";
export default {
  methods: {
    rowStyle() {
      return "text-align:center";
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    async searchList() {
      if (this.queryInfo.username == "") {
        this.fetchData();
        return;
      }
      this.listLoading = true;
      getList(this.queryInfo).then((response) => {
        if (response.code !== 200) {
          return this.$message.error(response.message);
        } else {
          this.tableData = response.obj.objs;
          this.listLoading = false;
          this.totalCount = response.obj.count;
        }
      });
    },
    async fetchData() {
      this.listLoading = true;
      getList(this.queryInfo).then((response) => {
        if (response.code !== 200) {
          return this.$message.error(response.message);
        } else {
          this.tableData = response.obj.objs;
          this.listLoading = false;
          this.totalCount = response.obj.count;
        }
      });
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.fetchData();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.curPage = newPage;
      this.fetchData();
    },
  },
  data() {
    return {
      tableData: null,
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        name: "",
      },
      totalCount: 0,
    };
  },
  created() {
    this.fetchData();
  },
};
</script>
