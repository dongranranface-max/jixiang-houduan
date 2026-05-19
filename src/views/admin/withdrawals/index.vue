<template>
  <div class="withdrawal-container p-6">
    <el-card>
      <template #header>
        <span>提现管理</span>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="用户" prop="userPhone" width="120" />
        <el-table-column label="持卡人" prop="realName" width="100" />
        <el-table-column label="银行" prop="bankName" width="120" />
        <el-table-column label="卡号" prop="bankCard" width="180" />
        <el-table-column label="提现金额" prop="amount" width="120">
          <template #default="{ row }">
            <span class="text-red-500 font-bold">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
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
            <span v-else class="text-gray-400">{{ row.adminRemark || '-' }}</span>
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

    <el-dialog v-model="rejectDialogVisible" title="拒绝提现" width="400px">
      <el-form :model="rejectForm" label-width="80px">
        <el-form-item label="拒绝原因">
          <el-input v-model="rejectForm.reason" type="textarea" :rows="3" placeholder="请输入拒绝原因" />
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
import { fetchWithdrawalList, fetchApproveWithdrawal, fetchRejectWithdrawal } from '@/api/modules/admin/withdrawal'
import type { WithdrawalItem } from '@/api/modules/admin/withdrawal'

const loading = ref(false)
const tableData = ref<WithdrawalItem[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const rejectDialogVisible = ref(false)
const currentItem = ref<WithdrawalItem>()
const rejectForm = reactive({ reason: '' })

async function loadData() {
  loading.value = true
  try {
    const res = await fetchWithdrawalList({ page: page.value, limit: limit.value })
    tableData.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

async function approve(row: WithdrawalItem) {
  try {
    await ElMessageBox.confirm(`确定通过该提现申请？`, '提示')
    await fetchApproveWithdrawal(row.id)
    ElMessage.success('已通过')
    loadData()
  } catch {}
}

function openReject(row: WithdrawalItem) {
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
    await fetchRejectWithdrawal(currentItem.value!.id, rejectForm.reason)
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
