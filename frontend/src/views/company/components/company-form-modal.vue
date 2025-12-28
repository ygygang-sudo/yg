<template>
  <a-modal
    v-model:visible="visible"
    :title="modalTitle"
    :width="800"
    :mask-closable="false"
    :esc-to-close="false"
    @before-ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formModel"
      :rules="formRules"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
    >
      <a-form-item field="companyName" label="公司名称">
        <a-input v-model="formModel.companyName" placeholder="请输入公司名称" />
      </a-form-item>

      <a-form-item field="companyCode" label="公司编码">
        <a-input v-model="formModel.companyCode" placeholder="请输入公司编码" />
      </a-form-item>

      <a-form-item field="companyPhone" label="联系电话">
        <a-input
          v-model="formModel.companyPhone"
          placeholder="请输入联系电话"
        />
      </a-form-item>

      <a-form-item field="warrantyYear" label="质保年">
        <a-input-number
          v-model="formModel.warrantyYear"
          placeholder="请输入质保年"
        />
      </a-form-item>

      <a-form-item field="epsAccount" label="EPS账号">
        <a-input v-model="formModel.epsAccount" placeholder="请输入EPS账号" />
      </a-form-item>

      <a-form-item field="epsPassword" label="EPS密码">
        <a-input-password
          v-model="formModel.epsPassword"
          placeholder="请输入EPS密码"
        />
      </a-form-item>

      <a-form-item field="bankName" label="开户银行">
        <a-input v-model="formModel.bankName" placeholder="请输入开户银行" />
      </a-form-item>

      <a-form-item field="bankAccount" label="银行账号">
        <a-input v-model="formModel.bankAccount" placeholder="请输入银行账号" />
      </a-form-item>

      <a-form-item field="frameworkContractExpire" label="框架合同到期时间">
        <a-date-picker
          v-model="formModel.frameworkContractExpire"
          placeholder="请选择到期时间"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item field="materialInfo" label="物料信息">
        <a-textarea
          v-model="materialInfoText"
          placeholder="请输入物料信息（JSON格式）"
          :rows="4"
          @change="handleMaterialInfoChange"
        />
      </a-form-item>

      <a-form-item v-if="mode === 'create'" field="userId" label="关联用户">
        <a-select
          v-model="formModel.userId"
          placeholder="请选择关联用户"
          allow-clear
          style="width: 100%"
        >
          <a-option v-for="user in userList" :key="user.id" :value="user.id">
            {{ user.username }} ({{ user.email }})
          </a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue';
  import { FormInstance, Message } from '@arco-design/web-vue';
  import { createCompanyState, updateCompanyState } from '@/api/company';
  import { getUserList } from '@/api/user';
  import type {
    CompanyStateCreateRequest,
    CompanyStateUpdateRequest,
    CompanyState,
  } from '@/types/company';
  import type { UserInfo } from '@/types/user';

  interface Props {
    visible: boolean;
    mode: 'create' | 'edit';
    currentRecord?: CompanyState | null;
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'success'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    currentRecord: null,
  });

  const emit = defineEmits<Emits>();

  // 响应式数据
  const formRef = ref<FormInstance>();
  const userList = ref<UserInfo[]>([]);
  const materialInfoText = ref('');

  // 表单模型
  const formModel = reactive<
    CompanyStateCreateRequest & CompanyStateUpdateRequest
  >({
    companyName: '',
    companyCode: '',
    companyPhone: '',
    warrantyYear: undefined,
    epsAccount: '',
    epsPassword: '',
    bankName: '',
    bankAccount: '',
    frameworkContractExpire: undefined,
    materialInfo: {},
    userId: undefined as unknown as number,
  });

  // 表单验证规则
  const formRules = {
    companyName: [{ required: true, message: '请输入公司名称' }],
    companyCode: [{ required: true, message: '请输入公司编码' }],
  };

  // 计算属性
  const modalTitle = computed(() => {
    return props.mode === 'create' ? '创建公司状态' : '编辑公司状态';
  });

  const visible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value),
  });

  // 获取用户列表
  const fetchUserList = async () => {
    try {
      const response = await getUserList();
      userList.value = response.data || [];
    } catch (error) {
      // 获取用户列表失败
    }
  };

  // 重置表单
  const resetForm = () => {
    Object.assign(formModel, {
      companyName: '',
      companyCode: '',
      companyPhone: '',
      warrantyYear: undefined,
      epsAccount: '',
      epsPassword: '',
      bankName: '',
      bankAccount: '',
      frameworkContractExpire: undefined,
      materialInfo: {},
      userId: undefined as unknown as number,
    });
    materialInfoText.value = '';
  };

  // 监听当前记录变化
  watch(
    () => props.currentRecord,
    (record) => {
      if (record && props.mode === 'edit') {
        Object.assign(formModel, {
          companyName: record.companyName,
          companyCode: record.companyCode,
          companyPhone: record.companyPhone,
          warrantyYear: record.warrantyYear,
          epsAccount: record.epsAccount,
          epsPassword: record.epsPassword,
          bankName: record.bankName,
          bankAccount: record.bankAccount,
          frameworkContractExpire: record.frameworkContractExpire,
          materialInfo: record.materialInfo || {},
        });

        // 格式化物料信息为JSON字符串
        materialInfoText.value = JSON.stringify(
          record.materialInfo || {},
          null,
          2
        );
      } else {
        resetForm();
      }
    },
    { immediate: true }
  );

  // 监听模态框显示状态
  watch(visible, async (value) => {
    if (value) {
      await fetchUserList();
      if (props.mode === 'create') {
        resetForm();
      }
    }
  });

  // 处理物料信息变化
  const handleMaterialInfoChange = (value: string) => {
    try {
      if (value.trim()) {
        formModel.materialInfo = JSON.parse(value);
      } else {
        formModel.materialInfo = {};
      }
    } catch (error) {
      // 物料信息JSON格式错误
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    const validateResult = await formRef.value?.validate();
    if (validateResult) {
      return false;
    }

    try {
      if (props.mode === 'create') {
        // 在创建模式下，确保userId是有效的数字
        if (formModel.userId === undefined) {
          Message.error('请选择关联用户');
          return false;
        }
        await createCompanyState({
          ...formModel,
          userId: formModel.userId,
        });
        Message.success('创建成功');
      } else if (props.currentRecord) {
        if (props.currentRecord.id === undefined) {
          Message.error('当前记录ID不存在');
          return false;
        }
        await updateCompanyState(
          props.currentRecord.id,
          formModel as CompanyStateUpdateRequest
        );
        Message.success('更新成功');
      }

      emit('success');
      return true;
    } catch (error) {
      Message.error('操作失败');
      return false;
    }
  };

  // 取消操作
  const handleCancel = () => {
    resetForm();
  };
</script>

<style scoped>
  :deep(.arco-form-item-label) {
    font-weight: 500;
  }
</style>
