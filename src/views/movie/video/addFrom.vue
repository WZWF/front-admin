<template>
  <div style="padding-top: 20px">
    <h2 style="text-align: center">添加电影视频资源</h2>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item hidden prop="id">
        <el-input v-model="form.id" />
      </el-form-item>
      <el-form-item label="电影">
        <el-select
          v-model="form.mid"
          placeholder="请搜索电影"
          clearable
          filterable
          remote
          :remote-method="remoteMethod"
        >
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
      <el-card v-show="form.type == 0"
        style="width: 80%; margin: 20px auto; text-align: center"
        header="上传本地视频"
      >
        <el-upload
          class="upload-demo"
          drag
          action="/"
          multiple
          :http-request="handleHttpRequest"
          :on-remove="handleRemoveFile"
          >
          <el-icon class="el-icon-upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            请拖拽文件到此处或 <em>点击此处上传</em>
          </div>
        </el-upload>
      </el-card>
      <el-form-item v-show="form.type == 1" label="链接路径">
        <el-input v-model="form.URL" type="text" />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button type="danger" @click="cancel"> 取消 </el-button>
      <el-button type="primary" @click="submitForm"> 提交 </el-button>
    </div>
  </div>
</template>
<script>
import { getID } from "@/api/common";
import { getAllMovie } from "@/api/movie";
import { taskInfo, initTask, preSignUrl, merge } from "@/api/upload";
import { Notification } from "element-ui";
import Queue from "promise-queue-plus";
import axios from "axios";
import md5 from '@/lib/md5'

export default {
  data() {
    
    return {
      form: {
        id: "",
        mid: "",
        type: 0,
        title: "",
      },
      dataItems: [],
      allMovie: [],
      // 文件上传分块任务的队列（用于移除文件时，停止该文件的上传队列） key：fileUid value： queue object
    fileUploadChunkQueue : [],
    };
  },
  methods: {
    cancel() {
      this.$router.push({ name: "电影视频" });
    },
    remoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.dataItems = this.allMovie.filter((item) => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.dataItems = [];
      }
    },
    /**
     * 获取一个上传任务，没有则初始化一个
     */
    async getTaskInfo(file) {
      let task;
      const identifier = await md5(file);
      const { code, obj, message } = await taskInfo(identifier);
      if (code === 200) {
        task = obj;
        if (!task) {
          const initTaskData = {
            identifier,
            fileName: file.name,
            totalSize: file.size,
            chunkSize: 5 * 1024 * 1024,
          };
          const { code, obj, message } = await initTask(initTaskData);
          if (code === 200) {
            task = obj;
          } else {
            Notification.error({
              title: "文件上传错误",
              message: message,
            });
          }
        }
      } else {
        Notification.error({
          title: "文件上传错误",
          message: message,
        });
      }
      return task;
    },
    /**
     * 上传逻辑处理，如果文件已经上传完成（完成分块合并操作），则不会进入到此方法中
     */
    handleUpload(file, taskRecord, options) {
      let uploadedSize = 0; // 已上传的大小
      const totalSize = file.size || 0; // 文件总大小
      const { exitPartList, chunkSize, chunkNum, fileIdentifier } = taskRecord;

      const uploadNext = async (partNumber) => {
        const start = new Number(chunkSize) * (partNumber - 1);
        const end = start + new Number(chunkSize);
        const blob = file.slice(start, end);
        const { code, obj, message } = await preSignUrl({
          identifier: fileIdentifier,
          partNumber: partNumber,
        });
        if (code === 200 && obj) {
          await axios.request({
            url: obj,
            method: "PUT",
            data: blob,
            headers: {
              "Content-Type": "application/octet-stream",
            },
          });
          return Promise.resolve({
            partNumber: partNumber,
            uploadedSize: blob.size,
          });
        }
        return Promise.reject(`分片${partNumber}, 获取上传地址失败`);
      }
      /**
       * 更新上传进度
       * @param increment 为已上传的进度增加的字节量
       */
      const updateProcess = (increment) => {
        increment = new Number(increment);
        const { onProgress } = options;
        let factor = 1000; // 每次增加1000 byte
        let from = 0;
        // 通过循环一点一点的增加进度
        while (from <= increment) {
          from += factor;
          uploadedSize += factor;
          const percent = Math.round((uploadedSize / totalSize) * 100).toFixed(
            2
          );
          onProgress({ percent: percent });
        }
      };

      const prom = new Promise((resolve) => {
        const failArr = [];
        const queue = Queue(5, {
          retry: 3, //Number of retries
          retryIsJump: false, //retry now?
          workReject: function (reason, queue) {
            failArr.push(reason);
          },
          queueEnd: function (queue) {
            resolve(failArr);
          },
        });
        this.fileUploadChunkQueue[file.uid] = queue;
        for (let partNumber = 1; partNumber <= chunkNum; partNumber++) {
          const exitPart = (exitPartList || []).find(
            (exitPart) => exitPart.partNumber == partNumber
          );
          if (exitPart) {
            // 分片已上传完成，累计到上传完成的总额中
            updateProcess(exitPart.size);
          } else {
            queue.push(() =>
              uploadNext(partNumber).then((res) => {
                // 单片文件上传完成再更新上传进度
                updateProcess(res.uploadedSize);
              })
            );
          }
        }
        if (queue.getLength() == 0) {
          // 所有分片都上传完，但未合并，直接return出去，进行合并操作
          resolve(failArr);
          return;
        }
        queue.start();
      });

      prom.abort = ()=>{}

      return prom
    },
    /**
     * el-upload 自定义上传方法入口
     */
    async handleHttpRequest(options) {
      const file = options.file;
      const task = await this.getTaskInfo(file);
      if (task) {
        const { finished, path, taskRecordVO } = task;
        const { fileIdentifier: identifier } = taskRecordVO;
        if (finished) {
          return path;
        } else {
          const errorList = await this.handleUpload(file, taskRecordVO, options);
          if (errorList.length > 0) {
            Notification.error({
              title: "文件上传错误",
              message: "部分分片上次失败，请尝试重新上传文件",
            });
            return;
          }
          const { code, obj, message } = await merge(identifier);
          if (code === 200) {
            return path;
          } else {
            Notification.error({
              title: "文件上传错误",
              message: message,
            });
          }
        }
      } else {
        Notification.error({
          title: "文件上传错误",
          message: "获取上传任务失败",
        });
      }
    },
    /**
     * 移除文件列表中的文件
     * 如果文件存在上传队列任务对象，则停止该队列的任务
     */
    handleRemoveFile(uploadFile, uploadFiles) {
      console.log(1111)
      console.log(uploadFile)
      const queueObject = this.fileUploadChunkQueue[uploadFile.uid];
      if (queueObject) {
        queueObject.stop();
        this.fileUploadChunkQueue[undefined];
      }
    },
    submitForm() {
      // 提交表单数据
    },
  },
  created() {
    this.form.id = getID();
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