<template>
  <div id="app">
    <view-box ref="viewBox" body-padding-top="50px">
      <x-header slot="header" title="一把火" style="width:100%;position:absolute;left:0;top:0;z-index:100;"></x-header>
      <template>
        <group>
          <x-input title="秘钥" v-model="key"/>
        </group>
        <group>
          <x-textarea placeholder="请输入需要加密或解密的内容" autosize :rows="12" v-model="input" />
        </group>
      </template>
      <tabbar slot="bottom">
        <flexbox class="bottom-buttons" wrap="nowrap" :gutter="8">
          <flexbox-item>
            <x-button type="default" class="btn" text="粘贴" @click.native="paste"/>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" class="btn" text="加密" @click.native="encrypt"/>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" class="btn" text="解密" @click.native="decrypt"/>
          </flexbox-item>
        </flexbox>
      </tabbar>
    </view-box>
    <alert v-model="showOutput" @on-hide="output = ''" :title="copySuccess ? '已自动复制内容' : '请手动复制'">
      <div id="output-content" class="output-content">{{output}}</div>
    </alert>
    <button ref="resultButton" :data-clipboard-text="output" style="display: none"></button>
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
  Alert,
  ViewBox,
  Tabbar,
  TabbarItem
} from 'vux'

import CryptoJS from 'crypto-js'
import Clipboard from 'clipboard'
import { Base64 } from 'js-base64'

export default {
  name: 'app',
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
    Alert,
    ViewBox,
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      input: '',
      key: '',
      vi: '',
      output: '',
      copySuccess: false
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
  watch: {
    key () {
      window.localStorage.setItem('key', this.key)
    },
    vi () {
      window.localStorage.setItem('vi', this.vi)
    }
  },
  created () {
    this.key = window.localStorage.getItem('key') || ''
    this.vi = window.localStorage.getItem('vi') || ''
  },
  mounted () {
    let clipboardOut = new Clipboard(this.$refs.resultButton)
    clipboardOut.on('success', (e) => {
      this.$vux.toast.text('已自动复制内容', 'bottom')
      this.copySuccess = true
      e.clearSelection()
    })
    clipboardOut.on('error', (e) => {
      this.$vux.toast.text('复制失败，请手动复制', 'bottom')
      this.copySuccess = false
      e.clearSelection()
    })
  },
  methods: {
    encrypt () {
      const word = this.input
      const key = CryptoJS.enc.Utf8.parse(this.key)
      const iv = CryptoJS.enc.Utf8.parse(this.Vi)
      let srcs = CryptoJS.enc.Utf8.parse(word)
      let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
      this.output = Base64.encode(encrypted.ciphertext.toString().toUpperCase())
      this.$nextTick(() => {
        this.copyResult()
      })
    },
    decrypt () {
      const word = Base64.decode(this.input)
      const key = CryptoJS.enc.Utf8.parse(this.key)
      const iv = CryptoJS.enc.Utf8.parse(this.Vi)
      let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
      let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
      this.output = decryptedStr.toString()
      // var regex = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/
      // if (regex.test(this.output) && confirm('检测到链接，要打开吗？')) {
      //   window.open(this.output)
      // }
      // var reg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i // eslint-disable-line
      // if (reg.test(this.output)) {
      //   if (this.Out.substr(0, 10) === 'data:image') {
      //     document.getElementById('showBase64Image').innerHTML = '<img src="' + this.output + '"/>'
      //   } else if (confirm('检测到Base64，要解密吗？')) {
      //     this.Out = Base64.decode(this.output)
      //     document.getElementById('showBase64Image').innerHTML = ''
      //   }
      // } else {
      //   document.getElementById('showBase64Image').innerHTML = ''
      // }

      this.$nextTick(() => {
        this.copyResult()
      })
    },
    copyResult () {
      this.$refs.resultButton.click()
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

body {
  background-color: #fbf9fe;
}

#app {
  width: 100%;
  height: 100%;

  .output-content {
    max-height: 80vh;
    overflow: auto;
    user-select: all;
  }
}

.bottom-buttons {
  padding: 8px 15px;
}
</style>
