<template>
  <div class="coupon-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>优惠券管理</span>
          <el-button type="primary" @click="openDialog()">新增优惠券</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="名称" prop="name" min-width="140" />
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.typeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="面额/折扣" prop="amount" width="100" />
        <el-table-column label="门槛" prop="minAmount" width="100" />
        <el-table-column label="库存" width="120">
          <template #default="{ row }">{{ row.remainStock }} / {{ row.totalStock }}</template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-popconfirm title="确定删除？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="formData.type" class="w-full">
            <el-option label="满减券" :value="1" />
            <el-option label="折扣券" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="面额" prop="amount">
          <el-input v-model="formData.amount" />
        </el-form-item>
        <el-form-item label="最低消费" prop="minAmount">
          <el-input v-model="formData.minAmount" />
        </el-form-item>
        <el-form-item label="发放总量" prop="totalStock">
          <el-input-number v-model="formData.totalStock" :min="1" class="w-full" />
        </el-form-item>
        <el-form-item label="有效天数" prop="validDays">
          <el-input-number v-model="formData.validDays" :min="1" class="w-full" />
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
    fetchCouponList,
    fetchCreateCoupon,
    fetchUpdateCoupon,
    fetchDeleteCoupon,
    type CouponItem,
    type CouponParams
  } from '@/api/modules/admin/coupon'

  const loading = ref(false)
  const tableData = ref<CouponItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const editingId = ref<string | null>(null)
  const formRef = ref<FormInstance>()

  const formData = reactive<CouponParams>({
    name: '',
    type: 1,
    amount: '',
    minAmount: '0',
    totalStock: 100,
    validDays: 30
  })

  const formRules: FormRules = {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    amount: [{ required: true, message: '请输入面额', trigger: 'blur' }],
    totalStock: [{ required: true, message: '请输入总量', trigger: 'blur' }]
  }

  const dialogTitle = computed(() => (editingId.value ? '编辑优惠券' : '新增优惠券'))

  async function loadData() {
    loading.value = true
    try {
      const res = await fetchCouponList({ page: page.value, limit: limit.value })
      tableData.value = res.list
      total.value = res.total
    } catch {
      ElMessage.error('加载失败')
    } finally {
      loading.value = false
    }
  }

  function openDialog(row?: CouponItem) {
    if (row) {
      editingId.value = row.id
      formData.name = row.name
      formData.type = row.type
      formData.amount = String(row.amount)
      formData.minAmount = String(row.minAmount)
      formData.totalStock = row.totalStock
      formData.validDays = row.validDays || 30
    } else {
      editingId.value = null
      formData.name = ''
      formData.type = 1
      formData.amount = ''
      formData.minAmount = '0'
      formData.totalStock = 100
      formData.validDays = 30
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
        await fetchUpdateCoupon(editingId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await fetchCreateCoupon(formData)
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

  async function handleDelete(id: string) {
    try {
      await fetchDeleteCoupon(id)
      ElMessage.success('删除成功')
      loadData()
    } catch {
      ElMessage.error('删除失败')
    }
  }

  onMounted(() => {
    loadData()
  })
</script>
