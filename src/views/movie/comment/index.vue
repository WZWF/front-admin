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
            @clear="fetchData"
            @input="fetchData"
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-input
            placeholder="根据电影名查询"
            v-model="queryInfo.objName"
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
          >
          </el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="deletedBatch" v-show="selectList.length"> 批量删除 </el-button>
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
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column header-align="center" label="用户头像" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.userImg"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="电影名称"> </el-table-column>
        <el-table-column prop="comment" label="评论内容"> </el-table-column>
        <el-table-column prop="createTime" label="评论时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="240px">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click.native.prevent="remove(scope.row.id)"
              size="mini"
            >
              删除
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
import { getMovieCommentList, delMovieComment, delMovieCommentByBatch } from "@/api/movie";
export default {
  methods: {
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
        delMovieCommentByBatch(this.selectList).then((resp) => {
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
        delMovieComment(id).then((resp) => {
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
      getMovieCommentList(this.queryInfo).then((response) => {
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
    handleSelectionChange(rows){
        this.selectList = [];
        rows.forEach(row => {
            this.selectList.push(row.id)
        });
        console.log(this.selectList);
    },
    showLogbyTime() {
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
      selectList:[],
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        username: "",
        objName: "",
        startTime: "",
        endTime: "",
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