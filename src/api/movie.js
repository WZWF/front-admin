import request from '@/utils/request'

export function getAllMovie() {
    return request({
        url: '/admin/systemManager/getAllMovie',
        method: 'get'
    })
}

export function getList(data) {
    return request({
      url : '/admin/movieManager/movieInfo',
      method : 'get',
      params : data
    })
  }