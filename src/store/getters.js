const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // 建立token的快捷访问
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.username, // 建立对于用户名的快捷访问
  userId: state => state.user.userInfo.userId, // 建立对于用户名的快捷访问
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立头像的快捷访问
  hrsaasTime: state => state.user.hrsaasTime,
  companyId: state => state.user.userInfo.companyId
}
export default getters
