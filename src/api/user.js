import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getList(data) {
  return request({
    url : '/admin/userManager/userInfo',
    method : 'get',
    params : data
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function resendEmailById(id) {
  return request({
    url: '/admin/userManager/sendEmail/' + id,
    method: 'get'
  })
}

export function resetPassById(id) {
  return request({
    url: '/admin/userManager/resetUserPass/' + id,
    method: 'get'
  })
}

export function delUserById(id) {
  return request({
    url: '/admin/userManager/' + id,
    method: 'delete'
  })
}