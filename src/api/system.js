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