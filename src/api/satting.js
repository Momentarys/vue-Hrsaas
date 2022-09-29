import request from '@/utils/request'

/**
 * 获取角色列表
 * ***/
export const getRoleListAPI = (params) => {
  return request({
    url: '/sys/role',
    params // page 页码  pagesize 每页条数
  })
}

/** *
 * 新增角色
 * ***/
export function addRoleAPI(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/**
 * 修改角色
 * @param {*} data 传递对象
 * @returns promise
 */
export function updateRoleAPI(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

/** **
 *  删除角色
 * 删除的id 传送给后端
 * ****/
export function deleteRoleAPI(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfoAPI(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
