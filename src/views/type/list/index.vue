<template>
  <div class="app-container">
    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20" class="addRow">
        <el-col :span="8">
          <el-input
            placeholder="根据类别名查询"
            v-model="queryInfo.typename"
            clearable
            @clear="fetchData"
            @input="fetchData"
          >
            <el-button slot="append" icon="el-icon-search" @click="fetchData">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加类别</el-button>
        </el-col>
      </el-row>

      <!-- 表格视图区域 -->
      <el-table
        v-loading="listLoading"
        :data="typeData"
        style="width: 100%"
        @expand-change="handleExpandChange"
      >
        <el-table-column type="expand">
          <template scope="data">
            <span class="demonstration">类别所包含的电影</span>
            <div id="elagDIV" style="margin-top: 10px">
              <el-tag
                style="margin-left: 10px"
                v-for="m in data.row.movies"
                :key="m"
              >
                {{ m }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="typeName" label="类别名"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="240px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >
              编辑
            </el-button>
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
      <!-- 添加的对话框 -->
      <el-dialog
        title="添加轮播图"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
      >
        <!-- 添加的表单 -->
        <el-form
          ref="addFormRef"
          :model="addForm"
          :rules="addFormRules"
          label-width="100px"
        >
          <el-form-item label="类别名" prop="typeName">
            <el-input
              placeholder="请输入类别名"
              v-model="addForm.typeName"
              style="width: 80%"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClosed">取 消</el-button>
          <el-button type="primary" @click="addEnvent">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑的对话框 -->
      <el-dialog
        title="编辑轮播图设置"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <!-- 内容主体区域,表单验证 -->
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-width="100px"
        >
          <el-form-item hidden label="ID" prop="id">
            <el-input v-model="editForm.id"></el-input>
          </el-form-item>
          <el-form-item label="类别名" prop="typeName">
            <el-input
              placeholder="请输入类别名"
              v-model="editForm.typeName"
              style="width: 80%"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editComment">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getList,
  getListMovie,
  delType,
  addType,
  updateType,
  getType,
} from "@/api/type";
export default {
  methods: {
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
        await delType(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.fetchData();
          }
        });
      }
    },
    handleExpandChange(row, rows) {
      if (row.movies === null || row.movies === undefined) {
        getListMovie({ id: row.id }).then((res) => {
          row.movies = res.obj;
        });
      }
    },
    fetchData() {
      this.listLoading = true;
      getList(this.queryInfo).then((response) => {
        if (response.code !== 200) {
          return this.$message.error(response.message);
        } else {
          this.typeData = response.obj.objs;
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
    // 展示添加的对话框
    async showAddDialog() {
      this.addDialogVisible = true;
    },
    addEnvent() {
      // 进行预验证
      this.$refs.addFormRef.validate(async (valid) => {
        // 如果预验证通过
        if (valid) {
          addType(this.addForm).then((resp) => {
            if (resp.code !== 200) {
              return this.$message.error(resp.message);
            } else {
              this.$message.success("操作成功");
              this.fetchData();
              this.addDialogVisible = false;
            }
          });
        }
      });
    },
    // 监听添加分类对话框的关闭事件，重置表单数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.allNumbers = [];
      this.addDialogVisible = false;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改信息并提交
    editComment() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.error("请检查数据！");
          // 预验证不通过则直接返回
          return 0;
        } else {
          updateType(this.editForm).then((resp) => {
            if (resp.code !== 200) {
              this.$message.error("编辑轮播图信息失败！");
            } else {
              this.$message.success("编辑轮播图信息成功！");
              // 隐藏对话框
              this.editDialogVisible = false;
              this.fetchData();
            }
          });
        }
      });
    },
    // 编辑的对话框
    async showEditDialog(id) {
      // 展示该对话框
      this.editDialogVisible = true;
      getType(id).then((res) => {
        if (res.code !== 200) {
          return this.$message.error(res.message);
        } else {
          this.editForm = res.obj;
        }
      })
    },
  },
  data() {
    return {
      typeData: [],
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        typename: "",
      },
      addForm: {
        id: "",
        typeName: "",
      },
      editForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        typeName: [
          { required: true, message: "请输入类别名", trigger: "blur" },
        ],
      },
      editFormRules: {
        typeName: [
          { required: true, message: "请输入类别名", trigger: "blur" },
        ],
      },
      totalCount: 0,
    };
  },
  created() {
    this.fetchData();
  },
};
</script>
