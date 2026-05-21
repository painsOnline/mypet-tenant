<template>
  <div class="tenant-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>租户管理</span>
          <el-button type="primary" @click="handleAdd">添加租户</el-button>
        </div>
      </template>
      <el-table :data="tenants" v-loading="loading" stripe>
        <el-table-column prop="code" label="租户Code" width="140" />
        <el-table-column prop="name" label="租户名称" min-width="140" />
        <el-table-column prop="databaseInstanceName" label="数据库实例" width="180" />
        <el-table-column label="营业状态" width="90">
          <template #default="{ row }">
            <el-switch :model-value="row.isBussinessOpen === 1" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column label="禁用状态" width="90">
          <template #default="{ row }">
            <el-switch :model-value="row.isDisable === 0" disabled size="small" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑租户' : '添加租户'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="租户Code" prop="code">
          <el-input v-model="form.code" :disabled="isEdit" placeholder="唯一标识，如 xlong" />
        </el-form-item>
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="form.name" placeholder="如 鑫钱猫惠州分店" />
        </el-form-item>
        <el-form-item label="数据库实例" prop="databaseInstanceId">
          <el-select v-model="form.databaseInstanceId" :disabled="isEdit" placeholder="请选择" style="width:100%">
            <el-option v-for="db in dbInstances" :key="db.id" :label="`${db.host}:${db.port}`" :value="db.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="营业状态">
          <el-switch v-model="form.isBussinessOpen" :active-value="1" :inactive-value="0"
            active-text="营业中" inactive-text="暂停营业" />
        </el-form-item>
        <el-form-item label="禁用状态">
          <el-switch v-model="form.isDisable" :active-value="1" :inactive-value="0"
            active-text="已禁用" inactive-text="正常" />
        </el-form-item>
        <el-form-item label="免运费金额">
          <el-input-number v-model="form.freeShippingAmount" :min="0" :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTenants, createTenant, updateTenant, deleteTenant, getDatabaseInstances } from '@/api/index'

const tenants = ref<any[]>([])
const dbInstances = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref('')
const submitting = ref(false)
const formRef = ref()
const form = ref({
  code: '',
  name: '',
  databaseInstanceId: '',
  isDisable: 0,
  isBussinessOpen: 0,
  freeShippingAmount: 20,
})

const rules = {
  code: [{ required: true, message: '请输入租户Code', trigger: 'blur' }],
  name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
  databaseInstanceId: [{ required: true, message: '请选择数据库实例', trigger: 'change' }],
}

async function loadData() {
  loading.value = true
  try {
    tenants.value = (await getTenants()) as any[]
  } finally {
    loading.value = false
  }
}

async function loadDbInstances() {
  dbInstances.value = (await getDatabaseInstances()) as any[]
}

function handleAdd() {
  isEdit.value = false
  editId.value = ''
  form.value = { code: '', name: '', databaseInstanceId: '', isDisable: 0, isBussinessOpen: 0, freeShippingAmount: 20 }
  loadDbInstances()
  dialogVisible.value = true
}

function handleEdit(row: any) {
  isEdit.value = true
  editId.value = row.id
  form.value = {
    code: row.code,
    name: row.name,
    databaseInstanceId: row.databaseInstanceId,
    isDisable: row.isDisable,
    isBussinessOpen: row.isBussinessOpen ?? 0,
    freeShippingAmount: row.freeShippingAmount,
  }
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    if (isEdit.value) {
      await updateTenant(editId.value, form.value)
      ElMessage.success('修改成功')
    } else {
      await createTenant(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadData()
  } finally {
    submitting.value = false
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定要删除租户 "${row.name}" 吗？此操作不可恢复。`, '确认删除', { type: 'warning' })
    await deleteTenant(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch { /* cancelled */ }
}

onMounted(() => { loadData() })
</script>

<style scoped lang="scss">
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
