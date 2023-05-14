<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <!-- <div class="horizontal-list">
      <div v-for="(item, index) in list" :key="index" class="list-item">
        {{ item }}
      </div>
    </div> -->
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-num">{{ userCnt }}</div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-num">{{ movieCnt }}</div>
          <div class="card-panel-description">
            <div class="card-panel-text">电影总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-num">{{ articleCnt }}</div>
          <div class="card-panel-description">
            <div class="card-panel-text">文章总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-num">{{ homeVisit }}</div>
          <div class="card-panel-description">
            <div class="card-panel-text">今日首页访问量</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row style="background: #fff; padding: 16px 16px 0; margin-bottom: 32px">
      <div class="rating-graph">
        <graph
          style="margin: 0 auto"
          :option="option"
          :width="'80%'"
          :height="'400px'"
        />
      </div>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getMovieCnt,
  getArticleCnt,
  getHomeVisit,
  getUserCnt,
  getLoginCntByWeek,
  getArticleCntByWeek,
} from "@/api/home";
import graph from "@/components/graph.vue";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    graph,
  },
  data() {
    return {
      homeVisit: 0,
      movieCnt: 0,
      articleCnt: 0,
      userCnt: 0,
      option: {
        xAxis: {
          data: ["7", "6", "5", "4", "3", "2", "1"],
        },
        yAxis: {
          type: "value",
        },
        legend: {
          data: ["近七天用户登录数", "近七天发帖数"],
        },
        series: [
          {
            data: [0, 0, 0, 0, 0, 0, 0],
            type: "line",
            smooth: true,
            name: "近七天用户登录数",
          },
          {
            data: [0, 0, 0, 0, 0, 0, 0],
            type: "line",
            smooth: true,
            name: "近七天发帖数",
          },
        ],
      },
    };
  },
  created() {
    getMovieCnt().then((res) => {
      this.movieCnt = res.obj;
    });
    getArticleCnt().then((res) => {
      this.articleCnt = res.obj;
    });
    getHomeVisit().then((res) => {
      this.homeVisit = res.obj;
    });
    getUserCnt().then((res) => {
      this.userCnt = res.obj;
    });
    getLoginCntByWeek().then((res) => {
      this.option.series[0].data = res.obj;
    });
    getArticleCntByWeek().then((res) => {
      this.option.series[1].data = res.obj;
    });
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        float: left;
        font-size: 20px;
      }
    }
  }
  .card-panel-num {
    float: left;
    font-size: 40px;
    margin: 20px 0 0 20px;
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
.rating-graph {
  width: 100%;
  height: 400px;
}
</style>
