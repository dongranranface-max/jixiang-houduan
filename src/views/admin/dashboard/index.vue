<template>
  <div class="dashboard-container p-6">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-6">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon bg-blue">
            <Icon icon="ep:user" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalUsers.toLocaleString() }}</div>
            <div class="stat-label">总用户数</div>
            <div class="stat-sub">今日 +{{ stats.todayNewUsers }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon bg-green">
            <Icon icon="ep:tickets" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalOrders.toLocaleString() }}</div>
            <div class="stat-label">总订单数</div>
            <div class="stat-sub">今日 +{{ stats.todayOrders }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon bg-purple">
            <Icon icon="ep:money" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatMoney(stats.totalRevenue) }}</div>
            <div class="stat-label">累计收入</div>
            <div class="stat-sub">今日 {{ formatMoney(stats.todayRevenue) }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon bg-orange">
            <Icon icon="ep:wallet" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ formatMoney(stats.totalFinancialInvested) }}</div>
            <div class="stat-label">理财总额</div>
            <div class="stat-sub">今日 {{ formatMoney(stats.todayFinancialInvested) }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 第二行 -->
    <el-row :gutter="20" class="mb-6">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon bg-red">
            <Icon icon="ep:warning" />
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pendingWithdrawals }}</div>
            <div class="stat-label">待处理提现</div>
            <div class="stat-sub">金额 {{ formatMoney(stats.pendingWithdrawalsAmount) }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" class="mb-6">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>快捷操作</span>
          </template>
          <el-space wrap>
            <el-button
              type="primary"
              @click="$router.push({ name: 'AdminMallConsumeProductsOnSale' })"
            >
              <Icon icon="ep:goods" class="mr-1" />消费商城
            </el-button>
            <el-button
              type="warning"
              @click="$router.push({ name: 'AdminMallExchangeProductsOnSale' })"
            >
              <Icon icon="ep:refresh" class="mr-1" />换购商城
            </el-button>
            <el-button
              type="success"
              @click="$router.push({ name: 'AdminMallRedeemProductsOnSale' })"
            >
              <Icon icon="ep:gift" class="mr-1" />兑换商城
            </el-button>
            <el-button @click="$router.push({ name: 'AdminMallConsumeOrders' })">
              <Icon icon="ep:document" class="mr-1" />消费订单
            </el-button>
            <el-button type="warning" @click="$router.push('/admin/financial')">
              <Icon icon="ep:data-line" class="mr-1" />理财管理
            </el-button>
            <el-button type="danger" @click="$router.push('/admin/tickets')">
              <Icon icon="ep:service" class="mr-1" />工单处理
            </el-button>
            <el-button type="info" @click="$router.push('/admin/users')">
              <Icon icon="ep:user" class="mr-1" />用户管理
            </el-button>
            <el-button type="info" @click="$router.push('/admin/config')">
              <Icon icon="ep:setting" class="mr-1" />系统配置
            </el-button>
          </el-space>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { Icon } from '@iconify/vue'
  import { fetchDashboardStats } from '@/api/modules/admin'
  import type { DashboardStats } from '@/api/modules/admin'

  const stats = ref<DashboardStats>({
    totalUsers: 0,
    todayNewUsers: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: '0',
    todayRevenue: '0',
    pendingWithdrawals: 0,
    pendingWithdrawalsAmount: '0',
    totalFinancialInvested: '0',
    todayFinancialInvested: '0'
  })

  function formatMoney(val: string) {
    const num = parseFloat(val)
    if (isNaN(num)) return '¥0.00'
    return '¥' + num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  onMounted(async () => {
    try {
      const res = await fetchDashboardStats()
      stats.value = res
    } catch {
      // ignore
    }
  })
</script>

<style scoped>
  .stat-card {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    font-size: 24px;
    color: #fff;
    border-radius: 12px;
  }

  .bg-blue {
    background: linear-gradient(135deg, #667eea, #764ba2);
  }

  .bg-green {
    background: linear-gradient(135deg, #11998e, #38ef7d);
  }

  .bg-purple {
    background: linear-gradient(135deg, #eb3349, #f45c43);
  }

  .bg-orange {
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }

  .bg-red {
    background: linear-gradient(135deg, #ff416c, #ff4b2b);
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .stat-label {
    margin-top: 4px;
    font-size: 14px;
    color: #666;
  }

  .stat-sub {
    margin-top: 4px;
    font-size: 12px;
    color: #999;
  }
</style>
