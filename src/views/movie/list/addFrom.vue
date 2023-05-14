<template>
  <div>
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1"></el-step>
      <el-step title="步骤 2"></el-step>
    </el-steps>
    <el-form
      :model="addForm"
      :rules="rules"
      label-width="100px"
      autocomplete="off"
      size="medium"
      style="width: 80%; margin: 0 auto"
    >
      <div v-if="active == 0" style="padding-top: 10px">
        <el-form-item prop="name" label="电影名">
          <el-input v-model="addForm.name"> </el-input>
        </el-form-item>
        <el-form-item prop="descri" label="电影描述">
          <el-input type="textarea" v-model="addForm.descri"> </el-input>
        </el-form-item>
        <el-form-item prop="shoot" label="拍摄时间">
          <el-date-picker
            v-model="addForm.shoot"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="issue" label="发布时间">
          <el-date-picker
            v-model="addForm.issue"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="language" label="电影语言">
          <el-input
            v-model="addForm.language"
            placeholder="多种语言请以 '|' 隔开"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="director" label="导演">
          <el-input
            type="textarea"
            v-model="addForm.director"
            placeholder="多位导演请以 '|' 隔开"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="actors" label="演员">
          <el-input
            type="textarea"
            v-model="addForm.actors"
            placeholder="多位演员请以 '|' 隔开"
          >
          </el-input>
        </el-form-item>
      </div>
      <div v-if="active == 1" style="padding-top: 10px">
        <el-form-item prop="types" label="电影类别">
          <el-checkbox
            v-model="addForm.types"
            v-for="item in category"
            :label="item.id"
            :key="item.id"
            >{{ item.typeName }}
          </el-checkbox>
        </el-form-item>
        <el-card
          style="width: 80%; margin: 20px auto; text-align: center"
          header="上传电影海报"
        >
          <el-upload
            class="upload-demo"
            drag
            :headers="header"
            :action="uploadAction + addForm.id"
            :limit="1"
            :on-success="success"
            accept=".jpg,.png"
          >
            <el-icon class="el-icon-upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              请拖拽文件到此处或 <em>点击此处上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-card>
      </div>
    </el-form>

    <div class="footer">
      <el-button
        v-if="active > 0"
        type="info"
        icon="el-icon-arrow-left"
        @click="prev"
        >上一步
      </el-button>
      <el-button
        v-if="active < step - 1"
        type="primary"
        icon="el-icon-arrow-right"
        @click="next"
        >下一步</el-button
      >
      <el-button v-if="active == step - 1" type="primary" @click="addMovie"
        >添加电影</el-button
      >
    </div>
  </div>
</template>

<script>
import { getID, getCategory } from "@/api/common";
import { addMovieInfo } from "@/api/movie";
import config from "@/config";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      header: {
        Authentication: getToken(),
      },
      uploadAction: config.API_URL + "/upload/uploadMoviePost/",
      active: 0,
      step: 2,
      rules: {},
      addForm: {
        id: null,
        name: "",
        descri: "",
        shoot: null,
        issue: null,
        language: "",
        director: "",
        actors: "",
        types: [],
      },
      isUploadPost: false,
      category: [],
    };
  },

  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    success(res) {
      if (res.code == 200) {
        this.isUploadPost = true;
      } else {
        this.$message.error("上传失败，请重试！");
      }
    },
    prev() {
      if (--this.active < 0) this.active = 0;
    },
    addMovie() {
        if (this.isUploadPost) {
            addMovieInfo(this.addForm).then((res) => {
            if (res.code === 200) {
              this.$message.success("添加成功");
              this.$router.push({ name: "电影基础信息" });
            } else {
              this.$message.error(res.message);
              this.$router.push({ name: "电影基础信息" });
            }
        })
        } else {
            this.$message.error("请上传电影海报");
        }
    },
    getId() {
      new Promise(() => {
        getID().then((resp) => {
          const { obj } = resp;
          this.addForm.id = obj;
        });
      });
    },
    getCategory() {
      new Promise(() => {
        getCategory().then((resp) => {
          const { obj } = resp;
          this.category = obj;
        });
      });
    },
  },
  created() {
    this.getId(), this.getCategory();
  },
};
</script>

<style>
.footer {
  text-align: center;
  padding-right: 100px;
}
</style>