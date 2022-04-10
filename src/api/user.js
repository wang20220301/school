import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login/index',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'api/login/check_token',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
