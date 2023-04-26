<template>
  <div class="app-container">
    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20" class="addRow">
        <el-col :span="8">
          <el-input
            placeholder="根据用户名查询"
            v-model="queryInfo.username"
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
        :data="userData"
        style="width: 100%"
      >
        <el-table-column type="expand" fixed>
          <template slot-scope="data">
            <span class="demonstration">用户感兴趣电影类别</span>
            <div style="margin-top: 10px">
              <el-tag
                style="margin-left: 10px"
                v-for="t in data.row.types"
                :key="t"
              >
                {{ t }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          prop="username"
          label="用户名"
          fixed
        >
        </el-table-column>
        <el-table-column
          header-align="center"
          prop="email"
          label="用户邮箱"
          width="200"
        >
        </el-table-column>
        <el-table-column header-align="center" label="用户头像" width="100">
          <template slot-scope="scope">
            <el-avatar :src="scope.row.head"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="birthday"
          header-align="center"
          label="用户生日"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="info"
          header-align="center"
          label="用户简介"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="gender"
          header-align="center"
          label="用户性别"
          :formatter="UGF"
        >
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          header-align="center"
          label="最近一次登录时间"
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
          prop="createTime"
          header-align="center"
          label="注册时间"
          width="200"
        >
        </el-table-column>

        <el-table-column
          prop="status"
          header-align="center"
          label="账户状态"
          width="100"
          :formatter="USF"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-dropdown trigger="click">
              <span class="el-icon-more-outline"></span>
              <el-dropdown-menu>
                <el-dropdown-item
                  @click.native="resendEmail(scope.row.id)"
                  v-show="scope.row.status == 2"
                  >发送激活邮件</el-dropdown-item
                >
                <el-dropdown-item @click.native="resetPass(scope.row.id)"
                  >重置密码</el-dropdown-item
                >
                <el-dropdown-item @click.native="remove(scope.row.id)"
                  >删除</el-dropdown-item
                >
              </el-dropdown-menu>
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
  getList,
  resendEmailById,
  resetPassById,
  delUserById,
} from "@/api/user";
export default {
  methods: {
    async resendEmail(id) {
      const confirmResult = await this.$confirm("确定发送邮件？", "Info", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消发送！");
      } else {
        resendEmailById(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("发送成功！");
          } else {
            this.$message.success("发送失败！");
            this.fetchData();
          }
        });
      }
    },
    async resetPass(id) {
      const confirmResult = await this.$confirm(
        "确定要重置用户密码？",
        "dangerous!",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("取消重置！");
      } else {
        resetPassById(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("重置失败！");
          } else {
            this.$message.success("重置成功！");
            this.fetchData();
          }
        });
      }
    },
    async remove(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除记录，是否继续？",
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
        delUserById(id).then((resp) => {
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
    UGF(row, index) {
      return row.gender == 1 ? "男" : "女";
    },
    USF(row, index) {
      if (row.status == 1) return "正常";
      if (row.status == 2) return "邮箱未激活";
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
          return this.$message.error("获取用户信息失败！");
        } else {
          this.userData = response.obj.objs;
          this.listLoading = false;
          this.totalCount = response.obj.count;
        }
      });
    },
    async fetchData() {
      this.listLoading = true;
      getList(this.queryInfo).then((response) => {
        if (response.code !== 200) {
          return this.$message.error("获取用户信息失败！");
        } else {
          this.userData = response.obj.objs;
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
      userData: null,
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        username: "",
      },
      totalCount: 0,
    };
  },
  created() {
    this.fetchData();
  },
};
</script>
