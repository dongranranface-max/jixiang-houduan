<template>
  <div class="refund-container p-6">
    <el-card>
      <template #header>
        <span>退款管理</span>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" class="mb-4">
        <el-form-item label="订单号">
          <el-input v-model="searchParams.orderNo" placeholder="订单号" clearable @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option label="退款中" :value="1" />
            <el-option label="已退款" :value="2" />
            <el-option label="拒绝退款" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="订单号" prop="orderNo" width="180" />
        <el-table-column label="用户" prop="userPhone" width="120" />
        <el-table-column label="订单类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.orderTypeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="退款金额" width="100">
          <template #default="{ row }">
            <span class="text-red-500">¥{{ row.refundAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退款积分" width="100">
          <template #default="{ row }">{{ row.refundPoints || '-' }}</template>
        </el-table-column>
        <el-table-column label="原因" prop="reasonName" width="100" />
        <el-table-column label="说明" prop="description" min-width="160" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'warning' : row.status === 2 ? 'success' : 'danger'" size="small">
              {{ row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="createdAt" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status === 1">
              <el-button link type="success" size="small" @click="approve(row)">通过</el-button>
              <el-button link type="danger" size="small" @click="openReject(row)">拒绝</el-button>
            </template>
            <span v-else class="text-gray-400">{{ row.adminReply || '-' }}</span>
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

    <!-- 拒绝对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝退款" width="400px">
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="拒绝原因">
          <el-input v-model="rejectForm.reason" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchRefundList, fetchApproveRefund, fetchRejectRefund } from '@/api/modules/admin/refund'
import type { RefundItem } from '@/api/modules/admin/refund'

const loading = ref(false)
const tableData = ref<RefundItem[]>([])
const total = ref(0)
const searchParams = reactive({
  orderNo: '',
  status: undefined as number | undefined,
  page: 1,
  limit: 20
})
const rejectDialogVisible = ref(false)
const currentItem = ref<RefundItem>()
const rejectForm = reactive({ reason: '' })

async function loadData() {
  loading.value = true
  try {
    const res = await fetchRefundList(searchParams)
    tableData.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  searchParams.orderNo = ''
  searchParams.status = undefined
  searchParams.page = 1
  loadData()
}

async function approve(row: RefundItem) {
  try {
    await ElMessageBox.confirm('确定通过该退款申请？', '提示')
    await fetchApproveRefund(row.orderNo)
    ElMessage.success('已通过')
    loadData()
  } catch {}
}

function openReject(row: RefundItem) {
  currentItem.value = row
  rejectForm.reason = ''
  rejectDialogVisible.value = true
}

async function confirmReject() {
  if (!rejectForm.reason) {
    ElMessage.warning('请填写拒绝原因')
    return
  }
  try {
    await fetchRejectRefund(currentItem.value!.orderNo, rejectForm.reason)
    ElMessage.success('已拒绝')
    rejectDialogVisible.value = false
    loadData()
  } catch {
    ElMessage.error('操作失败')
  }
}

onMounted(() => {
  loadData()
})
</script>
