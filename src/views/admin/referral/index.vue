<template>
  <div class="referral-container p-6">
    <el-card>
      <template #header>
        <span>推荐管理</span>
      </template>

      <el-tabs v-model="activeTab" @tab-change="onTabChange">
        <el-tab-pane label="推荐关系" name="list">
          <el-form :inline="true" class="mb-4">
            <el-form-item label="关键词">
              <el-input
                v-model="keyword"
                placeholder="手机号 / 昵称"
                clearable
                @keyup.enter="loadList"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loadList">查询</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="tableData" v-loading="loading" stripe>
            <el-table-column label="推荐人手机" prop="referrerPhone" width="130" />
            <el-table-column label="推荐人昵称" prop="parentNickname" width="120" />
            <el-table-column label="被推荐人手机" prop="inviteePhone" width="130" />
            <el-table-column label="被推荐人昵称" prop="nickname" width="120" />
            <el-table-column label="等级" width="80">
              <template #default="{ row }">
                <el-tag>V{{ row.inviteeLevel }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="直推人数" prop="directCount" width="90" />
            <el-table-column label="团队人数" prop="teamCount" width="90" />
            <el-table-column label="团队业绩" width="120">
              <template #default="{ row }">
                {{ Number(row.teamPerformance).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column label="注册时间" prop="createdAt" width="170" />
          </el-table>

          <div class="mt-4 flex justify-end">
            <el-pagination
              v-model:current-page="page"
              v-model:page-size="limit"
              :total="total"
              layout="total, prev, pager, next"
              @change="loadList"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="推荐统计" name="stats">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.totalReferrals }}</div>
                <div class="stat-label">有推荐人的用户总数</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.activeReferrals }}</div>
                <div class="stat-label">活跃推荐人数量</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.totalBonus }}</div>
                <div class="stat-label">累计推荐积分（待对接）</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-card">
                <div class="stat-value">{{ stats.todayBonus }}</div>
                <div class="stat-label">今日推荐积分（待对接）</div>
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
  import {
    fetchReferralList,
    fetchReferralSummary,
    type ReferralRelationItem
  } from '@/api/modules/admin/referral'

  const activeTab = ref('list')
  const loading = ref(false)
  const tableData = ref<ReferralRelationItem[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = ref(20)
  const keyword = ref('')

  const stats = reactive({
    totalReferrals: 0,
    activeReferrals: 0,
    totalBonus: 0,
    todayBonus: 0
  })

  async function loadList() {
    loading.value = true
    try {
      const res = await fetchReferralList({
        keyword: keyword.value || undefined,
        page: page.value,
        limit: limit.value
      })
      tableData.value = res.list
      total.value = res.total
    } catch {
      ElMessage.error('加载推荐关系失败')
    } finally {
      loading.value = false
    }
  }

  async function loadSummary() {
    try {
      const res = await fetchReferralSummary()
      Object.assign(stats, res)
    } catch {
      ElMessage.error('加载推荐统计失败')
    }
  }

  function onTabChange(name: string | number) {
    if (name === 'stats') loadSummary()
  }

  onMounted(() => {
    loadList()
  })
</script>

<style scoped>
  .stat-card {
    padding: 20px;
    text-align: center;
    background: #f5f7fa;
    border-radius: 8px;
  }

  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #333;
  }

  .stat-label {
    margin-top: 8px;
    font-size: 14px;
    color: #666;
  }
</style>
