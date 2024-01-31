import { log } from 'console';
<template>
  <div class="download-upload">
    <el-dialog
      v-model="uploadVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="beforeClose"
      width="700px"
      title="下载上传模版">
      <div class="load-box b-flex b-justify-center">
        <div class="load-item">
          <div class="load-item-title">1、{{ downloadTitle }}</div>
          <div class="load-img">
            <img src="@/assets/images/common/file.jpg" alt srcset />
            <p class="load-tips"></p>
          </div>
          <div class="b-flex b-justify-center">
            <div class="load-btn" @click="downExport">下载模板</div>
          </div>
        </div>
        <div class="load-split"></div>
        <div class="load-item">
          <div class="load-item-title">2、{{ uploadTitle }}</div>
          <div class="load-img">
            <img src="@/assets/images/common/file1.jpg" alt srcset />
            <p class="load-tips">仅支持xls、xlsx格式文件</p>
          </div>
          <el-upload
            ref="upload"
            action="placeholder"
            accept=".xls, .xlsx"
            :before-upload="beforeUpload"
            :http-request="handleHttpRequest"
            :show-file-list="false"
            list-type="picture">
            <div class="b-flex b-flex-column b-align-centenr">
              <div class="load-btn">上传文件</div>
            </div>
          </el-upload>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="loadResClose"
      v-model="reloadVisible"
      title="上传结果">
      <div class="load-resmsg b-flex b-justify-center b-align-centenr">
        <!-- <img src="../../assets/load1.jpg" alt="" srcset="" /> -->
        <p class="f-s-16 m-b-20">{{ loadResponse.loadMsg }}</p>
        <i v-if="uploadLoading" class="el-icon-loading"></i>
      </div>
      <div class="load-resbtn b-flex b-justify-center">
        <el-button :disabled="!loadResponse.failUrl" type="warning" @click="loadFailFile">
          下载失败列表
        </el-button>
        <el-button type="primary" @click="handleReload">重新上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
const emit = defineEmits(['on-close', 'on-confirm'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  // 上传接口
  uploadUrl: {
    type: Function,
    default: () => {}
  },
  //是否包含下载模版
  downloadUrl: {
    type: String,
    default: ''
  },
  //下载标题
  downloadTitle: {
    type: String,
    default: '下载导入开票规则模版'
  },
  //下载标题
  uploadTitle: {
    type: String,
    default: '上传填好的文件'
  }
})

let uploadVisible = ref(false)
watch(
  () => props.visible,
  (val) => {
    uploadVisible.value = val
  }
)
// 文件上传前校验
const beforeUpload = (file) => {
  let splitList = file.name.split('.')
  if (splitList.length < 2) {
    ElMessage.error('请添加文件后缀, 注意后缀类型为 xls 或 xlsx')
    return false
  }
  //限制文件类型
  let fileSuffix = splitList.pop()
  if (fileSuffix != 'xls' && fileSuffix != 'xlsx') {
    ElMessage.error('请输入 xls 或 xlsx 文件！')
    return false
  }

  //限制文件大小
  if (file.size > 1024 * 1024 * 16) {
    ElMessage.error('文件不能大于 16MB!')
    return false
  }
  return true
}
// 上传数据
let uploadLoading = ref(false)
let reloadVisible = ref(false)
let loadResponse = reactive({
  loadMsg: '导入中...',
  failUrl: ''
})

const handleHttpRequest = async (item) => {
  try {
    uploadVisible.value = false
    reloadVisible.value = true
    loadResponse.loadMsg = '导入中'
    loadResponse.failUrl = ''

    const formData = new FormData()
    formData.append('file', item.file)
    props
      .uploadUrl(formData)
      .then((res) => {
        console.log(22222, res)
        if (res.code == '0000') {
          loadResponse.loadMsg = '导入成功'
          beforeClose()
        } else {
          loadResponse.loadMsg = res.msg
          loadResponse.failUrl = res.data
        }
      })
      .catch((err) => {
        console.log(11, err)
      })
  } catch (err) {
    console.log(err)
  }
}

// 下载失败列表
const loadFailFile = () => {
  if (loadResponse.failUrl) {
    window.open(loadResponse.failUrl)
  } else {
    ElMessage.warning('无失败列表文件！')
  }
}

// 重新上传
const handleReload = () => {
  reloadVisible.value = false
  uploadVisible.value = true
}

const loadResClose = () => {
  reloadVisible.value = false
  reloadVisible.value = false
  beforeClose()
}

// 下载模版
const downExport = () => {
  if (props.downloadUrl) {
    window.open(props.downloadUrl)
  } else {
    ElMessage.error('暂无模版下载地址')
  }
}

const beforeClose = () => {
  emit('on-close')
  emit('on-confirm')
}
</script>
<style lang="less" scoped>
.download-upload {
  .load-box {
    .load-item {
      text-align: center;
      width: 50%;
      margin: 0 20px;
      .load-img {
        margin: 30px 0 10px;
        .load-tips {
          height: 30px;
          line-height: 30px;
        }
      }
      .load-btn {
        width: 90px;
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        border: 2px solid #d2d4da;
        cursor: pointer;
        margin: 0 auto;
      }
    }
  }
  .load-split {
    margin: 0 20px;
    height: 100px;
    border-right: 3px dotted #e9e9e9;
  }
}
</style>
