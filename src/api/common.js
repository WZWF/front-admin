import request from '@/utils/request'

export function getID() {
    return request({
        url: '/common/getId',
        method: 'get'
    })
}