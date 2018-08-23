<template>
  <div>
    <x-header title="一把火" />
    <group>
      <x-input title="秘钥" v-model="key"/>
    </group>
    <group>
      <x-textarea placeholder="请输入需要加密或解密的内容" :rows="12" v-model="input" />
    </group>
    <div id="result-panel"></div>
    <grid :cols="2" :show-lr-borders="false" :show-vertical-dividers="false">
      <grid-item >
        <x-button type="warn" class="btn" text="加密" @click.native="encrypt"/>
      </grid-item>
      <grid-item>
        <x-button type="primary" class="btn" text="解密" @click.native="decrypt"/>
      </grid-item>
    </grid>
    <alert v-model="showOutput" @on-hide="output = ''">
      <div id="output-content" ref="output" class="output-content">{{output}}</div>
    </alert>
  </div>
</template>

<script>
import {
  Grid,
  GridItem,
  XTextarea,
  Flexbox,
  FlexboxItem,
  XHeader,
  XInput,
  Group,
  XButton,
  XDialog,
  Card,
  Alert
} from 'vux'

import CryptoJS from 'crypto-js'
import Clipboard from 'clipboard'
import { Base64 } from 'js-base64'

export default {
  name: 'one-fire',
  components: {
    Grid,
    GridItem,
    XTextarea,
    Flexbox,
    FlexboxItem,
    XHeader,
    XInput,
    Group,
    XButton,
    XDialog,
    Card,
    Alert
  },
  data () {
    return {
      input: '',
      key: '',
      vi: '',
      output: ''
    }
  },
  computed: {
    showOutput: {
      get () {
        return !!this.output
      },
      set (value) {
        if (!value) {
          this.output = ''
        }
      }
    }
  },
  created () {
  },
  methods: {
    encrypt () {
      const word = this.input
      const key = CryptoJS.enc.Utf8.parse(this.Key)
      const iv = CryptoJS.enc.Utf8.parse(this.Vi)
      let srcs = CryptoJS.enc.Utf8.parse(word)
      let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
      this.output = Base64.encode(encrypted.ciphertext.toString().toUpperCase())
      this.copyResult()
    },
    decrypt () {
      const word = Base64.decode(this.input)
      const key = CryptoJS.enc.Utf8.parse(this.Key)
      const iv = CryptoJS.enc.Utf8.parse(this.Vi)
      let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
      let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
      this.Out = decryptedStr.toString()
      var regex = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/
      if (regex.test(this.output) && confirm('检测到链接，要打开吗？')) {
        window.open(this.output)
      }
      var reg = new RegExp(/^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i) // eslint-disable-line
      if (reg.test(this.output)) {
        if (this.Out.substr(0, 10) === 'data:image') {
          document.getElementById('showBase64Image').innerHTML = '<img src="' + this.output + '"/>'
        } else if (confirm('检测到Base64，要解密吗？')) {
          this.Out = Base64.decode(this.output)
          this.copyResult()
          document.getElementById('showBase64Image').innerHTML = ''
        }
      } else {
        document.getElementById('showBase64Image').innerHTML = ''
      }
    },
    copyResult () {
      this.$refs.output.select()
      if (document.execCommand('copy')) {
        this.$vux.toast.text('结果已复制到剪切板', 'bottom')
        this.$refs.output.clearSelection()
      } else {
        this.$vux.toast.text('复制失败，请手动复制', 'bottom')
      }
    }
  }
}
</script>

<style scoped>
</style>
