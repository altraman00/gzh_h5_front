<template>
  <div class="home">
    <div class="header">
      <p class="title">{{title || ''}}</p>
      <div @click="getBooks" :class="{'active': status === 2}" class="btn btn-receive">点击领取</div>
    </div>
    <div v-if= "status === 1" class="section">
      <p class="section-tips">就差{{needNum - completeNum}}位好友，就能领取秘籍啦。</p>
      <div :class="{'single-line': helpers.length <=5}" class="friends-group">
        <div v-for="user in helpers" :key="user.id" class="friend-item">
          <div :style="{backgroundImage: `url(${user.headimgUrl})`}" class="avatar"></div>
          <p class="username">{{user.nickName}}</p>
        </div>
        <div v-for="item in empty" :key="item.id" class="friend-item">
          <div class="avatar"></div>
          <p class="username">未邀请</p>
        </div>
      </div>
      <div @click="invitePerson" class="btn-invite">邀请助力</div>
    </div>
    <div v-if= "status === 1" class="section no-bottom">
      <p class="title">简单三步即可获得秘籍</p>
      <div class="step-list">
        <div class="step-item">1
          <div class="text">
            <p>分享图片至好</p>
            <p>友或好友群</p>
          </div>
        </div>
        <div class="step-item">2
          <div class="text">
            <p>{{needNum}}名好友关注</p>
            <p>公众号</p>
          </div>
        </div>
        <div class="step-item">3
          <div class="text">
            <p>助力完成</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if= "status === 2" class="section">
      <p class="section-tips">已经有{{completeNum}}位好友助力，赶快去领取秘籍吧。</p>
      <div class="friends-group">
        <div v-for="user in helpers" :key="user.id" class="friend-item">
          <div :style="{backgroundImage: `url(${user.headimgUrl})`}" class="avatar"></div>
          <p class="username">{{user.nickName}}</p>
        </div>
      </div>
      <p class="finish-text">恭喜，邀请成功了</p>
    </div>
    <!-- <div class="footer">
      <p>领取过程中，若有疑问，可添加老师微信号：</p>
      <p>wxind-xxx</p>
    </div> -->
    <div v-if = "showModal" class="modal">
      <div v-loading="loading" class="img-wrap">
        <img class="img" :src="`data:image/png;base64,${posterBase64}`" alt srcset />
        <!-- <div @click="dowload" class="download"></div> -->
        <p>长按保存图片到相册，再转发</p>
      </div>
      <span @click="showModal = false"></span>
    </div>
    <!-- <article>appId：{{appId}}</article>
    <article>user{{user}}</article>
    <article>{{helpers}}</article>
    <article>auth res: {{res1}}</article>
    <article>mission info res: {{res2}}</article>
    <article>poster info res: {{res3}}</article> -->
    <!-- <div style="width: 200px;height: 300px;overflow: auto">{{res}}</div>
    <div style="width: 100%;height:1000px;overflow: auto">{{posterBase64}}</div>-->
  </div>
</template>

<script>
import {
  getWechatInfo,
  getOauth2,
  getMissionInfo,
  getPosterInfo
} from '@/apis'

export default {
  data () {
    return {
      loading: false,
      status: 1,
      completeNum: 0,
      needNum: 0,
      code: null,
      res: null,
      user: null,
      appId: null,
      posterBase64: null,
      showModal: false,
      empty: [],
      helpers: [],
      res1: null,
      res2: null,
      res3: null,
      rewardUrl: null,
      openId: null,
      title: null
    }
  },
  methods: {
    dowload () {
      window.location.href = `data:image/png;base64,${this.posterBase64}`
    },
    invitePerson () {
      this.showModal = true
      if (this.posterBase64) {
        return
      }
      this.loading = true
      const params = {
        appId: this.appId,
        openId: this.openId
      }
      getPosterInfo(params).then(res => {
        this.res3 = res
        this.posterBase64 = res.data.posterBase64
        this.loading = false
      })
    },
    getBooks () {
      if (this.status === 2) {
        window.location.href = this.rewardUrl
      }
    },
    getWechatInfo (code) {
      getWechatInfo({ appIdentify: 'online_study' }).then(res => {
        // this.appId = res.data.data.wxMp.appId
        this.getUserInfo(code)
      })
    },
    getUserInfo (code, appId) {
      getOauth2({ code, appId }).then(res => {
        this.res1 = res
        this.user = res.data.data.wxMpUser
        this.openId = res.data.data.wxMpUser.openId
        // this.appId = res.data.data.wxMp.appId
        this.getMissionInfo(res.data.data.wxMpUser.openId)
      })
    },
    getMissionInfo (openId) {
      // om_6Xsw3Q0VJaZWtVr5TyyaTh774
      const params = {
        appId: this.appId,
        openId
      }
      getMissionInfo(params).then(res => {
        this.res2 = res
        this.needNum = res.data.needNum
        this.completeNum = res.data.completeNum
        this.rewardUrl = res.data.rewardUrl
        this.status = res.data.status
        this.title = res.data.jpTitleName
        this.list = []
        const list = res.data.helpers
        this.helpers = list
        const length = 3 - list.length

        for (let i = 0; i < length; i++) {
          this.empty.push({ id: i })
        }
      })
    }
  },
  created () {
    // this.getWechatInfo()
    if (this.$route.query.code) {
      const code = this.$route.query.code
      this.appId = this.$route.query.state
      this.getUserInfo(code, this.$route.query.state)
    }
    // this.getMissionInfo('')
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9047d074c6a5a211&redirect_uri=http://gzh.supplus.cn/402&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect
  }
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: auto;
  .header {
    width: 100%;
    height: 10rem;
    background: url(../assets/header2.png) no-repeat top center;
    background-size: 100% auto;
    position: relative;
    .btn{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 95px;
      height: 30px;
      border-radius: 22px;
      background-color: #d8d8d8;
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      &.active{
        background-color: #fb7111;
      }
    }
    .title{
      position: absolute;
      top: 40px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      color: #f84a39;
      font-family: ZYWenYiHei;
      text-align: center;
      font-weight: 700;
      text-align: center;
    }
  }
  .section {
    .section-tips {
      padding: 1.875rem 0;
      font-size: 0.875rem;
      font-weight: 400;
      color: #555658;
      text-align: center;
    }
    .finish-text{
      font-size: 18px;
      color: #fb7111;
      padding: 7rem 0;
      text-align: center;
    }
    .friends-group {
      width: 100%;
      // display: flex;
      // justify-content: space-around;
      // align-items: center;
      // flex-wrap: wrap;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-column-gap: 0.5rem;
      grid-row-gap: 1rem;
      &.single-line{
        display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      }
      .friend-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .avatar {
          background-image: url(../assets/icon.png);
          width: 2.5rem;
          height: 2.5rem;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          border-radius: 50%;
        }
        .username {
          font-size: 0.75rem;
          color: #555658;
          padding-top: 0.25rem;
        }
      }
    }
    .btn-invite {
      width: 10.625rem;
      height: 2.75rem;
      border-radius: 2.75rem;
      background-color: #fb7111;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 1.0625rem;
      font-weight: 600;
      margin: 2rem auto;
    }
    .title {
      color: #555658;
      font-size: 1rem;
      padding-top: 2rem;
      text-align: center;
      font-weight: 600;
    }
    .step-list {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1.875rem;
      padding-bottom: 4.6875rem;
      .step-item {
        position: relative;
        width: 1.5625rem;
        height: 1.5625rem;
        border-radius: 50%;
        background-color: #fb7111;
        display: flex;
        color: #fff;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        &:nth-child(2) {
          margin: 0 6.365rem;
          &:before {
            content: "";
            width: 6.365rem;
            height: 1px;
            background-color: #fb7111;
            position: absolute;
            top: 50%;
            right: 1.5625rem;
            transform: translateY(-50%);
          }
          &:after {
            content: "";
            width: 6.365rem;
            height: 1px;
            background-color: #fb7111;
            position: absolute;
            top: 50%;
            left: 1.5625rem;
            transform: translateY(-50%);
          }
        }
        .text {
          position: absolute;
          top: 1.8125rem;
          left: 50%;
          width: 5.2rem;
          font-size: 12px;
          color: #555658;
          line-height: 1rem;
          transform: translateX(-50%);
          text-align: center;
        }
      }
    }
    border-bottom: 1px solid rgba($color:#d8d8d8, $alpha: 0.3);
    &.no-bottom{
      border-bottom: none;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 1rem;
    p {
      font-size: 13px;
      font-weight: 400;
      color: #8f9092;
      line-height: 19px;
    }
  }
}
.modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  background-color: rgba($color: #555658, $alpha: 0.6);
  .img-wrap {
    width: 100%;
    display: flex;
    padding: 30px;
    border-radius: 4px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #fff;
  }
  p{
    padding: 1rem 0;
  }
  .img {
    flex-shrink: 0;
    display: inline-block;
    width: auto;
    height: 400px;
    max-height: 400px;
    // background-color: #fb7111;
  }
  span {
    display: flex;
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: url(../assets/close.png) no-repeat center center;
    background-size: contain;
    margin-top: 1.125rem;
  }
  .download{
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    margin: 0 auto;
    margin-top: 10px;
    display: inline-block;
    background: url(../assets/download.png) no-repeat center center;
    background-size: contain;
  }
}
</style>
