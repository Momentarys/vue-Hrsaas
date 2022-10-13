import request from '@/utils/request'
/**
 *  获取员工的简单列表
 * **/
export function getEmployeeSimpleAPI() {
  return request({
    url: '/sys/user/simple'
  })
}

/**
 * 获取员工的综合列表数据
 * ***/
export function getEmployeeListAPI(params) {
  return request({
    url: '/sys/user',
    params
  })
}

/** **
 *  新增员工的接口
 * **/
export function addEmployeeAPI(data) {
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}

/**
 * 删除员工接口
 * ****/

export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function importEmployeeAPI(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

/**
 * 获取员工个人信息
 * @param {*} id
 * @returns promise
 */
export const getEmployeesInof = (id) => {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/**
 * 保存员工个人信息
 * @param {*} data
 * @returns promise
 */
export const saveEmployeesInof = (data) => {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/**
 * 获取员工岗位信息
 * @param {Object} data {}
 * @returns
 */
export const gitEmployeesJobInof = (id) => {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存员工岗位信息
 * @param {*} id
 * @returns
 */
export const saveEmployeesJobInof = (data) => {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
