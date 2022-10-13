import request from '@/utils/request'
export function login(data) {

}

/**
 * 获取用户的基本资料
 * @returns
 */
export function getUserInfoAPI() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/** *
 *
 * 获取用户的基本信息
 * **/
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

/**
 * 保存员工基本信息
 * @param {Object} data {}
 * @returns promise
 */
export const saveUserDetailById = (data) => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
