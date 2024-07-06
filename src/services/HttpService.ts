'use client'

import axios from 'axios'
import toast from 'react-hot-toast'
import { showToast } from '@/utils/show-toast'
import { LOCAL_STORAGE_KEYS } from '@/features/shared/shared.interface'

const TIMEOUT = 5000

const _axios = axios.create({
  timeout: TIMEOUT
})

_axios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)

      config.headers
      if (token) {
        config.headers['Authorization'] = `Token ${token}`
      }
      return config
    }
    return config
  },
  (error) => {
    toast.error(error)
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  (response) => {
    showToast({ response })
    return response
  },
  (error) => {
    toast.error(error)
    return Promise.reject(error)
  }
)

const getAxiosClient = () => _axios

const HttpService = {
  getAxiosClient,
  get: getAxiosClient().get,
  post: getAxiosClient().post,
  put: getAxiosClient().put,
  patch: getAxiosClient().patch,
  delete: getAxiosClient().delete
}

export default HttpService
