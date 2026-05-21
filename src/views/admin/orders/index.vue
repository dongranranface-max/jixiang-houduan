<template>
  <div class="order-list-container p-6">
    <el-card>
      <template #header>
        <span>{{ pageTitle }}</span>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" class="mb-4">
        <el-form-item label="订单号">
          <el-input
            v-model="searchParams.orderNo"
            placeholder="订单号"
            clearable
            @keyup.enter="loadData"
          />
        </el-form-item>
        <el-form-item v-if="!lockedOrderType" label="商城类型">
          <el-select v-model="searchParams.orderType" placeholder="全部" clearable>
            <el-option label="消费订单" :value="1" />
            <el-option label="换购订单" :value="2" />
            <el-option label="兑换订单" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option label="待付款" :value="1" />
            <el-option label="已付款" :value="2" />
            <el-option label="已发货" :value="3" />
            <el-option label="已完成" :value="4" />
            <el-option label="已取消" :value="5" />
            <el-option label="退款中" :value="6" />
            <el-option label="已退款" :value="7" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="订单号" prop="orderNo" width="200" />
        <el-table-column label="用户" width="120">
          <template #default="{ row }">
            <div>{{ row.userPhone }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="!lockedOrderType" label="类型" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.orderType === 1 ? 'primary' : row.orderType === 2 ? 'warning' : 'success'"
              size="small"
            >
              {{ row.orderTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="金额" prop="totalAmount" width="100" />
        <el-table-column label="积分奖励" prop="pointsEarned" width="100">
          <template #default="{ row }">{{ row.pointsEarned || '-' }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            <div v-for="item in row.items" :key="item.productName" class="text-sm">
              {{ item.productName }} x{{ item.quantity }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createdAt" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === 2"
              link
              type="success"
              size="small"
              @click="openShipDialog(row)"
            >
              发货
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

    <!-- 发货对话框 -->
    <el-dialog v-model="shipDialogVisible" title="发货" width="400px">
      <el-form :model="shipForm" label-width="80px">
        <el-form-item label="快递公司">
          <el-input v-model="shipForm.company" placeholder="如：顺丰速运" />
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="shipForm.trackingNo" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmShip">确认发货</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" title="订单详情" width="640px">
      <template v-if="detailOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ detailOrder.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="用户">{{ detailOrder.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ detailOrder.orderTypeName }}</el-descriptions-item>
          <el-descriptions-item label="状态">{{ detailOrder.statusName }}</el-descriptions-item>
          <el-descriptions-item label="金额">¥{{ detailOrder.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ detailOrder.createdAt }}</el-descriptions-item>
          <el-descriptions-item
            v-if="detailOrder.expressCompany || detailOrder.logistics"
            label="物流"
          >
            {{
              detailOrder.expressCompany
                ? `${detailOrder.expressCompany} ${detailOrder.expressNo || ''}`
                : `${detailOrder.logistics!.company} ${detailOrder.logistics!.trackingNo}`
            }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="mt-4 font-medium">商品明细</div>
        <el-table :data="detailOrder.items" class="mt-2" size="small">
          <el-table-column label="商品" prop="productName" />
          <el-table-column label="单价" prop="price" width="80" />
          <el-table-column label="数量" prop="quantity" width="70" />
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { fetchOrderList, fetchShipOrder } from '@/api/modules/admin/order'
  import type { OrderItem } from '@/api/modules/admin/order'
  import { ORDER_TYPE_NAME } from '@/constants/mall'

  const route = useRoute()
  const loading = ref(false)
  const tableData = ref<OrderItem[]>([])
  const total = ref(0)
  const searchParams = reactive({
    orderNo: '',
    orderType: undefined as number | undefined,
    status: undefined as number | undefined,
    page: 1,
    limit: 20
  })

  const shipDialogVisible = ref(false)
  const detailVisible = ref(false)
  const shipForm = reactive({ company: '', trackingNo: '' })
  const currentOrder = ref<OrderItem>()
  const detailOrder = ref<OrderItem>()

  const lockedOrderType = computed(() => {
    const t = route.meta.orderType ?? route.meta.mallType
    return typeof t === 'number' ? t : undefined
  })

  const pageTitle = computed(() => {
    if (lockedOrderType.value) return `${ORDER_TYPE_NAME[lockedOrderType.value]} · 订单管理`
    return '订单管理'
  })

  function syncOrderTypeFromRoute() {
    if (lockedOrderType.value) {
      searchParams.orderType = lockedOrderType.value
    }
  }

  function getStatusType(status: number): 'primary' | 'success' | 'warning' | 'info' | 'danger' {
    const map: Record<number, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
      1: 'warning',
      2: 'info',
      3: 'primary',
      4: 'success',
      5: 'danger',
      6: 'info'
    }
    return map[status] || 'info'
  }

  async function loadData() {
    loading.value = true
    try {
      const res = await fetchOrderList(searchParams)
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
    searchParams.orderType = lockedOrderType.value
    searchParams.status = undefined
    searchParams.page = 1
    loadData()
  }

  function viewDetail(row: OrderItem) {
    detailOrder.value = row
    detailVisible.value = true
  }

  function openShipDialog(row: OrderItem) {
    currentOrder.value = row
    shipForm.company = ''
    shipForm.trackingNo = ''
    shipDialogVisible.value = true
  }

  async function confirmShip() {
    if (!shipForm.company || !shipForm.trackingNo) {
      ElMessage.warning('请填写完整信息')
      return
    }
    try {
      await fetchShipOrder(currentOrder.value!.orderNo, {
        company: shipForm.company,
        trackingNo: shipForm.trackingNo
      })
      ElMessage.success('发货成功')
      shipDialogVisible.value = false
      loadData()
    } catch {
      ElMessage.error('发货失败')
    }
  }

  watch(
    () => route.name,
    () => {
      syncOrderTypeFromRoute()
      searchParams.page = 1
      loadData()
    }
  )

  onMounted(() => {
    syncOrderTypeFromRoute()
    loadData()
  })
</script>
