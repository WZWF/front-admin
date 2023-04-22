<template>
  <div class="app-container">
    <el-card>
      <!-- 添加区域 -->
      <el-row :gutter="20" class="addRow">
        <el-col :span="8">
          <el-input
            placeholder="根据电影名查询"
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
          <el-button type="primary" @click="toAddFrom">
            添加电影视频
          </el-button>
        </el-col>
      </el-row>
      <!-- 表格视图区域 -->
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="电影名"> </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="播放类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 0">本地播放</span>
            <span v-if="scope.row.type == 1">外部链接</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="播放链接"> </el-table-column>
        <el-table-column prop="createTime" label="上传时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="240px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-view"
              @click.native.prevent="preview(scope.row)"
              size="mini"
            >
              预览
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
    </el-card>
    <div class="video_con" v-show="videoIsShow" style="display: none">
      <video :src="videoUrl" controls="controls" ref="videoPlayer">
      </video>
      <div class="mask" @click="hide"></div>
    </div>
  </div>
</template>

<script>
import { getVideoList, delVideo } from "@/api/movie";
export default {
  methods: {
    toAddFrom() {
      this.$router.push({ name: "添加电影视频" });
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
        delVideo(id).then((resp) => {
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
      getVideoList(this.queryInfo).then((response) => {
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
    preview(row) {
      if (row.type == 0) {
        this.isShowMoreVideo = false;
        this.videoIsShow = true;
        this.videoUrl = row.url;
      } else if (row.type == 1) {
        this.isShowMoreVideo = false;
        window.open(row.url, "_blank");
      }
    },
    hide() {
      this.$refs.videoPlayer.pause();
      this.videoUrl = null;
      this.videoIsShow = false;
    },
  },
  data() {
    return {
      tableData: [],
      listLoading: true,
      queryInfo: {
        curPage: 1,
        pageSize: 5,
        condition: "",
      },
      totalCount: 0,
      videoIsShow: false,
      videoUrl: "",
    };
  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.video_con video {
  position: fixed;
  width: 800px;
  height: 546px;
  left: 50%;
  top: 50%;
  margin-top: -273px;
  transform: translateX(-50%);
  z-index: 990;
}
.video_con .mask {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 980;
  background-color: rgba(0, 0, 0, 0.8);
}
</style>
