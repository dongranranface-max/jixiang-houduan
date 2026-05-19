<template>
  <div class="referral-container p-6">
    <el-card>
      <template #header>
        <span>推荐管理</span>
      </template>

      <el-tabs>
        <el-tab-pane label="推荐关系">
          <el-table :data="tableData" v-loading="loading" stripe>
            <el-table-column label="推荐人" prop="referrerPhone" width="130" />
            <el-table-column label="被推荐人" prop="inviteePhone" width="130" />
            <el-table-column label="被推荐人等级" width="120">
              <template #default="{ row }">
                <el-tag>V{{ row.inviteeLevel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="推荐时间" prop="createdAt" width="160" />
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
        </el-tab-pane>

        <el-tab-pane label="推荐统计">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.totalReferrals }}</div>
                <div class="stat-label">总推荐人数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.activeReferrals }}</div>
                <div class="stat-label">活跃推荐人</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.totalBonus }}</div>
                <div class="stat-label">累计发放积分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.todayBonus }}</div>
                <div class="stat-label">今日发放积分</div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const limit = ref(20)
const stats = reactive({
  totalReferrals: 0,
  activeReferrals: 0,
  totalBonus: 0,
  todayBonus: 0
})

async function loadData() {
  loading.value = true
  try {
    // TODO: 调用后端推荐关系列表 API
    // const res = await fetchReferralList({ page: page.value, limit: limit.value })
    tableData.value = []
    total.value = 0
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.stat-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}
.stat-value { font-size: 28px; font-weight: 700; color: #333; }
.stat-label { font-size: 14px; color: #666; margin-top: 8px; }
</style>
