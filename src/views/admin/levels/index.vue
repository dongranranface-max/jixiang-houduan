<template>
  <div class="level-config-container p-6">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span>会员等级配置</span>
          <el-button type="primary" size="small" @click="openEdit()">保存配置</el-button>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" border>
        <el-table-column label="等级" width="100">
          <template #default="{ row }">
            <el-tag type="danger" size="large">V{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="等级名称" width="150">
          <template #default="{ row }">
            <el-input v-model="row.name" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="等级图标" width="120">
          <template #default="{ row }">
            <el-input v-model="row.icon" size="small" placeholder="Icon URL" />
          </template>
        </el-table-column>
        <el-table-column label="最低业绩要求" width="160">
          <template #default="{ row }">
            <el-input-number v-model="row.minPerformance" size="small" :min="0" :step="1000" />
          </template>
        </el-table-column>
        <el-table-column label="每日分红比例" width="160">
          <template #default="{ row }">
            <el-input v-model="row.dailyBonus" size="small" style="width: 100px">
              <template #append>%</template>
            </el-input>
          </template>
        </el-table-column>
        <el-table-column label="说明">
          <template #default="{ row }">
            <span class="text-gray-500 text-sm">
              团队业绩达到 {{ Number(row.minPerformance).toLocaleString() }} 可升级，每日获得订单流水的 {{ row.dailyBonus }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchLevelConfigs, fetchUpdateLevelConfig } from '@/api/modules/admin/level'
import type { LevelConfigItem } from '@/api/modules/admin/level'

const loading = ref(false)
const tableData = ref<LevelConfigItem[]>([])

async function loadData() {
  loading.value = true
  try {
    const res = await fetchLevelConfigs()
    tableData.value = res
  } catch {
    ElMessage.error('加载失败')
  } finally {
    loading.value = false
  }
}

async function openEdit() {
  try {
    for (const item of tableData.value) {
      await fetchUpdateLevelConfig(item.level, {
        level: item.level,
        name: item.name,
        icon: item.icon,
        minPerformance: item.minPerformance,
        dailyBonus: item.dailyBonus
      })
    }
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  loadData()
})
</script>
