<template>
  <div class="config-container p-6">
    <el-card>
      <template #header>
        <span>系统配置</span>
      </template>

      <el-form :model="configForm" label-width="200px" class="max-w-2xl">
        <el-form-item label="消费积分奖励比例">
          <el-input v-model="configForm.pointsEarnRate">
            <template #append>
              <span>%</span>
            </template>
          </el-input>
          <div class="text-xs text-gray-400 mt-1">用户消费后获得积分的比例，如填写 5 表示获得消费金额的 5%</div>
        </el-form-item>

        <el-form-item label="推荐奖励比例">
          <el-input v-model="configForm.referralBonusRate">
            <template #append>
              <span>%</span>
            </template>
          </el-input>
          <div class="text-xs text-gray-400 mt-1">推荐人可获得被推荐人消费积分的比例，如填写 10 表示获得 10%</div>
        </el-form-item>

        <el-form-item label="换购转消费积分比例">
          <el-input v-model="configForm.exchangeToConsumerRate">
            <template #append>
              <span>%</span>
            </template>
          </el-input>
          <div class="text-xs text-gray-400 mt-1">换购订单中，30% 部分转为用户消费积分</div>
        </el-form-item>

        <el-form-item label="提现手续费率">
          <el-input v-model="configForm.withdrawalFeeRate">
            <template #append>
              <span>%</span>
            </template>
          </el-input>
          <div class="text-xs text-gray-400 mt-1">用户提现时扣除的手续费比例</div>
        </el-form-item>

        <el-form-item label="被邀请人注册奖励积分">
          <el-input v-model="configForm.registerReward">
            <template #append>
              <span>积分</span>
            </template>
          </el-input>
          <div class="text-xs text-gray-400 mt-1">填写数字表示奖励多少积分，填写 0 表示关闭注册奖励</div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="saveConfig">保存配置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchSystemConfig, fetchUpdateSystemConfig } from '@/api/modules/admin/config'

const saving = ref(false)
const configForm = reactive({
  pointsEarnRate: '5',
  referralBonusRate: '10',
  exchangeToConsumerRate: '30',
  withdrawalFeeRate: '0',
  registerReward: '0'
})

async function loadConfig() {
  try {
    const res = await fetchSystemConfig()
    Object.assign(configForm, res)
  } catch {
    // use defaults
  }
}

async function saveConfig() {
  saving.value = true
  try {
    await fetchUpdateSystemConfig(configForm)
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>
