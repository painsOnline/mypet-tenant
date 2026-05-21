<template>
  <div class="admin-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统管理员</span>
          <el-button type="primary" @click="handleAdd">添加管理员</el-button>
        </div>
      </template>
      <el-table :data="admins" v-loading="loading" stripe>
        <el-table-column prop="account" label="管理员账号" min-width="200" />
        <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" min-width="200" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleChangePwd(row)">修改密码</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add Admin Dialog -->
    <el-dialog v-model="dialogVisible" title="添加管理员" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="管理员账号" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>

    <!-- Change Password Dialog -->
    <el-dialog v-model="pwdDialogVisible" title="修改管理员密码" width="500px">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="110px">
        <el-form-item label="管理员账号">
          <el-input :model-value="pwdTarget?.account" disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" placeholder="请输入新密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePwdSubmit" :loading="pwdSubmitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdmins, createAdmin, deleteAdmin, changeAdminPassword } from '@/api/index'

const admins = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const form = ref({ account: '', password: '', confirmPassword: '' })

// Change password
const pwdDialogVisible = ref(false)
const pwdSubmitting = ref(false)
const pwdFormRef = ref()
const pwdTarget = ref<any>(null)
const pwdForm = ref({ newPassword: '' })

const validateConfirmPassword = (_rule: any, value: string, callback: any) => {
  if (value !== form.value.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  account: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
}
const pwdRules = {
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
}

async function loadData() {
  loading.value = true
  try {
    admins.value = (await getAdmins()) as any[]
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  form.value = { account: '', password: '', confirmPassword: '' }
  dialogVisible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    await createAdmin(form.value)
    ElMessage.success('添加成功')
    dialogVisible.value = false
    loadData()
  } finally {
    submitting.value = false
  }
}

function handleChangePwd(row: any) {
  pwdTarget.value = row
  pwdForm.value = { newPassword: '' }
  pwdDialogVisible.value = true
}

async function handlePwdSubmit() {
  const valid = await pwdFormRef.value.validate().catch(() => false)
  if (!valid) return
  pwdSubmitting.value = true
  try {
    await changeAdminPassword(pwdTarget.value.id, pwdForm.value.newPassword)
    ElMessage.success('密码修改成功')
    pwdDialogVisible.value = false
  } finally {
    pwdSubmitting.value = false
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定要删除管理员 "${row.account}" 吗？`, '确认删除', { type: 'warning' })
    await deleteAdmin(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch { /* cancelled */ }
}

onMounted(() => { loadData() })
</script>

<style scoped lang="scss">
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
