<template>
  <div class="financial-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>理财项目管理</span>
          <el-button type="primary" @click="openDialog()">新增项目</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="项目名称" min-width="160">
          <template #default="{ row }">
            <div class="font-medium">{{ row.name }}</div>
            <div class="text-xs text-gray-400">{{ row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column label="利率类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.rateType === 1 ? 'danger' : row.rateType === 2 ? 'warning' : 'info'">
              {{ row.rateTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="展示利率" prop="displayRate" width="100" />
        <el-table-column label="年化利率" width="100">
          <template #default="{ row }">{{ (parseFloat(row.annualRate) * 100).toFixed(1) }}%</template>
        </el-table-column>
        <el-table-column label="周期" width="80">
          <template #default="{ row }">{{ row.cycle }}{{ row.cycleUnit }}</template>
        </el-table-column>
        <el-table-column label="申购范围" width="150">
          <template #default="{ row }">
            {{ Number(row.minAmount).toLocaleString() }} ~ {{ Number(row.maxAmount).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="提前赎回费" prop="earlyRedeemFee" width="100" />
        <el-table-column label="已投金额" prop="totalInvested" width="140">
          <template #default="{ row }">{{ Number(row.totalInvested).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="风险" width="80">
          <template #default="{ row }">
            <el-tag :type="row.riskLevel === 1 ? 'success' : row.riskLevel === 2 ? 'warning' : 'danger'" size="small">
              {{ row.riskName }}
            </el-tag>
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
            <el-button link :type="row.status === 1 ? 'danger' : 'success'" size="small" @click="toggleStatus(row)">
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  fetchFinancialProductList,
  fetchDeleteFinancialProduct
} from '@/api/modules/admin/financial'
import type { FinancialProductItem } from '@/api/modules/admin/financial'

const loading = ref(false)
const tableData = ref<FinancialProductItem[]>([])

async function loadData() {
  loading.value = true
  try {
    const res = await fetchFinancialProductList()
    tableData.value = res
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

function openDialog(row?: FinancialProductItem) {
  ElMessage.info(row ? '编辑功能开发中' : '新增功能开发中')
}

async function toggleStatus(row: FinancialProductItem) {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await fetchDeleteFinancialProduct(row.id)
    ElMessage.success(newStatus === 1 ? '上架成功' : '下架成功')
    loadData()
  } catch {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadData()
})
</script>
