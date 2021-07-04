<!-- 上传图片 -->
<template>
  <el-upload
    :key="_uid"
    ref="upload"
    v-bind="$attrs"
    action=""
    :accept="outterAccept || accept"
    :file-list="fileList"
    :multiple="multiple"
    :limit="limit"
    :http-request="handlerHttpRequest"
    :on-remove="handlerRemoveFile"
    :on-exceed="handlerExceedHandler"
    :on-change="fileChange"
    v-on="$listeners"
  >
    <slot>
      <i class="el-icon-upload" />
      <div class="el-upload__text"><em>点击上传文件</em></div>
      <div slot="tip" class="el-upload__tip">
        允许上传{{ params[0] }}文件，且不超过{{ limitSizeStr }}
      </div>
    </slot>
  </el-upload>
</template>

<script>
/* eslint-disable consistent-return */
import { __postUpload } from '@xray/http/interceptor'
/**
 * 支持
 */
export default {
  inheritAttrs: false,
  props: {
    action: {
      type: String,
      required: true
    },
    // 数量限制
    limit: {
      type: Number,
      default: 1,
      validator(v) {
        return v >= 1
      }
    },
    // 上传时其他额外参数
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    // 上传时的文件名
    name: {
      type: String,
      default: 'fileName'
    },
    // 在使用outterAccept时还是尽量传一个fileType，不然可能会出现提示文字与类型不匹配的情况
    // 文件上传类型，覆盖掉computed里的类型，computed里会根据fileType设置文件类型
    outterAccept: {
      type: [Array, String],
      default: ''
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    onSuccess: {
      type: Function
    },
    onError: {
      type: Function
    },
    autoUpload: {
      // 是否自动上传
      type: Boolean,
      default: true
    },
    fileType: {
      // 文件类型
      type: String,
      default: 'file',
      validator(v) {
        return ['file', 'img', 'excel', 'zip'].includes(v)
      }
    },
    quality: {
      type: Number,
      validator(v) {
        // 质量默认是0.92, 不传就不压缩，传了就会调用压缩函数
        return v > 0 || v < 1
      }
    },
    // 限制大小，单位KB
    limitSize: {
      type: Number,
      default: 1024
    },
    // 分辨率限制数值，[宽， 高]
    limitImgWidthHeight: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否限制分辨率，如果限制传一个符号
    isLimitImgWidthHeight: {
      type: String,
      validator(v) {
        return ['=', '>', '<', '>=', '<='].includes(v)
      }
    }
  },
  data() {
    return {
      fileList: [],
      changing: false,
      over: true // 如果不满足条件就为true
    }
  },
  methods: {
    makeCanvas(img, width, height, quality) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width
      canvas.height = height
      // 铺底色 PNG转JPEG时透明区域会变黑色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, width, height)
      ctx.drawImage(img, 0, 0, width, height)
      const base64 = canvas.toDataURL('image/jpeg', quality)
      return base64
    },
    dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      let byteString

      /* istanbul ignore else */
      if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1])
      } else {
        byteString = unescape(dataURI.split(',')[1])
      }

      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to a typed array
      const ia = new Uint8Array(byteString.length)

      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia.buffer], { type: mimeString })
    },
    createImageInfo(imgUrl, fn = Function.prototype) {
      return new Promise((resolve, reject) => {
        const oImg = new Image()
        oImg.onload = () => {
          const offsetWidth = oImg.width
          const offsetHeight = oImg.height
          let newDataUrl = null
          let newBlob = null
          if (this.quality) {
            newDataUrl = this.makeCanvas(oImg, oImg.width, oImg.height, this.quality)
            newBlob = this.dataURItoBlob(newDataUrl)
          }
          fn(offsetWidth, offsetHeight, newDataUrl, newBlob)
          resolve({
            width: offsetWidth,
            height: offsetHeight,
            dataUrl: newDataUrl,
            blob: newBlob
          })
        }
        oImg.onerror = () => {
          reject(new Error('image load error'))
        }
        oImg.src = imgUrl // src 属性一定要写到 onload 的后面，否则程序在 IE 中会出错
      })
    },
    judgeLimitSizeFn(offsetWidth, offsetHeight) {
      // 判断分辨率是否符合条件
      const [w, h] = this.limitImgWidthHeight
      const width = +w
      const height = +h
      console.log('图片的宽高', offsetWidth, offsetHeight)
      if (width && height) {
        const obj = {
          '=': [
            offsetWidth === width && offsetHeight === height,
            `只能上传${width} * ${height}分辨率的图片`
          ],
          '>': [
            offsetWidth * offsetHeight > width * height,
            `请上传${width} * ${height}像素以上的图片`
          ],
          '<': [
            offsetWidth * offsetHeight < width * height,
            `请上传${width} * ${height}像素以下的图片`
          ],
          '>=': [
            offsetWidth * offsetHeight >= width * height,
            `请上传${width} * ${height}像素及以上的图片`
          ],
          '<=': [
            offsetWidth * offsetHeight <= width * height,
            `请上传${width} * ${height}像素及以以下的图片`
          ]
        }
        const [result, str] = obj[this.isLimitImgWidthHeight]
        console.log('分辨率结果', result)
        if (!result) {
          this.$message.error(`上传文件分辨率不对，${str}`)
        }
        return result
      }
      if (!width || !height) {
        // 限制了宽度或者高度
        let str = '宽度'
        let com = offsetWidth
        const val = width || height
        if (!width) {
          str = '高度'
          com = offsetHeight
        }
        const obj = {
          '=': [com === val, `只能上传${str}为${val}分辨率的图片`],
          '>': [com > val, `请上传${str}为${val}像素以上的图片`],
          '<': [com < val, `请上传${str}为${val}像素以下的图片`],
          '>=': [com >= val, `请上传${str}为${val}像素及以上的图片`],
          '<=': [com <= val, `请上传${str}为${val}像素及以以下的图片`]
        }
        const [result, STR] = obj[this.isLimitImgWidthHeight]
        console.log('分辨率结果', result)
        if (!result) {
          this.$message.error(`上传文件分辨率不对，${STR}`)
        }
        return result
      } // 没有限制 或者 通过了匹配 ，如果限制了高度没限制宽度是匹配不了的，放行了
      return true
    },
    async checkFileProblem(file, fileNum = 0) {
      // 检查图片是否合规
      console.log('检查图片是否合规')
      // 用fileType做类型校验其实不太准确，后续增加了outterAccept参数
      // 在使用outterAccept时还是尽量传一个fileType，不然可能会出现提示文字与类型不匹配的情况
      if (this.fileType === 'zip' && !file.raw.type.includes('zip')) {
        this.$message.error('上传文件格式不对，只能上传zip文件')
        return
      }
      if (
        this.fileType === 'excel' &&
        ![
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ].includes(file.raw.type)
      ) {
        this.$message.error('上传文件格式不对，只能上传xlsx文件')
        return
      }
      if (fileNum > this.limit) {
        // 数量限制
        this.$message.error(`上传文件数最多${this.limit}张`)
        return
      }
      if (file.size / 1024 > this.limitSize) {
        // 文件大小限制
        this.$message.error(
          `上传文件大小不能超过${this.limitSize}KB，您的文件大小${Math.ceil(file.size / 1024)}kb!`
        )
        return
      }
      if (this.fileType === 'img') {
        // 类型图片时限制图片类型
        if (!['image/jpeg', 'image/png'].includes(file.raw.type)) {
          this.$message.error('上传文件格式不对，只能上传jpeg/png文件')
          return
        }
        // 生成临时图片地址，用于展示
        const { raw, ...other } = file
        const blobUrl = this.createObjectURL(raw)
        if (this.isLimitImgWidthHeight || this.quality) {
          try {
            const { width, height, blob } = await this.createImageInfo(blobUrl)
            if (this.isLimitImgWidthHeight) {
              const trush = this.judgeLimitSizeFn(width, height)
              if (!trush) {
                // 如果为false，则将result赋值false，等外面过滤掉
                return false
              }
            }
            if (this.quality) {
              return {
                raw: blob,
                ...other
              }
            }
          } catch (error) {
            this.$message.error('图片异常！')
            console.error(error)
            return false
          }
        }
        this.$emit('linshiImage', blobUrl)
      }
      return file
    },
    async handlerHttpRequest(auto = false) {
      // 上传函数
      const AUTO_UPLOAD = auto || this.autoUpload
      console.log('this.action', this.action)
      if (!AUTO_UPLOAD) return
      const len = this.fileList.length
      try {
        const result = await Promise.all(this.fileList.map((f) => this.checkFileProblem(f, len)))
        console.log('上传', result)
        if (result.some((v) => !v)) {
          // 如果有false的则校验没通过
          this.clearFiles() // 清除文件
          return
        }
        this.fileList = result
      } catch (error) {
        this.$message.error('图片上传出错！')
        this.clearFiles() // 清除文件
        console.error(error)
      }
      try {
        const data = new FormData()
        this.fileList.forEach((file) => {
          data.append(this.name, file.raw)
        })
        Object.key(this.data).forEach((key) => {
          data.append(key, data[key])
        })
        const response = await __postUpload(this.action, data)
        this.$emit('success', response)
        typeof this.onSuccess === 'function' && this.onSuccess(response)
        this.clearFiles() // 清除文件
      } catch (error) {
        this.$emit('error', error)
        typeof this.onError === 'function' && this.onError(error)
        this.clearFiles() // 清除文件
        console.error(error)
      }
    },
    async fileChange(file, fileList) {
      // 选择文件，如果啥也没做，还是会赋值
      console.log(file, fileList)
      this.fileList = fileList
    },
    createObjectURL(object) {
      // 创建图片临时地址，其实很蠢，因为element-ui已经生成了临时地址，就在file对象里，当时没注意
      return window.URL
        ? window.URL.createObjectURL(object)
        : window.webkitURL.createObjectURL(object)
    },
    revokeObjectURL(objectURL) {
      // 销毁图片临时地址
      return window.URL
        ? window.URL.revokeObjectURL(objectURL)
        : window.webkitURL.revokeObjectURL(objectURL)
    },
    handlerExceedHandler() {
      // 文件超出个数限制时的钩子
      this.$message.warning('最多上传一个文件！')
    },
    handlerRemoveFile(file, fileList) {
      this.fileList = fileList
    },
    clearFiles() {
      // 清空文件
      this.$refs.upload.clearFiles()
    },
    uploadFile() {
      // 开始上传，调用upload的提交
      this.handlerHttpRequest(true)
    }
  },
  computed: {
    accept() {
      // 根据fileType设置上传类型
      const obj = {
        zip: 'application/zip',
        file: '*',
        img: 'image/jpeg, image/png',
        excel: '.xlsx'
      }
      return obj[this.fileType]
    },
    limitSizeStr() {
      const mb = this.limitSize / 1024
      return mb >= 1 ? `${mb}M` : `${this.limitSize}KB`
    },
    params() {
      // 用来展示提示文字的
      const obj = {
        zip: ['zip'],
        file: ['任意'],
        img: ['jpeg/png'],
        excel: ['xlsx']
      }
      return obj[this.fileType] || '任意'
    }
  }
}
</script>
