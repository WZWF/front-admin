<template>
  <div class="app-container">
    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20" class="addRow">
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog"
            >添加轮播图</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格视图区域 -->
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="title" label="轮播主题"> </el-table-column>
        <el-table-column prop="name" label="相关电影"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间"> </el-table-column>
        <el-table-column prop="updateTime" label="最近更新时间">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200px">
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
          <el-form-item hidden label="ID" prop="id">
            <el-input v-model="addForm.id"></el-input>
          </el-form-item>
          <el-form-item label="轮播主题" prop="title">
            <el-input
              placeholder="请输入轮播主题"
              v-model="addForm.title"
              style="width: 80%"
            ></el-input>
          </el-form-item>
          <el-form-item label="相关电影" prop="mid">
            <el-select
              v-model="addForm.mid"
              filterable
              placeholder="请选择相关电影"
              style="width: 80%"
              v-el-select-loadmore="loadmore"
              :filter-method="dataFilter"
              default-first-option
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
        </el-form>
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogClosed">取 消</el-button>
          <el-button type="primary" @click="addCarousel">确 定</el-button>
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
          <el-form-item label="轮播主题" prop="title">
            <el-input
              placeholder="请输入轮播主题"
              v-model="editForm.title"
              style="width: 80%"
            ></el-input>
          </el-form-item>
          <el-form-item label="相关电影" prop="mid">
            <el-select
              v-model="editForm.mid"
              filterable
              placeholder="请选择相关电影"
              style="width: 80%"
            >
              <el-option
                v-for="item in allMovie"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
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
  getCarouselList,
  addCar,
  delCarousel,
  getCarousel,
  updateCarousel,
} from "@/api/system";
import { getAllMovie } from "@/api/movie";
import { getID } from "@/api/common";

export default {
  methods: {
    dataFilter(val){
      if (val) {
        this.movieItems = this.allMovie.filter((item) => {
          if (!!~item.name.indexOf(val)) return true;
        })
      } else {
        this.getItems(this.moviePageData)
      }
    },
    loadmore(){
      this.moviePageData.index++;
      this.getItems(this.moviePageData)
    },
    getItems(value){
      let num = ~~this.moviePageData.index * ~~this.moviePageData.pageSize
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
        await delCarousel(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.fetchData();
          }
        });
      }
    },
    // 编辑的对话框
    async showEditDialog(id) {
      // 展示该对话框
      this.editDialogVisible = true;
      // 发起网络请求
      getCarousel(id).then((resp) => {
        if (resp.code !== 200) {
          return this.$message.error(resp.message);
        } else {
          this.editForm = resp.obj;
          new Promise(() =>
            getAllMovie().then((resp) => {
              const { obj } = resp;
              this.allMovie = obj;
            })
          );
        }
      });
    },
    // 修改信息并提交
    editComment() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          // 预验证不通过则直接返回
          return 0;
        } else {
          updateCarousel(this.editForm).then((resp) => {
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
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
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
    // 监听添加分类对话框的关闭事件，重置表单数据
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
      this.allNumbers = [];
      this.addDialogVisible = false;
    },
    async fetchData() {
      this.listLoading = true;
      getCarouselList().then((response) => {
        if (response.code !== 200) {
          return this.$message.error("获取轮播图信息失败！");
        } else {
          this.tableData = response.obj;
          this.listLoading = false;
        }
      });
      // 获取所有电影
      new Promise(() =>
        getAllMovie().then((resp) => {
          const { obj } = resp;
          this.allMovie = obj;
        })
      );
    },
    // 添加
    addCarousel() {
      // 进行预验证
      this.$refs.addFormRef.validate(async (valid) => {
        // 如果预验证通过
        if (valid) {
          addCar(this.addForm).then((resp) => {
            if (resp.code !== 200) {
              return this.$message.error(resp.message);
            } else {
              this.$message.success("操作成功");
              this.getCarouselList();
              this.addDialogVisible = false;
            }
          });
        }
      });
    },
  },
  data() {
    return {
      tableData: null,
      listLoading: true,
      addForm: {
        id: "",
        mid: "",
        title: "",
      },
      allMovie: [],
      movieItems: [],
      moviePageData: {
        index: 1,
        pageSize: 20,
      },
      // 编辑信息对象
      editForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      addFormRules: {
        title: [{ required: true, message: "请输入轮播主题", trigger: "blur" }],
        mid: [{ required: true, message: "请选择相关电影", trigger: "blur" }],
      },
      editFormRules: {
        title: [{ required: true, message: "请输入轮播主题", trigger: "blur" }],
        mid: [{ required: true, message: "请选择相关电影", trigger: "blur" }],
      },
    };
  },
  created() {
    this.fetchData();
  },
  directives: {
    'el-select-loadmore':{
      bind(el, binding){
        const SELECTWRAP_DOM = el.querySelector(
        '.el-select-dropdown .el-select-dropdown__wrap'
        );
        SELECTWRAP_DOM.addEventListener('scroll', function(){
          const condition = 
          Math.floor(this.scrollHeight - this.scrollTop) <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
};
</script>