<template>
  <div class="migration-page">
    <el-card>
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>数据库迁移管理</span>
          <el-button type="primary" @click="loadList">刷新列表</el-button>
        </div>
      </template>

      <el-table :data="migrations" border stripe v-loading="loading" style="width:100%">
        <el-table-column prop="name" label="迁移文件" min-width="320" />
        <el-table-column prop="target" label="目标库" width="100" align="center" />
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'success'" type="success">已执行</el-tag>
            <el-tag v-else-if="row.status === 'running'" type="warning">执行中</el-tag>
            <el-tag v-else-if="row.status === 'failed'" type="danger">失败</el-tag>
            <el-tag v-else type="info">待执行</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="execTime" label="执行时间" width="180" align="center" />
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status !== 'running'"
              type="primary" size="small"
              :disabled="row.status === 'running'"
              @click="runMigration(row.name)"
            >
              {{ row.status === 'success' ? '重新执行' : '执行' }}
            </el-button>
            <el-tag v-else type="warning" size="small">执行中...</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="migrations.length === 0 && !loading" style="text-align:center;padding:40px;color:#999">
        暂无迁移文件
      </div>
    </el-card>

    <el-card style="margin-top:20px">
      <template #header>执行结果</template>
      <pre v-if="lastResult" style="background:#f5f7fa;padding:16px;border-radius:4px;overflow-x:auto;max-height:300px">{{ lastResult }}</pre>
      <div v-else style="text-align:center;padding:40px;color:#999">点击上方按钮执行迁移，结果将显示在这里</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMigrationList, runMigrationApi } from '@/api/migration'

interface MigrationItem {
  name: string
  target: string
  status: string
  execTime?: string
}

const migrations = ref<MigrationItem[]>([])
const loading = ref(false)
const lastResult = ref('')

async function loadList() {
  loading.value = true
  try {
    const res = await getMigrationList()
    migrations.value = res.data.result || []
  } catch (e: any) {
    ElMessage.error('加载迁移列表失败: ' + (e.message || e))
  } finally {
    loading.value = false
  }
}

async function runMigration(name: string) {
  try {
    await ElMessageBox.confirm(`确定要执行迁移 "${name}" 吗？该迁移将运行在 empty 模板库和所有租户业务库上。`, '确认执行', {
      confirmButtonText: '确定执行',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }

  lastResult.value = '执行中...'
  try {
    const res = await runMigrationApi(name)
    const data = res.data
    if (data.code === '200') {
      lastResult.value = JSON.stringify(data.result, null, 2)
      ElMessage.success('迁移执行完成')
    } else {
      lastResult.value = JSON.stringify(data, null, 2)
      ElMessage.error('迁移执行失败: ' + (data.msg || '未知错误'))
    }
    await loadList()
  } catch (e: any) {
    lastResult.value = '执行出错: ' + (e.message || e)
    ElMessage.error('执行出错: ' + (e.message || e))
  }
}

onMounted(() => {
  loadList()
})
</script>
