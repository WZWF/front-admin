import request from '@/utils/request'

export function taskInfo(identifier) {
    return request({
        url: '/upload/task/' + identifier,
        method: 'get',
    })
}

export function initTask(data) {
    return request({
        url: '/upload/initTask',
        method: 'post',
        data
    })
}

export function preSignUrl(data) {
    return request({
        url: '/upload/tasks/' + data.identifier + "/" + data.partNumber,
        method: 'get',
    })
}

export function merge(identifier) {
    return request({
        url: '/upload/merge/' + identifier,
        method: 'get',
    })
}