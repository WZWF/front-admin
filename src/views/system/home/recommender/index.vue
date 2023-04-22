<template>
  <el-card>
    <!-- 添加区域 -->
    <el-row :gutter="20" class="addRow">
      <el-col :span="8">
        <el-input
          placeholder="查询电影"
          v-model="queryInfo.condition"
          clearable
          @clear="fetchData"
          @input="fetchData"
        >
          <el-button slot="append" icon="el-icon-search" @click="fetchData">
          </el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="showAddDialog"
          >添加推荐电影</el-button
        >
      </el-col>
    </el-row>

    <!-- 表格视图区域 -->
    <el-table
      v-loading="listLoading"
      :data="data"
      style="width: 100%"
      @expand-change="handleExpandChange"
    >
      <el-table-column prop="name" label="推荐电影名"> </el-table-column>
      <el-table-column prop="score" label="推荐分"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column prop="updateTime" label="更新时间"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="240px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row)"
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
      title="添加推荐电影"
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
        <el-form-item hidden label="ID" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="相关电影" prop="mid">
          <el-select
            v-model="addForm.mid"
            filterable
            placeholder="请选择相关电影"
            style="width: 80%"
            v-el-select-loadmore="loadmore"
            :filter-method="dataFilter"
          >
            <el-option
              v-for="item in movieItems"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推荐分" prop="score">
          <el-input
            placeholder="请输入推荐分"
            v-model="addForm.score"
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
      title="编辑电影类别设置"
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
        <el-form-item label="推荐分" prop="score">
          <el-input
            placeholder="请输入类别名"
            v-model="editForm.score"
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
</template>

<script>
import { getRecommendList, addReco, updateReco, delReco } from "@/api/system";
import { getAllMovie } from "@/api/movie";
import { getID } from "@/api/common";

export default {
  methods: {
    loadmore() {
      this.moviePageData.index++;
      this.getItems(this.moviePageData);
    },
    getItems(value) {
      let num = ~~this.moviePageData.index * ~~this.moviePageData.pageSize;
      this.movieItems = this.allMovie.filter((item, index, arr) => {
        return index < num;
      });
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
        await delReco(id).then((resp) => {
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
      getRecommendList(this.queryInfo).then((response) => {
        if (response.code !== 200) {
          return this.$message.error(response.message);
        } else {
          this.data = response.obj.objs == null ? [] : response.obj.objs;
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
    dataFilter(val) {
      if (val) {
        this.movieItems = this.allMovie.filter((item) => {
          if (!!~item.name.indexOf(val)) return true;
        });
      } else {
        this.getItems(this.moviePageData);
      }
    },
    // 展示添加的对话框
    async showAddDialog() {
      // 获取ID
      new Promise(() =>
        getID().then((resp) => {
          const { obj } = resp;
          this.addForm.id = obj;
        })
      );
      this.moviePageData.index = 1;
      this.moviePageData.pageSize = 20;
      this.getItems(this.moviePageData);
      if (
        (this.id != null && this.id != undefined) ||
        (this.allMovie != null && this.allMovie != undefined)
      )
        // 再展示对话框
        this.addDialogVisible = true;
      else this.$message.error("发生未知错误！");
    },
    addEnvent() {
      this.addForm.name = this.movieItems.find((item) => {
        return item.id == this.addForm.mid;
      }).name
      // 进行预验证
      this.$refs.addFormRef.validate(async (valid) => {
        // 如果预验证通过
        if (valid) {
          addReco(this.addForm).then((resp) => {
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
          updateReco(this.editForm).then((resp) => {
            if (resp.code !== 200) {
              this.$message.error("编辑推荐电影信息失败！");
            } else {
              this.$message.success("编辑推荐电影信息成功！");
              // 隐藏对话框
              this.editDialogVisible = false;
              this.fetchData();
            }
          });
        }
      });
    },
    // 编辑的对话框
    async showEditDialog(row) {
      // 展示该对话框
      this.editDialogVisible = true;
      this.editForm = row;
    },
  },
  data() {
    
    const validateScore = (rule, value, callback) => {
      if (!/^\+?[1-9]\d*$/.test(value)) {
        callback(new Error('请输入合法的数值'))
      } else {
        callback()
      }
    }
    return {
      data: [],
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        condition: "",
      },
      addForm: {
        id: "",
        mid: "",
        name: "",
        score: '',
      },
      allMovie: [],
      movieItems: [],
      moviePageData: {
        index: 1,
        pageSize: 20,
      },
      editForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        score: [
          {required: true, trigger: "blur", validator: validateScore}
        ],
        mid: [
        {required: true, trigger: "blur",}
        ]
      },
      editFormRules: {
        score: [
          {required: true, trigger: "blur", validator: validateScore}
        ],
      },
      totalCount: 0,
    };
  },
  created() {
    this.fetchData();
    new Promise(() =>
      getAllMovie().then((resp) => {
        const { obj } = resp;
        this.allMovie = obj;
      })
    );
  },
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          const condition =
            Math.floor(this.scrollHeight - this.scrollTop) <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
};
</script>
<style>
</style>