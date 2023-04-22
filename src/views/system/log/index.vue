<template>
  <div>
    <el-card>
      <el-tabs v-model="rid" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="管理员" name="0"></el-tab-pane>
        <el-tab-pane label="用户" name="1"></el-tab-pane>
        <div v-if="rid == 0">
          <!-- 添加区域 -->
          <el-row :gutter="20" class="addRow">
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
            <el-col :span="6">
              <el-radio-group
                v-model="queryInfo.isSelect"
                @input="changeSelect"
                style="margin-top: 14px"
              >
                <el-radio :label="0">查询日志</el-radio>
                <el-radio :label="1">非查询日志</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <!-- 表格视图区域 -->
          <el-table v-loading="listLoading" :data="data" style="width: 100%">
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="action" label="操作"> </el-table-column>
            <el-table-column prop="actionTypeDesc" label="操作类型"> </el-table-column>
            <el-table-column prop="requestIP" label="请求地址"> </el-table-column>
            <el-table-column prop="requestMethod" label="请求方法"> </el-table-column>
            <el-table-column prop="requestParams" label="请求参数"></el-table-column>
            <el-table-column prop="requestType" label="请求方式"> </el-table-column>
            <el-table-column prop="requestTakesTime" label="请求耗时(ms)"> </el-table-column>
            <el-table-column prop="requestUrl" label="请求url"> </el-table-column>
            <el-table-column prop="message" label="响应消息"> </el-table-column>
            <el-table-column prop="tidDesc" label="操作结果"> </el-table-column>
            <el-table-column prop="createTime" label="记录时间"> </el-table-column>
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
        </div>
        <div v-if="rid == 1">
          <!-- 添加区域 -->
          <el-row :gutter="20" class="addRow">
            <el-col :span="6">
              <el-input
                placeholder="根据用户名查询"
                v-model="queryInfo.username"
                clearable
                @clear="fetchData"
                @input="fetchData"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="fetchData"
                >
                </el-button>
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
          </el-row>
          <!-- 表格视图区域 -->
          <el-table v-loading="listLoading" :data="data" style="width: 100%">
            <el-table-column prop="username" label="用户名"> </el-table-column>
            <el-table-column prop="action" label="操作"> </el-table-column>
            <el-table-column prop="actionTypeDesc" label="操作类型"> </el-table-column>
            <el-table-column prop="requestIP" label="请求地址"> </el-table-column>
            <el-table-column prop="requestMethod" label="请求方法"> </el-table-column>
            <el-table-column prop="requestParams" label="请求参数"></el-table-column>
            <el-table-column prop="requestType" label="请求方式"> </el-table-column>
            <el-table-column prop="requestTakesTime" label="请求耗时(ms)"> </el-table-column>
            <el-table-column prop="requestUrl" label="请求url"> </el-table-column>
            <el-table-column prop="message" label="响应消息"> </el-table-column>
            <el-table-column prop="tidDesc" label="操作结果"> </el-table-column>
            <el-table-column prop="createTime" label="记录时间"> </el-table-column>
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
        </div>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getLogInfo } from "@/api/system";

export default {
  data() {
    return {
      listLoading: false,
      rid: 0,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        startTime: "",
        endTime: "",
        username: "",
        isSelect: 0,
      },
      data: [],
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
  methods: {
    changeSelect() {
      this.fetchData();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.curPage = newPage;
      this.fetchData();
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.fetchData();
    },
    handleClick(tab, event) {
      this.fetchData();
    },
    async fetchData() {
      this.listLoading = true;
      if (this.rid == 0) this.queryInfo.username = "";
      getLogInfo(this.rid, this.queryInfo).then((res) => {
        if (res.code != 200) {
          this.$message.error(res.$message);
        } else {
          this.data = res.obj.objs == null ? [] : res.obj.objs;
          this.totalCount = res.obj.count == null ? 0 : res.obj.count;
        }
      });
      this.listLoading = false;
    },
    showLogbyTime() {
      this.queryInfo.startTime = this.value2[0].valueOf();
      this.queryInfo.endTime = this.value2[1].valueOf();
      this.fetchData();
    },
    // 日期转化字符串
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
  created() {
    this.fetchData();
  },
};
</script>

<style>
</style>