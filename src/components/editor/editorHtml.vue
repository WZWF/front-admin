<template>
  <div class="editor-html">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{ height: height + 'px', 'overflow-y': 'hidden' }"
      :model-value="modelValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  name: "editorHtml",
  components: { Editor, Toolbar },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    height: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      mode: "default",
      editor: null,
      toolbarConfig: {
        excludeKeys: ["group-video"],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        excludeKeys: ["group-video"],
        maxFileSize: 3 * 1024 * 1024,
        editorConfig: {
          placeholder: "请输入内容...",
          excludeKeys: ["group-video"],
          maxFileSize: 3 * 1024 * 1024,
          MENU_CONF: {
            // uploadImage: {
            //   server: config.API_URL + "/upload/uploadTempImage",
            //   fieldName: "file",
            //   headers: {
            //     Authentication: getToken(),
            //   },
            //   customInsert(responseData, insertFn) {
            //     if (responseData.code === 200) {
            //       insertFn(responseData.obj, "", "");
            //       return;
            //     } else {
            //       this.$message.error(responseData.message);
            //     }
            //   },
            // },
            // emotion: {
            //   emotions: "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉".split(" "), // 数组
            // },
          },
          mode: "default",
        },
        mode: "default",
      },
    };
  },
  watch:{
    modelValue() {
      this.editor.setHtml(this.modelValue);
    }
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
  methods: {
    onChange(editor) {
      //this.$emit("change", editor.getHtml());
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
  },
};
</script>

<style>
.editor-html {
  border: 1px solid #ddd;
}
/* .w-e-text-container {
  height: 500px !important;
} */
</style>