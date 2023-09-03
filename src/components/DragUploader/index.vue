<script setup lang="ts">
import IconUpload from "@/components/Icons/IconUpload.vue";
import ProgressBar from "./components/ProgressBar.vue";
import {
  reactive,
  ref,
  type InputHTMLAttributes,
  type Ref,
  type VNodeRef,
} from "vue";
import split2ChunkList from "@/utils/split2ChunkList";
type Booleanish = boolean | "true" | "false";
interface CheckFileSize {
  (files: FileList | null, limit: number | undefined): boolean;
}

const props = withDefaults(
  defineProps<{
    multiple?: Booleanish;
    accept?: string;
    limit?: number;
    limitWarning?: string;
    splitChunk?: boolean; // 是否开启分片上传
    splitChunkSize?: number; // 分片上传的分片大小， 仅在 splitChunk 开启时有效
  }>(),
  {
    multiple: false,
    limitWarning: "文件太大了，兄台！",
    splitChunkSize: 2,
  }
);
interface State {
  dragEnter: boolean;
  files: FileList | [];
  percent: number;
}
const state = reactive<State>({
  dragEnter: false,
  files: [],
  percent: 0,
});
const fileInputEl = ref<HTMLInputElement | null>(null);
setInterval(() => {
  state.percent = state.percent + 1;
}, 100);
/**
 * util function start
 */
const checkFileSize: CheckFileSize = (files, limit) => {
  if (typeof limit === "undefined") return true;
  return Array.prototype.some.call(
    files,
    (file) => file.size <= limit * 1024 * 1024
  );
};
/**
 * util function end
 */

const uploadFiles = (fileList: FileList) => {
  // check if need split chunk
  let files = [];
  // TODO 分片和不分片上传能够使用同一个api咩？
  // TODO 文件元信息怎么传给后端？单独API 还是每个chunk携带，还是第一个 chunk 携带？
  if (props.splitChunk) {
    // TODO 应该是一个什么数据类型？
    const chunks = split2ChunkList(fileList, props.splitChunkSize);
    console.log("chunks", chunks);
  }
};

const handleFileChange = () => {
  const target = fileInputEl.value;
  if (target?.files) {
    const allAllowedSize = checkFileSize(target.files, props.limit);
    if (!allAllowedSize)
      alert(props.limitWarning + `允许单文件最大${props.limit}MB!`);
    state.files = target.files;
    uploadFiles(state.files);
  }
};
const handleFileDrop = (e: DragEvent) => {
  if (fileInputEl.value) {
    fileInputEl.value.files = e.dataTransfer?.files as FileList | null;
    handleFileChange();
  }
  state.dragEnter = false;
};
</script>

<template>
  <div
    class="uploader-container relative container mx-auto h-96 p-1 flex justify-center items-center"
  >
    <div
      class="uploader-container-border flex justify-center items-center bg-slate-100 inset-2 z-10 absolute"
      :class="`${state.dragEnter ? 'bg-slate-200' : 'bg-slate-100'}`"
      @dragenter.prevent="state.dragEnter = true"
      @dragleave.prevent="state.dragEnter = false"
      @drop.prevent="handleFileDrop"
      @dragover.prevent
    >
      <div class="pointer-events-none" v-show="state.dragEnter">
        <slot name="dragPlaceholder">
          <span class="text-3xl text font-bold text-slate-500"> 拖拽放置 </span>
        </slot>
      </div>
    </div>

    <label for="fileInput" v-show="!state.dragEnter" class="absolute z-20">
      <slot name="default">
        <div
          class="uploader-btn cursor-pointer flex items-center px-4 py-2 border gap-2 bg-slate-300 hover:bg-slate-300/70 active:bg-slate-300 rounded-lg"
        >
          点击或拖拽文件以上传<IconUpload class="inline-block" />
        </div>
      </slot>
    </label>
  </div>
  <input
    type="file"
    ref="fileInputEl"
    :multiple="props.multiple"
    :accept="props.accept"
    id="fileInput"
    class="hidden"
    @change="handleFileChange"
  />
  <ProgressBar class="w-44" :percent="state.percent" />
</template>

<style>
/* .uploader-container {
  background-image: repeating-linear-gradient(
    45deg,
    #f40,
    #f40 12px,
    transparent 12px,
    transparent 24px
  );
} */
</style>
