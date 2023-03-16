import request from '@/utils/request'

export function getList(data) {
    return request({
        url: '/admin/typeManager/typeInfo',
        method: 'get',
        params: data
    })
}

export function getType(id) {
    return request({
        url: '/admin/typeManager/type/' + id,
        method: 'get',
    })
}

export function getListMovie(data) {
    return request({
        url: '/admin/typeManager/getTypeMovies',
        method: 'get',
        params: data
    })
}

export function delType(id) {
    return request({
        url: '/admin/typeManager/type/' + id,
        method: 'delete',
    })
}

export function addType(data) {
    return request({
        url: '/admin/typeManager/type/',
        method: 'post',
        data
    })
}

export function updateType(data) {
    return request({
        url: '/admin/typeManager/typeInfo',
        method: 'put',
        data
    })
}