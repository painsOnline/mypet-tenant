import request from './request'

export function getMigrationList() {
  return request({ url: '/tenant/migration/list', method: 'get' })
}

export function runMigrationApi(name: string) {
  return request({ url: `/tenant/migration/run/${name}`, method: 'post' })
}
