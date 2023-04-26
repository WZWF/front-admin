<template>
  <div>
    <div class="top-container">
      <router-link :to="'/comment_manage/index'">
        <div class="return">
          <span class="el-icon-arrow-left">返回</span>
        </div>
      </router-link>
      <div class="publish">
        <el-dropdown trigger="click">
          <span class="el-icon-more-outline"></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click.native="remove(id)"
                >删除</el-dropdown-item
              >
              <el-dropdown-item
                v-if="formData.status == 2"
                @click.native="audited(id, 1)"
                >通过审核</el-dropdown-item
              >
              <el-dropdown-item
                v-if="formData.status == 2"
                @click.native="audited(id, 0)"
                >未通过审核</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="createPost-main-container">
      <el-form :model="formData" class="form-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 20px" prop="title">
              <MDinput
                v-model="formData.title"
                :maxlength="100"
                name="name"
                required
              >
                标题
              </MDinput>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 20px"
          label-width="90px"
          label="相关电影:"
          prop="name"
        >
          <el-input
            v-model="formData.name"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            maxlength="200"
          />
        </el-form-item>

        <el-form-item
          style="margin-bottom: 10px"
          label-width="90px"
          id="summary"
          prop="summary"
        >
          <label class="label-text" slot="label"
            >摘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;要:</label
          >
          <el-input
            v-model="formData.summary"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入摘要"
            maxlength="200"
          />
          <span v-show="contentShortLength" class="word-counter"
            >{{ contentShortLength }}/200</span
          >
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px">
          <editorHtml
            ref="editor"
            :modelValue="formData.content"
            :height="400"
          ></editorHtml>
        </el-form-item>

        <el-form-item prop="cover" style="margin-bottom: 30px">
          <el-upload
            accept=".png,.jpg"
            :multiple="false"
            :show-file-list="false"
            class="image-uploader"
            :action="'/'"
            drag
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将文件拖到此处上传封面，或<em>点击上传</em>
            </div>
          </el-upload>
          <div class="image-preview">
            <div
              v-show="formData.cover.length > 1"
              class="image-preview-wrapper"
            >
              <img :src="formData.cover" />
              <div class="image-preview-action">
                <i class="el-icon-delete" />
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
  <script>
import MDinput from "@/components/MDinput";
import { getArticleById, auditedEssay, delEssay } from "@/api/forum";

export default {
  components: { MDinput },
  computed: {
    contentShortLength() {
      return this.formData.summary == null ? 0 : this.formData.summary.length;
    },
  },
  data() {
    return {
      id: null,
      formData: {
        id: null,
        title: "",
        name: "",
        cover: "",
        content: "123",
        summary: "",
        status: 0,
      },
    };
  },
  created() {},
  watch: {
    "$route.params": {
      handler(val) {
        // 根据路由参数获取用户信息并更新
        this.id = val.id;
        //this.getDetail(val.id);
        getArticleById(this.id).then((res) => {
          if (res.code === 200) {
            this.formData = res.obj;
          } else {
            this.$message.error(res.message);
          }
        });
      },
      immediate: true, // 立即执行
    },
  },
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
        delEssay(id).then((resp) => {
          if (resp.code != 200) {
            return this.$message.error("删除失败！");
          } else {
            this.$message.success("删除成功！");
            this.$router.push({name: '论坛管理'});
          }
        });
      }
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
            this.$router.push({name: '论坛管理'});
          }
        });
      }
    }
  },
};
</script>
  
  <style lang="less">
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

#summary {
  .el-form-item__label {
    font-size: 18px;
    margin-top: 3px;
  }
}

#mid {
  .el-form-item__label {
    font-size: 18px;
  }
}

.related-movies {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  text-indent: 0px;
  .el-input__inner {
    border: 0px;
  }
}

.top-container {
  margin-top: 15px;
  width: 100%;
  height: 30px;
  display: flex;
  //background-color: pink;
  border-bottom: 1px solid #e0e0e0;
  .return {
    font-size: 18px;
    color: #b0adad;
    cursor: pointer;
  }
  .publish {
    position: absolute;
    right: 20px;
  }
}

.image-uploader {
  width: 35%;
  float: left;
}

.image-preview {
  width: 200px;
  height: 200px;
  position: relative;
  border: 1px dashed #d9d9d9;
  float: left;
  margin-left: 50px;
  .image-preview-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .image-preview-action {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    cursor: pointer;
    text-align: center;
    line-height: 200px;
    .el-icon-delete {
      font-size: 36px;
    }
  }
  &:hover {
    .image-preview-action {
      opacity: 1;
    }
  }
}
</style>