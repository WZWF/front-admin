<template>
    <div class="scroll-container" id="homeDiv">
        <div class="scroll-content">
            <el-row :gutter="20" class="mgb20">
                <el-col :span="6">
                    <el-card class="card"  shadow="hover" :body-style="{ padding: '0px' }">
                        <div class="grid-content grid-con-1">
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ this.users.length }}</div>
                                <div>用户总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="card" shadow="hover" :body-style="{ padding: '0px' }">
                        <div class="grid-content grid-con-2">
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ this.songs.length }}</div>
                                <div>歌曲总数</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="card" shadow="hover" :body-style="{ padding: '0px' }">
                        <div class="grid-content grid-con-3">
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ this.singers.length }}</div>
                                <div>歌手数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="card" shadow="hover" :body-style="{ padding: '0px' }">
                        <div class="grid-content grid-con-4">
                            <div class="grid-cont-right">
                                <div class="grid-num">{{ this.songLists.length }}</div>
                                <div>歌单数量</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <h3 class="title">用户性别比例</h3>
                    <div class="cav-info" style="background-color: white">
                        <ve-pie :data="userSex" :theme="options"></ve-pie>
                    </div>
                </el-col>
                
                <el-col :span="12">
                    <h3 class="title">风格类型分布</h3>
                    <div class="cav-info" style="background-color: white">
                        <ve-histogram :data="songStyle" :theme="options3"></ve-histogram>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <h3 class="title">歌手性别比例</h3>
                    <div class="cav-info" style="background-color: white">
                        <ve-pie :data="singerSex" :theme="options"></ve-pie>
                    </div>
                </el-col>
                <el-col :span="12">
                    <h3 class="title">歌手国籍分布</h3>
                    <div class="cav-info" style="background-color: white">
                        <ve-line :data="country" :theme="options2"></ve-line>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { showAllUser, showAllSinger, showAllSong, showAllSongList, showCount, showCountCountry } from '../api/index.js'
export default {
    data() {
        return {
            users: [],      //用户信息
            songs: [],      //歌曲信息
            singers: [],    //歌手信息
            songLists: [],  //歌单信息
            userSex: {
                columns: ['性别', '总数'],
                rows: [
                    { '性别': '男', '总数': 0 },
                    { '性别': '女', '总数': 0 }
                ]
            },
            options: {
                color: ['#87CEFA', '#FFC0CB']
            },
            options1: {
                color: ['#1E90FF', '#7B68EE']
            },
            options2: {
                color: ['#87CEFA'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            },
            options3: {
                color: ['#87CEFA', '#FFC0CB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            },
            songStyle: {
                columns: ['风格', '歌曲总数', '歌单总数'],
                rows: []
            },
            singerSex: {
                columns: ['性别', '总数'],
                rows: [
                    { '性别': '男', '总数': 0 },
                    { '性别': '女', '总数': 0 }
                ]
            },
            country: {
                columns: ['国家', '总数'],
                rows: [
                ]
            },
        }
    },
    mounted() {
        this.getUser()
        this.getSinger()
        this.getSong()
        this.getSongList()
        this.getCount()
        this.getCountry()
    },
    methods: {
        getUser() {
            showAllUser().then(res => {
                console.log(res)
                this.users = res.data.userList
                this.userSex.rows[0]['总数'] = this.setSex("男", res.data.userList)
                this.userSex.rows[1]['总数'] = this.setSex("女", res.data.userList)
            })
        }
        ,
        setSex(sex, arr) {
            console.log(arr)
            let count = 0
            for (let item of arr) {
                if (sex === item.sex) {
                    count++
                }
            }
            return count
        }
        ,
        getSinger() {
            showAllSinger().then(res => {
                console.log(res)
                this.singers = res.data.singerList
                this.singerSex.rows[0]['总数'] = this.setSex("男", res.data.singerList)
                this.singerSex.rows[1]['总数'] = this.setSex("女", res.data.singerList)
            })
        }
        ,
        getSong() {
            showAllSong().then(res => {
                console.log(res)
                this.songs = res.data.songList
            })
        }
        ,
        getSongList() {
            showAllSongList().then(res => {
                console.log(res)
                this.songLists = res.data.songLists
            })
        }
        ,
        getCount() {
            showCount().then(res => {
                console.log(res.data)
                res.data.count.forEach(item => {
                    this.songStyle.rows.push({
                        '风格': item.name,
                        '歌曲总数': item.count1,
                        '歌单总数': item.count2
                    })
                });
                console.log(this.songStyle)
            })
        }
        ,
        getCountry() {
            showCountCountry().then(res => {
                res.data.count.forEach(item => {
                    this.country.rows.push({
                        '国家': item.name,
                        '总数': item.count1,
                    })
                });
            })
        }
    }
}
</script>
<style scoped>
#homeDiv .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

#homeDiv .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

#homeDiv .grid-num {
    font-size: 30px;
    font-weight: bold;
}

.cav-info {
    border-radius: 6px;
    overflow: hidden;
}

.scroll-container {
    height: 100%;
    /* 将容器的高度设置为一个固定值 */
    overflow-y: auto;
    /* 开启竖向滚动条 */
}

.scroll-content {
    height: auto;
    /* 将内容区域的高度设置为自适应 */
}

.title {
    margin-bottom: 20px;
    text-align: center;
    margin-top: 20px;
}

/* .card:hover {
  cursor: pointer;
  box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.1);
} */
</style>