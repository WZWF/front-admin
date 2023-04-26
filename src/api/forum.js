import request from '@/utils/request'

export function getArticles(data) {
    return request({
        url: '/admin/forumManager/articles',
        method: 'get',
        params: data,
    })
}

export function getComments(data) {
    return request({
        url: '/admin/forumManager/comments',
        method: 'get',
        params: data,
    })
}

export function delArticleComment(id) {
    return request({
        url: '/admin/forumManager/comment/' + id,
        method: 'delete',
    })
}

export function delCommentByBatch(ids) {
    return request({
        url: '/admin/forumManager/comments',
        method: 'delete',
        data: ids,
    })
}

export function delEassyByBatch(ids) {
    return request({
        url: '/admin/forumManager/articles',
        method: 'delete',
        data: ids,
    })
}

export function delEssay(id) {
    return request({
        url: '/admin/forumManager/article/' + id,
        method: 'delete',
    })
}

export function auditedEssay(type, id) {
    return request({
        url: '/admin/forumManager/article/' + type + "/" + id,
        method: 'post',
    })
}

export function auditedEssayByBatch(data) {
    return request({
        url: '/admin/forumManager/articles',
        method: 'post',
        data: data,
    })
}

export function getArticleById(id) {
    return request({
        url: '/admin/forumManager/article/' + id,
        method: 'get',
    })
}