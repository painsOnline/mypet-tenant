import request from './request'

export function login(account: string, password: string, captchaToken?: string, captchaInput?: string) {
  return request({
    url: '/tenant/login',
    method: 'post',
    data: { account, password, captchaToken, captchaInput }
  })
}

export function getCaptcha() {
  return request({
    url: '/tenant/captcha',
    method: 'get'
  })
}

export function changePassword(data: { oldPassword: string; newPassword: string }) {
  return request({
    url: '/tenant/password',
    method: 'put',
    data
  })
}
