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
        <el-col :span="4">
          <el-button type="primary" @click="addMovie"> 添加电影 </el-button>
        </el-col>
      </el-row>

      <!-- 表格视图区域 -->
      <el-table
        :cell-style="rowStyle"
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="expand" fixed>
          <template slot-scope="data">
            <span class="demonstration">电影海报</span>
            <div style="margin-top: 10px">
              <el-image
                style="width: 100px; height: 100px"
                :src="data.row.posterURL"
                :fit="fill"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          prop="name"
          label="电影名"
          width="150px"
          fixed
        >
          <template slot-scope="scope">
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
          <template slot-scope="scope">
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
          <template slot-scope="scope">
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
              type="danger"
              icon="el-icon-delete"
              @click.native.prevent="remove(scope.row.id)"
              size="mini"
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
import { getList, delMovieById } from "@/api/movie";
export default {
  methods: {
    addMovie() {
      this.$router.push({ name: "添加电影" });
    },
    rowStyle() {
      return "text-align:center";
    },
    async remove(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该记录，是否继续？",
        "dangerous!",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消删除！");
      } else {
        delMovieById(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.fetchData();
          }
        });
      }
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
    console.log(this.$store.state.user);
  },
};
</script>
