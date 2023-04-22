import request from '@/utils/request'

export function getArticles(data) {
    return request({
        url: '/admin/forumManager/articles',
        method: 'get',
        params: data,
    })
}