import request from '@/utils/request'
import axios from 'axios'

export const getMissionInfo = params => {
  return request({
    url: '/open/wxtask/help/info',
    method: 'get',
    params: params
  })
}

export const getPosterInfo = params => {
  return request({
    url: '/open/wxtask/help/poster',
    method: 'get',
    params: params
  })
}

const APPID = 'wx1ae5569fd1bd1e3e'
const APPSECRET = '22437a698a6bac6837a866d723c9a261'

// 获取路由
export const getAccessToken = () => {
  return axios({
    url: `/wechat/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`,
    method: 'get'
  })
}

export const getWechatInfo = params => {
  return axios({
    url: '/api/open/wxmp/info',
    method: 'get',
    params: params
  })
}

export const getOauth2 = params => {
  return axios({
    url: '/api/open/wxmp/oauth2',
    method: 'get',
    params: params
  })
}

export const getFile = url => {
  return axios.get(url)
}
