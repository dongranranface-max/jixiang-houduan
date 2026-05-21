<template>
  <div class="admin-accounts p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>管理员与角色</span>
          <el-button type="primary" @click="openDialog()">新增管理员</el-button>
        </div>
      </template>

      <el-alert
        class="mb-4"
        type="info"
        :closable="false"
        title="角色说明"
        description="超级管理员：全部权限含本页；运营管理员：商城/用户/订单/营销；商户管理员：仅本商户商品与订单。"
      />

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="用户名" prop="username" width="140" />
        <el-table-column label="昵称" prop="nickname" width="120" />
        <el-table-column label="角色" width="130">
          <template #default="{ row }">
            <el-tag>{{ row.roleName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最近登录" prop="lastLoginAt" width="170" />
        <el-table-column label="创建时间" prop="createdAt" width="170" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="limit"
          :total="total"
          layout="total, prev, pager, next"
          @change="loadData"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="480px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" :disabled="!!editingId" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" class="w-full">
            <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value">
              <span>{{ r.label }}</span>
              <span class="text-xs text-gray-400 ml-2">{{ r.desc }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.role === 'merchant'" label="商户ID">
          <el-input v-model="formData.merchantId" placeholder="绑定商户 UUID" />
        </el-form-item>
        <el-form-item
          :label="editingId ? '新密码' : '密码'"
          :prop="editingId ? undefined : 'password'"
        >
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            :placeholder="editingId ? '留空不修改' : ''"
          />
        </el-form-item>
        <el-form-item v-if="editingId" label="状态">
          <el-select v-model="formData.status" class="w-full">
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import {
    fetchAdminAccountList,
    fetchRoleOptions,
    fetchCreateAdminAccount,
    fetchUpdateAdminAccount,
    type AdminAccountItem,
    type RoleOption
  } from '@/api/modules/admin/admin-user'

  const loading = ref(false)
  const tableData = ref<AdminAccountItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const roleOptions = ref<RoleOption[]>([])
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const editingId = ref<string | null>(null)
  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: '',
    nickname: '',
    role: 'operator',
    password: '',
    merchantId: '',
    status: 1
  })

  const formRules: FormRules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
  }

  const dialogTitle = computed(() => (editingId.value ? '编辑管理员' : '新增管理员'))

  async function loadData() {
    loading.value = true
    try {
      const res = await fetchAdminAccountList({ page: page.value, limit: limit.value })
      tableData.value = res.list
      total.value = res.total
    } catch {
      ElMessage.error('加载失败或无权限')
    } finally {
      loading.value = false
    }
  }

  async function loadRoles() {
    try {
      roleOptions.value = await fetchRoleOptions()
    } catch {
      roleOptions.value = [
        { value: 'super', label: '超级管理员', desc: '' },
        { value: 'operator', label: '运营管理员', desc: '' },
        { value: 'merchant', label: '商户管理员', desc: '' }
      ]
    }
  }

  function openDialog(row?: AdminAccountItem) {
    if (row) {
      editingId.value = row.id
      formData.username = row.username
      formData.nickname = row.nickname
      formData.role = row.role
      formData.merchantId = row.merchantId || ''
      formData.status = row.status
      formData.password = ''
    } else {
      editingId.value = null
      formData.username = ''
      formData.nickname = ''
      formData.role = 'operator'
      formData.merchantId = ''
      formData.status = 1
      formData.password = ''
    }
    dialogVisible.value = true
  }

  async function submitForm() {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return
    submitting.value = true
    try {
      if (editingId.value) {
        await fetchUpdateAdminAccount(editingId.value, {
          nickname: formData.nickname,
          role: formData.role,
          status: formData.status,
          merchantId: formData.merchantId || undefined,
          password: formData.password || undefined
        })
        ElMessage.success('更新成功')
      } else {
        await fetchCreateAdminAccount({
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname,
          role: formData.role,
          merchantId: formData.merchantId || undefined
        })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } catch {
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  }

  onMounted(() => {
    loadRoles()
    loadData()
  })
</script>
