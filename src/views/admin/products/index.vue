<template>
  <div class="product-list-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>商品管理</span>
          <el-button type="primary" @click="openDialog()">新增商品</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" class="mb-4">
        <el-form-item label="关键词">
          <el-input v-model="searchParams.keyword" placeholder="商品名称" clearable @keyup.enter="loadData" />
        </el-form-item>
        <el-form-item label="商城类型">
          <el-select v-model="searchParams.type" placeholder="全部" clearable>
            <el-option label="消费商城" :value="1" />
            <el-option label="换购商城" :value="2" />
            <el-option label="兑换商城" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="商品" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <el-image :src="row.coverImages?.[0]" fit="cover" class="w-12 h-12 rounded" />
              <div>
                <div class="font-medium">{{ row.name }}</div>
                <div class="text-xs text-gray-400">{{ row.categoryName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 1 ? 'primary' : row.type === 2 ? 'warning' : 'success'">
              {{ row.typeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" width="100" />
        <el-table-column label="积分" prop="requiredPoints" width="100">
          <template #default="{ row }">{{ row.requiredPoints || '-' }}</template>
        </el-table-column>
        <el-table-column label="库存" prop="stock" width="80" />
        <el-table-column label="销量" prop="sales" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="160" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-button link :type="row.status === 1 ? 'danger' : 'success'" size="small" @click="toggleStatus(row)">
              {{ row.status === 1 ? '下架' : '上架' }}
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
import { ElMessage } from 'element-plus'
import { fetchProductList, fetchUpdateProductStatus } from '@/api/modules/admin/product'
import type { ProductItem } from '@/api/modules/admin/product'

const loading = ref(false)
const tableData = ref<ProductItem[]>([])
const total = ref(0)
const searchParams = reactive({
  keyword: '',
  type: undefined as number | undefined,
  status: undefined as number | undefined,
  page: 1,
  limit: 20
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchProductList(searchParams)
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
  searchParams.type = undefined
  searchParams.status = undefined
  searchParams.page = 1
  loadData()
}

function openDialog(row?: ProductItem) {
  // TODO: 打开商品编辑对话框
  ElMessage.info(row ? '编辑功能开发中' : '新增功能开发中')
}

async function toggleStatus(row: ProductItem) {
  const newStatus = row.status === 1 ? 0 : 1
  try {
    await fetchUpdateProductStatus(row.id, newStatus)
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
