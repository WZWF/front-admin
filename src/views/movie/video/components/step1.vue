<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item hidden prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="电影">
        <el-select v-model="form.mid" placeholder="请选择电影" clearable filterable remote :remote-method="remoteMethod">
            <el-option
                v-for="item in dataItems"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源类别">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">本地播放</el-radio>
          <el-radio :label="1">外部链接</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接标题">
        <el-input v-model="form.title" type="text" />
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
import { getID } from "@/api/common";
import { getAllMovie } from "@/api/movie";
export default {
  data() {
    return {
      form: {
        id: "",
        mid:"",
        type:"",
        title:"",
      },
      dataItems:[],
      allMovie:[],
    };
  },
  methods: {
    remoteMethod(query){
        if (query !== '') {
            setTimeout(() => {
                this.dataItems = this.allMovie.filter(item => {
                    return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
                });
            }, 200);
        } else {
            this.dataItems = [];
        }
    },
    submitForm() {
      // 将表单数据存储到父组件的数组中
      this.$emit("getForm", this.form);
    },
  },
  created() {
    this.form.id = getID()
     // 获取所有电影
     new Promise(() =>
        getAllMovie().then((resp) => {
          const { obj } = resp;
          this.allMovie = obj;
        })
      );
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>
  