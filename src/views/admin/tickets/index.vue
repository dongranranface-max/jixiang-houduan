<template>
  <div class="ticket-list-container p-6">
    <el-card>
      <template #header>
        <span>工单管理</span>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" class="mb-4">
        <el-form-item label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable @change="loadData">
            <el-option label="待处理" :value="1" />
            <el-option label="处理中" :value="2" />
            <el-option label="待确认" :value="3" />
            <el-option label="已完成" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchParams.type" placeholder="全部" clearable @change="loadData">
            <el-option label="订单问题" :value="1" />
            <el-option label="物流咨询" :value="2" />
            <el-option label="积分问题" :value="3" />
            <el-option label="理财问题" :value="4" />
            <el-option label="商品售后" :value="5" />
            <el-option label="功能建议" :value="6" />
            <el-option label="投诉建议" :value="7" />
            <el-option label="其他" :value="8" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="工单号" prop="ticketNo" width="180" />
        <el-table-column label="用户" prop="userPhone" width="120" />
        <el-table-column label="类型" prop="typeName" width="100" />
        <el-table-column label="标题" prop="title" min-width="160" />
        <el-table-column label="最新消息" prop="lastMessage" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提交时间" prop="createdAt" width="160" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDetail(row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="searchParams.page"
          v-model:page-size="searchParams.limit"
          :total="total"
          layout="total, prev, pager, next"
          @change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchTicketList } from '@/api/modules/admin/ticket'
import type { TicketItem } from '@/api/modules/admin/ticket'

const loading = ref(false)
const tableData = ref<TicketItem[]>([])
const total = ref(0)
const searchParams = reactive({
  status: undefined as number | undefined,
  type: undefined as number | undefined,
  page: 1,
  limit: 20
})

function getStatusType(status: number): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<number, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = { 1: 'danger', 2: 'warning', 3: 'primary', 4: 'success' }
  return map[status] || 'info'
}

async function loadData() {
  loading.value = true
  try {
    const res = await fetchTicketList(searchParams)
    tableData.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

function openDetail(row: TicketItem) {
  ElMessage.info(`处理工单 ${row.ticketNo}`)
}

onMounted(() => {
  loadData()
})
</script>
