// 封装API（UniApp小程序专用版）
import axios from 'axios'
// import { userStore } from '@/store/modules/user'
// import router from '@/router'

// 使用UniApp原生API替代element-plus的ElMessage
const showError = (title) => {
  uni.showToast({
    title,
    icon: 'none',
    duration: 3000
  })
}
const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: Number(process.env.VUE_APP_API_TIMEOUT || 5000),
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  // 添加自定义适配器以支持UniApp环境
  adapter: function(config) {
    return new Promise((resolve, reject) => {
      uni.request({
        method: config.method.toUpperCase(),
        // 修复当 baseURL 为空时拼接出错的问题
        url: (config.baseURL || '') + config.url,
        header: config.headers,
        data: config.data,
        dataType: 'json',
        success: (response) => {
          resolve({
            data: response.data,
            status: response.statusCode,
            statusText: 'OK',
            headers: response.header,
            config: config
          });
        },
        fail: (error) => {
          reject(new Error(error.errMsg || 'Network Error'));
        }
      });
    });
  }
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 显示加载动画（使用UniApp原生API）
    if (config.showLoading !== false) {
      uni.showLoading({
        title: config.loadingText || '加载中...',
        mask: true
      })
    }

    // 添加token
    // if (userStore.token) {
    //   config.headers.Authorization = `Bearer ${userStore.token}`
    // }

    // 处理GET请求缓存问题
    if (config.method?.toUpperCase() === 'GET' && config.params) {
      config.params._t = Date.now()
    }

    return config
  },
  error => {
    uni.hideLoading()
    showError('请求配置错误')
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    uni.hideLoading()
    
    if (response.status !== 200) {
      showError(response.statusText || '操作失败')

      // 401 token过期处理
      if (response.code === 401) {
        // userStore.logout()
        // router.push('/login')
      }
      return Promise.reject(response.data)
    }

    return response.data
  },
  error => {
    uni.hideLoading()
    const errorMsg = handleError(error)
    console.log('errorMsg ==== >> ', errorMsg);
    showError(errorMsg)
    return Promise.reject(error)
  }
)

// 错误处理函数
function handleError(error) {
  if (!error.response) {
    return '网络连接错误，请检查网络设置'
  }

  if (error.message.includes('timeout')) {
    return '请求超时，请稍后重试'
  }

  const status = error.response.status
  switch (status) {
    case 401:
      // userStore.logout()
      // router.push('/login')
      return '登录已过期，请重新登录'
    case 403:
      return '没有权限访问该资源'
    case 404:
      return '请求的资源不存在'
    case 500:
      return '服务器内部错误，请稍后再试'
    default:
      return `请求失败 (${status})`
  }
}

// 导出常用请求方法
export const api = {
  get: (url, params = {}, config = {}) => request({
    url, params, method: 'get', ...config
  }),

  post: (url, data = {}, config = {}) => request({
    url, data, method: 'post', ...config
  }),

  put: (url, data = {}, config = {}) => request({
    url, data, method: 'put', ...config
  }),

  delete: (url, params = {}, config = {}) => request({
    url, params, method: 'delete', ...config
  }),

  upload: (url, file, config = {}) => {
    const formData = new FormData()
    formData.append('file', file)
    return request({
      url,
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config
    })
  },

  cancelToken: () => axios.CancelToken.source()
}

export const cancelRequest = (source) => {
  source.cancel('请求已取消')
}

export default request