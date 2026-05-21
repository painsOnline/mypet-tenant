<template>
  <el-container class="h-full">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <h2>宠物社区私域 - 多租户管理</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/tenant">
          <el-icon><OfficeBuilding /></el-icon>
          <span>租户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>系统管理员</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="shop-name">宠物社区私域 - 多租户管理</span>
        </div>
        <div class="header-right">
          <span class="admin-info">
            <el-icon><UserFilled /></el-icon>
            {{ authStore.adminInfo.account }}
          </span>
          <el-button type="danger" size="small" text @click="handleLogout">退出</el-button>
        </div>
      </el-header>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessageBox } from 'element-plus'
import { OfficeBuilding, User, UserFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)

document.title = '宠物社区私域 - 多租户管理'

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
  }).then(() => { authStore.logout(); router.push('/login') }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.aside {
  background-color: #304156;
  overflow-y: auto;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  .logo {
    padding: 20px 12px;
    h2 {
      color: #fff;
      font-size: 16px;
      text-align: center;
    }
  }
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}
.header-left .shop-name { font-size: 16px; font-weight: 600; }
.header-right { display: flex; align-items: center; gap: 12px; }
.shop-name { font-size: 16px; font-weight: 600; }
:deep(.el-container) { margin-left: 220px; }
</style>
