import request from './request'

// ---- Auth (re-exported from auth.ts) ----
export { login, getCaptcha, changePassword } from './auth'

// ---- Dashboard ----
export function getDashboardStats() {
  return request({ url: '/tenant/dashboard/stats', method: 'get' })
}

// ---- Tenant Management ----
export function getTenants() {
  return request({ url: '/tenant/tenants', method: 'get' })
}

export function getTenantDetail(id: string) {
  return request({ url: `/tenant/tenants/${id}`, method: 'get' })
}

export function createTenant(data: {
  code: string
  name: string
  databaseInstanceId: string
  isDisable: number
  isBussinessOpen: number
  freeShippingAmount: number
}) {
  return request({ url: '/tenant/tenants', method: 'post', data })
}

export function updateTenant(
  id: string,
  data: {
    name?: string
    isDisable?: number
    isBussinessOpen?: number
    freeShippingAmount?: number
  }
) {
  return request({ url: `/tenant/tenants/${id}`, method: 'put', data })
}

export function deleteTenant(id: string) {
  return request({ url: `/tenant/tenants/${id}`, method: 'delete' })
}

export function getDatabaseInstances() {
  return request({ url: '/tenant/database-instances', method: 'get' })
}

// ---- Admin Management ----
export function getAdmins() {
  return request({ url: '/tenant/admins', method: 'get' })
}

export function createAdmin(data: { account: string; password: string }) {
  return request({ url: '/tenant/admins', method: 'post', data })
}

export function deleteAdmin(id: string) {
  return request({ url: `/tenant/admins/${id}`, method: 'delete' })
}

export function changeAdminPassword(id: string, newPassword: string) {
  return request({ url: `/tenant/admins/${id}/password`, method: 'put', data: { newPassword } })
}
