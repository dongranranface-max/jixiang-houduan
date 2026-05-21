<template>
  <div class="ticket-list-container p-6">
    <el-card>
      <template #header>
        <span>工单管理</span>
      </template>

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
            <el-option label="其他" :value="8" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="工单号" prop="ticketNo" width="180" />
        <el-table-column label="用户" prop="userPhone" width="120" />
        <el-table-column label="类型" prop="typeName" width="100" />
        <el-table-column label="标题" prop="title" min-width="160" />
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

    <el-dialog v-model="detailVisible" title="工单处理" width="600px" destroy-on-close>
      <template v-if="detail">
        <el-descriptions :column="1" border class="mb-4">
          <el-descriptions-item label="工单号">{{ detail.ticketNo }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ detail.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ detail.typeName }}</el-descriptions-item>
          <el-descriptions-item label="标题">{{ detail.title }}</el-descriptions-item>
          <el-descriptions-item label="问题描述">{{ detail.content }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detail.statusName }}</el-descriptions-item>
        </el-descriptions>

        <el-input
          v-model="replyContent"
          type="textarea"
          :rows="4"
          placeholder="输入回复内容"
          class="mb-3"
        />
        <div class="flex gap-2">
          <el-button type="primary" :loading="replying" @click="submitReply">回复</el-button>
          <el-button type="success" @click="markResolve">标记已解决</el-button>
          <el-button @click="markClose">关闭工单</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import {
    fetchTicketList,
    fetchTicketDetail,
    fetchReplyTicket,
    fetchResolveTicket,
    fetchCloseTicket,
    type TicketItem,
    type TicketDetail
  } from '@/api/modules/admin/ticket'

  const loading = ref(false)
  const replying = ref(false)
  const tableData = ref<TicketItem[]>([])
  const total = ref(0)
  const detailVisible = ref(false)
  const detail = ref<TicketDetail | null>(null)
  const replyContent = ref('')

  const searchParams = reactive({
    status: undefined as number | undefined,
    type: undefined as number | undefined,
    page: 1,
    limit: 20
  })

  function getStatusType(status: number): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
    const map: Record<number, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      1: 'danger',
      2: 'warning',
      3: 'primary',
      4: 'success'
    }
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

  async function openDetail(row: TicketItem) {
    try {
      detail.value = await fetchTicketDetail(row.ticketId)
      replyContent.value = ''
      detailVisible.value = true
    } catch {
      ElMessage.error('加载工单详情失败')
    }
  }

  async function submitReply() {
    if (!detail.value || !replyContent.value.trim()) {
      ElMessage.warning('请输入回复内容')
      return
    }
    replying.value = true
    try {
      await fetchReplyTicket(detail.value.ticketId, { content: replyContent.value })
      ElMessage.success('回复成功')
      detail.value = await fetchTicketDetail(detail.value.ticketId)
      replyContent.value = ''
      loadData()
    } catch {
      ElMessage.error('回复失败')
    } finally {
      replying.value = false
    }
  }

  async function markResolve() {
    if (!detail.value) return
    try {
      await fetchResolveTicket(detail.value.ticketId)
      ElMessage.success('已标记解决')
      detailVisible.value = false
      loadData()
    } catch {
      ElMessage.error('操作失败')
    }
  }

  async function markClose() {
    if (!detail.value) return
    try {
      await fetchCloseTicket(detail.value.ticketId)
      ElMessage.success('已关闭')
      detailVisible.value = false
      loadData()
    } catch {
      ElMessage.error('操作失败')
    }
  }

  onMounted(() => {
    loadData()
  })
</script>
