<template>
  <div class="tenant-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>租户详情</span>
          <el-button @click="$router.push('/tenant')">返回列表</el-button>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" v-loading="loading">
        <el-form-item label="租户Code">
          <el-input v-model="form.code" disabled />
        </el-form-item>
        <el-form-item label="租户名称" prop="name">
          <el-input v-model="form.name" placeholder="如 鑫钱猫惠州分店" />
        </el-form-item>
        <el-form-item label="数据库实例">
          <el-select v-model="form.databaseInstanceId" disabled style="width:100%">
            <el-option v-for="db in dbInstances" :key="db.id" :label="`${db.host}:${db.port}`" :value="db.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开业状态">
          <el-switch v-model="form.isDisable" :active-value="0" :inactive-value="1"
            active-text="开业" inactive-text="未开业" />
        </el-form-item>
        <el-form-item label="免运费金额">
          <el-input-number v-model="form.freeShippingAmount" :min="0" :precision="2" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
          <el-button @click="$router.push('/tenant')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTenantDetail, updateTenant, getDatabaseInstances } from '@/api/index'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const formRef = ref()
const dbInstances = ref<any[]>([])
const form = ref({
  code: '',
  name: '',
  databaseInstanceId: '',
  isDisable: 0,
  freeShippingAmount: 20,
})

const rules = {
  name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
}

async function loadData() {
  loading.value = true
  try {
    const id = route.params.id as string
    const [tenant, instances] = await Promise.all([
      getTenantDetail(id),
      getDatabaseInstances()
    ])
    dbInstances.value = instances as any[]
    const t = tenant as any
    form.value = {
      code: t.code,
      name: t.name,
      databaseInstanceId: t.databaseInstanceId,
      isDisable: t.isDisable,
      freeShippingAmount: t.freeShippingAmount,
    }
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const id = route.params.id as string
    await updateTenant(id, form.value)
    ElMessage.success('保存成功')
    router.push('/tenant')
  } finally {
    submitting.value = false
  }
}

onMounted(() => { loadData() })
</script>

<style scoped lang="scss">
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
