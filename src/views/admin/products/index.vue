<template>
  <div class="product-list-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>{{ pageTitle }}</span>
          <el-button type="primary" @click="openDialog()">新增商品</el-button>
        </div>
      </template>

      <el-form :inline="true" class="mb-4">
        <el-form-item label="关键词">
          <el-input
            v-model="searchParams.keyword"
            placeholder="商品名称"
            clearable
            @keyup.enter="loadData"
          />
        </el-form-item>
        <el-form-item v-if="!lockedMallType" label="商城类型">
          <el-select v-model="searchParams.type" placeholder="全部" clearable>
            <el-option label="消费商城" :value="1" />
            <el-option label="换购商城" :value="2" />
            <el-option label="兑换商城" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStatusFilter" label="状态">
          <el-select v-model="searchParams.status" placeholder="全部" clearable>
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="2" />
            <el-option label="草稿" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

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
        <el-table-column v-if="!lockedMallType" label="类型" width="100">
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
        <el-table-column label="状态" width="88">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-button
              v-if="row.status !== 1"
              link
              type="success"
              size="small"
              @click="toggleStatus(row, 1)"
            >
              上架
            </el-button>
            <el-button
              v-if="row.status === 1"
              link
              type="danger"
              size="small"
              @click="toggleStatus(row, 2)"
            >
              下架
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

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" maxlength="200" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="formData.categoryId" placeholder="请选择分类" class="w-full">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!lockedMallType" label="商城类型" prop="type">
          <el-select v-model="formData.type" class="w-full">
            <el-option label="消费商城" :value="1" />
            <el-option label="换购商城" :value="2" />
            <el-option label="兑换商城" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item :label="formData.type === 3 ? '标价(参考)' : '售价'" prop="price">
          <el-input v-model="formData.price" />
        </el-form-item>
        <el-form-item v-if="formData.type === 3" label="兑换积分" prop="requiredPoints">
          <el-input v-model="formData.requiredPoints" placeholder="用户兑换所需消费积分" />
        </el-form-item>
        <el-form-item v-if="formData.type === 2" label="生态积分价">
          <el-input v-model="formData.ecoPointsPrice" placeholder="换购所需生态积分" />
        </el-form-item>
        <el-form-item v-if="formData.type === 1" label="原价">
          <el-input v-model="formData.originalPrice" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="formData.stock" :min="0" class="w-full" />
        </el-form-item>
        <el-form-item label="封面图 URL">
          <el-input v-model="formData.coverUrl" placeholder="图片地址" />
        </el-form-item>
        <el-form-item label="商品详情">
          <el-input v-model="formData.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formData.status" class="w-full">
            <el-option label="草稿" :value="0" />
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import {
    fetchProductList,
    fetchUpdateProductStatus,
    fetchCreateProduct,
    fetchUpdateProduct,
    fetchCategoryList,
    type ProductItem,
    type CategoryItem
  } from '@/api/modules/admin/product'
  import { MALL_TYPE_NAME } from '@/constants/mall'

  /** 与 API ProductStatus 一致：0 草稿 1 上架 2 下架 */
  const PRODUCT_STATUS = {
    DRAFT: 0,
    ON_SALE: 1,
    OFF_SALE: 2
  } as const

  const route = useRoute()
  const loading = ref(false)
  const tableData = ref<ProductItem[]>([])
  const total = ref(0)
  const menuStatus = ref<number | undefined>(undefined)

  const searchParams = reactive({
    keyword: '',
    type: undefined as number | undefined,
    status: undefined as number | undefined,
    page: 1,
    limit: 20
  })

  const lockedMallType = computed(() => {
    const t = route.meta.mallType
    return typeof t === 'number' ? t : undefined
  })

  const pageTitle = computed(() => {
    const mall = lockedMallType.value ? MALL_TYPE_NAME[lockedMallType.value] : '商品'
    if (menuStatus.value === PRODUCT_STATUS.ON_SALE) return `${mall} · 上架商品`
    if (menuStatus.value === PRODUCT_STATUS.OFF_SALE) return `${mall} · 下架商品`
    return `${mall} · 商品管理`
  })

  const showStatusFilter = computed(() => menuStatus.value === undefined)

  function statusLabel(status: number) {
    if (status === PRODUCT_STATUS.ON_SALE) return '上架'
    if (status === PRODUCT_STATUS.OFF_SALE) return '下架'
    return '草稿'
  }

  function statusTagType(status: number): 'success' | 'info' | 'warning' {
    if (status === PRODUCT_STATUS.ON_SALE) return 'success'
    if (status === PRODUCT_STATUS.OFF_SALE) return 'info'
    return 'warning'
  }

  function syncStatusFromRoute() {
    const metaStatus = route.meta.productStatus
    if (typeof metaStatus === 'number') {
      menuStatus.value = metaStatus
      searchParams.status = metaStatus
    } else {
      menuStatus.value = undefined
      searchParams.status = undefined
    }
    if (lockedMallType.value) {
      searchParams.type = lockedMallType.value
      formData.type = lockedMallType.value
    }
  }

  async function loadData() {
    loading.value = true
    try {
      const res = await fetchProductList({
        keyword: searchParams.keyword || undefined,
        type: searchParams.type,
        status: searchParams.status,
        page: searchParams.page,
        limit: searchParams.limit
      })
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
    searchParams.type = lockedMallType.value
    searchParams.page = 1
    searchParams.status = menuStatus.value !== undefined ? menuStatus.value : undefined
    loadData()
  }

  const dialogVisible = ref(false)
  const submitting = ref(false)
  const editingId = ref<string | null>(null)
  const formRef = ref<FormInstance>()
  const categories = ref<CategoryItem[]>([])

  const formData = reactive({
    name: '',
    categoryId: '',
    type: 1,
    price: '',
    originalPrice: '',
    requiredPoints: '',
    ecoPointsPrice: '',
    stock: 0,
    coverUrl: '',
    description: '',
    status: 1
  })

  const formRules: FormRules = {
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
    type: [{ required: true, message: '请选择商城类型', trigger: 'change' }],
    price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
    stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
  }

  const dialogTitle = computed(() => (editingId.value ? '编辑商品' : '新增商品'))

  async function loadCategories() {
    try {
      categories.value = await fetchCategoryList(
        lockedMallType.value ? { mallType: lockedMallType.value } : undefined
      )
    } catch {
      categories.value = []
    }
  }

  function openDialog(row?: ProductItem) {
    if (!categories.value.length) loadCategories()
    if (row) {
      editingId.value = row.id
      formData.name = row.name
      formData.categoryId = row.categoryId
      formData.type = row.type
      formData.price = String(row.price)
      formData.originalPrice = row.originalPrice ? String(row.originalPrice) : ''
      formData.requiredPoints = row.requiredPoints ? String(row.requiredPoints) : ''
      formData.ecoPointsPrice =
        (row as ProductItem & { ecoPointsPrice?: string }).ecoPointsPrice || ''
      formData.stock = row.stock
      formData.coverUrl = row.coverImages?.[0] || ''
      formData.description = row.description || ''
      formData.status = row.status
    } else {
      editingId.value = null
      formData.name = ''
      formData.categoryId = ''
      formData.type = lockedMallType.value ?? 1
      formData.price = ''
      formData.originalPrice = ''
      formData.requiredPoints = ''
      formData.ecoPointsPrice = ''
      formData.stock = 0
      formData.coverUrl = ''
      formData.description = ''
      formData.status =
        menuStatus.value === PRODUCT_STATUS.OFF_SALE ? PRODUCT_STATUS.DRAFT : PRODUCT_STATUS.ON_SALE
    }
    dialogVisible.value = true
  }

  async function submitForm() {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    const payload = {
      name: formData.name,
      categoryId: formData.categoryId,
      type: formData.type,
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      requiredPoints: formData.requiredPoints || undefined,
      ecoPointsPrice: formData.ecoPointsPrice || undefined,
      stock: formData.stock,
      coverImages: formData.coverUrl ? [formData.coverUrl] : [],
      description: formData.description,
      status: formData.status
    }

    submitting.value = true
    try {
      if (editingId.value) {
        await fetchUpdateProduct(editingId.value, payload)
        ElMessage.success('更新成功')
      } else {
        await fetchCreateProduct(payload)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } catch {
      ElMessage.error(editingId.value ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  }

  async function toggleStatus(row: ProductItem, newStatus: number) {
    const action = newStatus === PRODUCT_STATUS.ON_SALE ? '上架' : '下架'
    try {
      await ElMessageBox.confirm(`确定将「${row.name}」${action}吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      await fetchUpdateProductStatus(row.id, newStatus)
      ElMessage.success(`${action}成功`)
      loadData()
    } catch (e) {
      if (e !== 'cancel') {
        ElMessage.error(`${action}失败`)
      }
    }
  }

  watch(
    () => route.name,
    () => {
      syncStatusFromRoute()
      searchParams.page = 1
      loadData()
    }
  )

  onMounted(() => {
    syncStatusFromRoute()
    loadCategories()
    loadData()
  })
</script>
