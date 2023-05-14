import request from '@/utils/request'

export function getAllMovie() {
  return request({
    url: '/admin/systemManager/getAllMovie',
    method: 'get'
  })
}

export function getList(data) {
  return request({
    url: '/admin/movieManager/movieInfo',
    method: 'get',
    params: data
  })
}

export function getVideoList(data) {
  return request({
    url: '/admin/movieManager/movieVideoInfo',
    method: 'get',
    params: data
  })
}

export function delVideo(id) {
  return request({
    url: '/admin/movieManager/movieVideo/' + id,
    method: 'delete',
  })
}

export function addMovievideoInfo(data) {
  return request({
    url: '/admin/movieManager/movieVideo',
    method: 'post',
    data: data,
  })
}

export function getMovieCommentList(data) {
  return request({
    url: '/admin/movieManager/movieComments',
    method: 'get',
    params: data,
  })
}

export function delMovieComment(id) {
  return request({
    url: '/admin/movieManager/movieComment/' + id,
    method: 'delete',
  })
}

export function delMovieCommentByBatch(ids) {
  return request({
    url: '/admin/movieManager/movieComment',
    method: 'delete',
    data: ids,
  })
}

export function delMovieById(id) {
  return request({
    url: '/admin/movieManager/movie/' + id,
    method: 'delete',
  })
}

export function addMovieInfo(data) {
  return request({
    url: '/admin/movieManager/movie/',
    method: 'post',
    data:data
  })
}