<template>
  <div class="user-list-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>用户管理</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" class="mb-4">
        <el-form-item label="关键词">
          <el-input v-model="searchParams.keyword" placeholder="手机号/昵称" clearable @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item label="等级">
          <el-select v-model="searchParams.level" placeholder="全部" clearable>
            <el-option v-for="i in 9" :key="i" :label="`V${i}`" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="冻结" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="用户ID" prop="userId" width="120" />
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="昵称" prop="nickname" width="120" />
        <el-table-column label="等级" width="80">
          <template #default="{ row }">
            <el-tag>V{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="团队业绩" prop="teamPerformance" width="120">
          <template #default="{ row }">{{ Number(row.teamPerformance).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="生态积分" prop="ecoPoints" width="120" />
        <el-table-column label="消费积分" prop="consumerPoints" width="120" />
        <el-table-column label="银行卡" width="150">
          <template #default="{ row }">
            <span v-if="row.bankName">{{ row.bankName }} {{ row.bankCard }}</span>
            <span v-else class="text-gray-400">未绑定</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '冻结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="createdAt" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="toggleStatus(row)">
              {{ row.status === 1 ? '冻结' : '解冻' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="searchParams.page"
          v-model:page-size="searchParams.limit"
          :total="total"
          :page-sizes="[20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @change="loadData"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { fetchUserList, fetchUpdateUserStatus } from '@/api/modules/admin/user'
import type { UserItem, UserSearchParams } from '@/api/modules/admin/user'

const loading = ref(false)
const tableData = ref<UserItem[]>([])
const total = ref(0)
const searchParams = reactive<UserSearchParams>({
  keyword: '',
  level: undefined,
  status: undefined,
  page: 1,
  limit: 20
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchUserList(searchParams)
    tableData.value = res.list
    total.value = res.total
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  searchParams.keyword = ''
  searchParams.level = undefined
  searchParams.status = undefined
  searchParams.page = 1
  loadData()
}

async function toggleStatus(row: UserItem) {
  const newStatus = row.status === 1 ? 2 : 1
  const action = newStatus === 1 ? '解冻' : '冻结'
  try {
    await ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示')
    await fetchUpdateUserStatus(row.userId, newStatus)
    ElMessage.success(`${action}成功`)
    loadData()
  } catch {
    // cancel
  }
}

onMounted(() => {
  loadData()
})
</script>
