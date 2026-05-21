<template>
  <div class="financial-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>理财管理</span>
          <el-button v-if="activeTab === 'products'" type="primary" @click="openDialog()">
            新增项目
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="mb-4" @tab-change="onTabChange">
        <el-tab-pane label="理财项目" name="products" />
        <el-tab-pane label="用户持仓" name="holdings" />
      </el-tabs>

      <el-table v-if="activeTab === 'products'" :data="tableData" v-loading="loading" stripe>
        <el-table-column label="项目名称" min-width="160">
          <template #default="{ row }">
            <div class="font-medium">{{ row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="年化利率" width="100">
          <template #default="{ row }">
            {{ formatRate(row.annualRate) }}
          </template>
        </el-table-column>
        <el-table-column label="周期" width="80">
          <template #default="{ row }">{{ row.cycle }}{{ row.cycleUnit || '天' }}</template>
        </el-table-column>
        <el-table-column label="申购范围" width="150">
          <template #default="{ row }">
            {{ Number(row.minAmount).toLocaleString() }} ~
            {{ Number(row.maxAmount).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-button
              link
              :type="row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="toggleStatus(row)"
            >
              {{ row.status === 1 ? '停售' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <template v-else>
        <el-form :inline="true" class="mb-4">
          <el-form-item label="用户ID">
            <el-input
              v-model="holdingSearch.userId"
              clearable
              placeholder="UUID"
              @keyup.enter="loadHoldings"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loadHoldings">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="holdingData" v-loading="holdingLoading" stripe>
          <el-table-column label="用户" prop="userPhone" min-width="120" show-overflow-tooltip />
          <el-table-column label="项目" prop="productName" min-width="140" />
          <el-table-column label="金额" width="110">
            <template #default="{ row }">¥{{ Number(row.amount).toLocaleString() }}</template>
          </el-table-column>
          <el-table-column label="预期收益" width="100">
            <template #default="{ row }">
              {{ row.expectedEarning != null ? `¥${row.expectedEarning}` : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag size="small">{{ row.statusName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="开始" prop="startDate" width="110" />
          <el-table-column label="结束" prop="endDate" width="110" />
        </el-table>
        <div class="mt-4 flex justify-end">
          <el-pagination
            v-model:current-page="holdingSearch.page"
            v-model:page-size="holdingSearch.limit"
            :total="holdingTotal"
            layout="total, prev, pager, next"
            @change="loadHoldings"
          />
        </div>
      </template>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="520px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="formData.type" placeholder="如：量化交易" />
        </el-form-item>
        <el-form-item label="年化利率" prop="annualRate">
          <el-input v-model="formData.annualRate" placeholder="如 0.12 表示 12%" />
        </el-form-item>
        <el-form-item label="周期（天）" prop="cycleDays">
          <el-input-number v-model="formData.cycleDays" :min="1" class="w-full" />
        </el-form-item>
        <el-form-item label="最低申购" prop="minAmount">
          <el-input v-model="formData.minAmount" />
        </el-form-item>
        <el-form-item label="募集总额" prop="totalAmount">
          <el-input v-model="formData.totalAmount" />
        </el-form-item>
        <el-form-item label="提前赎回费率">
          <el-input v-model="formData.earlyRedeemFee" placeholder="如 0.01" />
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
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import {
    fetchFinancialProductList,
    fetchCreateFinancialProduct,
    fetchUpdateFinancialProduct,
    fetchHoldingList,
    type FinancialProductItem,
    type HoldingItem
  } from '@/api/modules/admin/financial'

  const activeTab = ref<'products' | 'holdings'>('products')
  const loading = ref(false)
  const tableData = ref<FinancialProductItem[]>([])
  const holdingLoading = ref(false)
  const holdingData = ref<HoldingItem[]>([])
  const holdingTotal = ref(0)
  const holdingSearch = reactive({ userId: '', page: 1, limit: 20 })
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const editingId = ref<string | null>(null)
  const formRef = ref<FormInstance>()

  const formData = reactive({
    name: '',
    type: '量化交易',
    annualRate: '0.12',
    cycleDays: 30,
    minAmount: '1000',
    totalAmount: '1000000',
    earlyRedeemFee: '0.01'
  })

  const formRules: FormRules = {
    name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
    annualRate: [{ required: true, message: '请输入年化利率', trigger: 'blur' }],
    cycleDays: [{ required: true, message: '请输入周期', trigger: 'blur' }],
    minAmount: [{ required: true, message: '请输入最低申购', trigger: 'blur' }],
    totalAmount: [{ required: true, message: '请输入募集总额', trigger: 'blur' }]
  }

  const dialogTitle = computed(() => (editingId.value ? '编辑理财项目' : '新增理财项目'))

  function formatRate(rate: string | number) {
    const n = Number(rate)
    if (n <= 1) return `${(n * 100).toFixed(1)}%`
    return `${n}%`
  }

  async function loadData() {
    loading.value = true
    try {
      tableData.value = await fetchFinancialProductList()
    } catch {
      ElMessage.error('加载失败')
    } finally {
      loading.value = false
    }
  }

  function openDialog(row?: FinancialProductItem) {
    if (row) {
      editingId.value = row.id
      formData.name = row.name
      formData.type = '量化交易'
      formData.annualRate = String(row.annualRate)
      formData.cycleDays = row.cycle
      formData.minAmount = String(row.minAmount)
      formData.totalAmount = String(row.maxAmount)
      formData.earlyRedeemFee = '0.01'
    } else {
      editingId.value = null
      formData.name = ''
      formData.type = '量化交易'
      formData.annualRate = '0.12'
      formData.cycleDays = 30
      formData.minAmount = '1000'
      formData.totalAmount = '1000000'
      formData.earlyRedeemFee = '0.01'
    }
    dialogVisible.value = true
  }

  async function submitForm() {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    const payload = {
      name: formData.name,
      type: formData.type,
      annualRate: Number(formData.annualRate),
      cycleDays: formData.cycleDays,
      minAmount: formData.minAmount,
      totalAmount: formData.totalAmount,
      earlyRedeemFee: Number(formData.earlyRedeemFee) || 0,
      status: 1
    }

    submitting.value = true
    try {
      if (editingId.value) {
        await fetchUpdateFinancialProduct(editingId.value, payload)
        ElMessage.success('更新成功')
      } else {
        await fetchCreateFinancialProduct(payload)
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

  async function toggleStatus(row: FinancialProductItem) {
    const newStatus = row.status === 1 ? 3 : 1
    const action = newStatus === 1 ? '上架' : '停售'
    try {
      await ElMessageBox.confirm(`确定${action}「${row.name}」吗？`, '提示', { type: 'warning' })
      await fetchUpdateFinancialProduct(row.id, { status: newStatus })
      ElMessage.success(`${action}成功`)
      loadData()
    } catch (e) {
      if (e !== 'cancel') ElMessage.error('操作失败')
    }
  }

  async function loadHoldings() {
    holdingLoading.value = true
    try {
      const res = await fetchHoldingList({
        userId: holdingSearch.userId || undefined,
        page: holdingSearch.page,
        limit: holdingSearch.limit
      })
      holdingData.value = res.list
      holdingTotal.value = res.total
    } catch {
      ElMessage.error('加载持仓失败')
    } finally {
      holdingLoading.value = false
    }
  }

  function onTabChange(name: string | number) {
    if (name === 'holdings' && holdingData.value.length === 0) {
      loadHoldings()
    }
  }

  onMounted(() => {
    loadData()
  })
</script>
