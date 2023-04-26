<template>
  <div class="app-container">
    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20" class="addRow">
        <el-col :span="4">
          <el-input
            placeholder="根据用户名查询"
            v-model="queryInfo.username"
            clearable
            @input="fetchData"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="根据文章标题查询"
            v-model="queryInfo.title"
            clearable
            @clear="fetchData"
            @input="fetchData"
          >
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            :format="'yyyy-MM-dd HH:mm:ss'"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            @change="showLogbyTime"
            @clear="clearTime"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 15px; margin-top: 15px">
        <el-col :span="6">
          <el-radio-group
            v-model="queryInfo.isAudited"
            @input="changeSelect"
            style="margin-top: 10px"
          >
            <el-radio :label="2">全部</el-radio>
            <el-radio :label="1">已审核文章</el-radio>
            <el-radio :label="0">未审核文章</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="2">
          <el-button
            type="danger"
            size="mini"
            @click="deletedBatch"
            v-show="selectList.length"
            round
          >
            批量删除
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            size="mini"
            @click="auditedByBatch"
            v-show="selectList.length"
            round
          >
            批量审核
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格视图区域 -->
      <el-table
        v-loading="listLoading"
        :data="tableData"
        style="width: 100%"
        ref="table"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed> </el-table-column>
        <el-table-column prop="username" width="100" label="用户名">
        </el-table-column>
        <el-table-column header-align="center" label="用户头像" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.userImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="title" width="100" label="文章标题">
        </el-table-column>
        <el-table-column prop="summary" width="100" label="摘要">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.summary" placement="top">
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
                {{ scope.row.summary }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column header-align="cover" label="封面" width="100">
          <template slot-scope="scope">
            <el-image v-if="scope.row.cover"
              style="width: 50px; height: 50px"
              :src="scope.row.cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="关联电影名">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.name" placement="top">
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
                {{ scope.row.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="readCount" label="阅读数"> </el-table-column>
        <el-table-column prop="likeCount" label="点赞数"> </el-table-column>
        <el-table-column prop="commentCount" label="评论数"> </el-table-column>
        <el-table-column prop="createTime" label="发表时间" width="200px">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 2">未审核</span>
            <span v-if="scope.row.status == 3">审核未通过</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="55px">
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <span class="el-icon-more-outline"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.native="remove(scope.row.id)"
                    >删除</el-dropdown-item
                  >
                  <el-dropdown-item
                    ><router-link :to="'/comment_manage/review/' + scope.row.id">预览</router-link></el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.status == 2"
                    @click.native="audited(scope.row.id, 1)"
                    >通过审核</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-if="scope.row.status == 2"
                    @click.native="audited(scope.row.id, 0)"
                    >未通过审核</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
import {
  getArticles,
  delEassyByBatch,
  auditedEssay,
  auditedEssayByBatch,
  delEssay,
} from "@/api/forum";
export default {
  methods: {
    changeSelect() {
      this.queryInfo.curPage = 1;
      this.queryInfo.pageSize = 5;
      this.fetchData();
    },
    async audited(id, type) {
      const confirmResult = await this.$confirm("确定审批文章？", "Info", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消审批！");
      } else {
        auditedEssay(type, id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("审批失败！");
          } else {
            this.$message.success("审批成功！");
            this.fetchData();
          }
        });
      }
    },
    async auditedByBatch() {
      if (this.selectList.length == 0) return;
      const confirmResult = await this.$confirm(
        "是否批量审批的文章？",
        "Info",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消审批！");
      } else {
        let ids = [];
        this.selectList.forEach((row) => {
          if (row.status == 2) {
            ids.push(row.id);
          }
        });
        auditedEssayByBatch(ids).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("审批失败！");
          } else {
            this.$message.success("审批成功！");
            this.fetchData();
          }
        });
      }
    },
    async deletedBatch() {
      if (this.selectList.length == 0) return;
      const confirmResult = await this.$confirm(
        "此操作将永久删除批量记录，是否继续？",
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
        let ids = [];
        this.selectList.forEach((row) => {
          ids.push(row.id);
        });
        delEassyByBatch(ids).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.fetchData();
          }
        });
      }
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
        delEssay(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.fetchData();
          }
        });
      }
    },
    async fetchData() {
      this.listLoading = true;
      getArticles(this.queryInfo).then((response) => {
        if (response.code !== 200) {
          return this.$message.error(response.message);
        } else {
          this.tableData = response.obj.objs == null ? [] : response.obj.objs;
          this.totalCount = response.obj.count == null ? 0 : response.obj.count;
        }
      });
      this.listLoading = false;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.fetchData();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.curPage = newPage;
      this.fetchData();
    },
    handleSelectionChange(rows) {
      this.selectList = [];
      rows.forEach((row) => {
        this.selectList.push(row);
      });
    },
    resetPageInfo() {
      this.queryInfo.curPage = 1;
      this.queryInfo.pageSize = 5;
    },
    clearTime() {
      this.resetPageInfo();
      this.queryInfo.startTime = null;
      this.queryInfo.endTime = null;
      this.fetchData();
    },
    showLogbyTime() {
      if (this.value2 == null) {
        this.clearTime();
        return;
      }
      this.resetPageInfo();
      this.queryInfo.startTime = this.getTimeStr(this.value2[0]);
      this.queryInfo.endTime = this.getTimeStr(this.value2[1]);
      this.fetchData();
    },
    getTimeStr(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
  },
  data() {
    return {
      tableData: [],
      selectList: [],
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        username: "",
        title: "",
        startTime: "",
        endTime: "",
        isAudited: null,
      },
      totalCount: 0,
      value2: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
};
</script>

<style>
</style>