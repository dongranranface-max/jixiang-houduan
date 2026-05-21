<template>
  <div class="categories-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>{{ pageTitle }}</span>
          <el-button type="primary" @click="openDialog()">新增分类</el-button>
        </div>
      </template>

      <!-- 表格 -->
      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column label="分类名称" prop="name" min-width="150" />
        <el-table-column label="图标" prop="icon" width="100">
          <template #default="{ row }">
            <span v-if="row.icon">{{ row.icon }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openDialog(row)">编辑</el-button>
            <el-popconfirm title="确定删除该分类？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="9999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { MALL_TYPE_NAME } from '@/constants/mall'
  import type { FormInstance, FormRules } from 'element-plus'
  import {
    fetchCategoryList,
    fetchCreateCategory,
    fetchUpdateCategory,
    fetchDeleteCategory
  } from '@/api/modules/admin/product'
  import type { CategoryItem, CategoryParams } from '@/api/modules/admin/product'

  const route = useRoute()
  const lockedMallType = computed(() => {
    const t = route.meta.mallType
    return typeof t === 'number' ? t : undefined
  })
  const pageTitle = computed(() =>
    lockedMallType.value ? `${MALL_TYPE_NAME[lockedMallType.value]} · 分类管理` : '分类管理'
  )

  const loading = ref(false)
  const tableData = ref<CategoryItem[]>([])
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const editingId = ref<string | null>(null)
  const formRef = ref<FormInstance>()

  const formData = reactive<CategoryParams>({
    name: '',
    sort: 0,
    mallType: undefined
  })

  const formRules: FormRules = {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }

  const dialogTitle = computed(() => (editingId.value ? '编辑分类' : '新增分类'))

  async function loadData() {
    loading.value = true
    try {
      const res = await fetchCategoryList(
        lockedMallType.value ? { mallType: lockedMallType.value } : undefined
      )
      tableData.value = res
    } catch {
      ElMessage.error('加载分类列表失败')
    } finally {
      loading.value = false
    }
  }

  function openDialog(row?: CategoryItem) {
    if (row) {
      editingId.value = row.id
      formData.name = row.name
      formData.sort = row.sort
    } else {
      editingId.value = null
      formData.name = ''
      formData.sort = 0
      formData.mallType = lockedMallType.value
    }
    dialogVisible.value = true
  }

  async function handleSubmit() {
    if (!formRef.value) return
    const valid = await formRef.value.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    try {
      if (editingId.value) {
        await fetchUpdateCategory(editingId.value, formData)
        ElMessage.success('更新成功')
      } else {
        await fetchCreateCategory(formData)
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

  async function handleDelete(id: string) {
    try {
      await fetchDeleteCategory(id)
      ElMessage.success('删除成功')
      loadData()
    } catch {
      ElMessage.error('删除失败')
    }
  }

  watch(
    () => route.name,
    () => {
      loadData()
    }
  )

  onMounted(() => {
    loadData()
  })
</script>
