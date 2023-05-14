import request from '@/utils/request'

export function getMovieCnt() {
    return request({
        url: '/admin/homeManager/movieCnt',
        method: 'get',
    })
}

export function getArticleCnt() {
    return request({
        url: '/admin/homeManager/articleCnt',
        method: 'get',
    })
}

export function getHomeVisit() {
    return request({
        url: '/admin/homeManager/visitCnt',
        method: 'get',
    })
}

export function getUserCnt() {
    return request({
        url: '/admin/homeManager/userCnt',
        method: 'get',
    })
}

export function getLoginCntByWeek() {
    return request({
        url: '/admin/homeManager/loginCntByWeek',
        method: 'get',
    })
}

export function getArticleCntByWeek() {
    return request({
        url: '/admin/homeManager/articleCntByWeek',
        method: 'get',
    })
}