import request from '@/utils/request'

export function getCarouselList() {
    return request({
        url: '/admin/systemManager/getCarousels',
        method: 'get'
    })
}

export function addCar(data) {
    return request({
        url: '/admin/systemManager/addCarousel',
        method: 'post',
        data
    })
}

export function delCarousel(id) {
    return request({
        url: '/admin/systemManager/delCarousel/' + id,
        method: 'get'
    })
}

export function getCarousel(id) {
    return request({
        url: '/admin/systemManager/carousel/' + id,
        method: 'get',
    })
}

export function updateCarousel(data) {
    return request({
        url: '/admin/systemManager/updateCarousel',
        method: 'post',
        data
    })
}

export function getRecommendList(data) {
    return request({
        url: '/admin/systemManager/sysRecommends',
        method: 'get',
        params: data
    })
}

export function addReco(data) {
    return request({
        url: '/admin/systemManager/sysRecommend',
        method: 'post',
        data
    })
}

export function delReco(id) {
    return request({
        url: '/admin/systemManager/sysRecommend/' + id,
        method: 'delete',
    })
}

export function updateReco(data) {
    return request({
        url: '/admin/systemManager/updateSysRecommend',
        method: 'post',
        data
    })
}

export function getLogInfo(rid, queryInfo) {
    return request({
        url: '/admin/systemManager/logInfo/' + rid,
        method: 'get',
        params: queryInfo,
    })
}