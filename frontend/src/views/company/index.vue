<template>
  <div class="container">
    <a-page-header :title="$t('menu.company')" sub-title="公司状态管理">
      <template #extra>
        <a-button type="primary" @click="handleCreate">
          <template #icon>
            <icon-plus />
          </template>
          新增公司状态
        </a-button>
      </template>
    </a-page-header>

    <div class="content">
      <a-card>
        <a-space direction="vertical" size="large" style="width: 100%">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-input-search
                v-model="searchForm.companyName"
                placeholder="请输入公司名称"
                @search="handleSearch"
              />
            </a-col>
            <a-col :span="8">
              <a-select
                v-model="searchForm.userId"
                placeholder="请选择关联用户"
                allow-clear
                style="width: 100%"
              >
                <a-option value="">全部用户</a-option>
                <a-option
                  v-for="user in userList"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.username }}
                </a-option>
              </a-select>
            </a-col>
            <a-col :span="8">
              <a-button type="outline" @click="handleReset">重置</a-button>
            </a-col>
          </a-row>

          <a-table
            :columns="columns"
            :data="companyList"
            :loading="loading"
            :pagination="pagination"
            @page-change="handlePageChange"
            @page-size-change="handlePageSizeChange"
          >
            <template #companyName="{ record }">
              <a-link @click="handleView(record)">
                {{ record.companyName }}
              </a-link>
            </template>

            <template #actions="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="handleView(record)">
                  <template #icon>
                    <icon-eye />
                  </template>
                  查看
                </a-button>
                <a-button type="text" size="small" @click="handleEdit(record)">
                  <template #icon>
                    <icon-edit />
                  </template>
                  编辑
                </a-button>
                <a-popconfirm
                  content="确定删除该条记录吗？"
                  @ok="handleDelete(record)"
                >
                  <a-button type="text" size="small" status="danger">
                    <template #icon>
                      <icon-delete />
                    </template>
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </a-space>
      </a-card>
    </div>

    <!-- 创建/编辑弹窗 -->
    <company-form-modal
      v-model:visible="modalVisible"
      :mode="modalMode"
      :current-record="currentRecord"
      @success="handleModalSuccess"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    IconPlus,
    IconEye,
    IconEdit,
    IconDelete,
  } from '@arco-design/web-vue/es/icon';
  import type { CompanyState } from '@/types/company';
  import type { UserInfo } from '@/types/user';
  import { getCompanyList, deleteCompanyState } from '@/api/company';
  import { getUserList } from '@/api/user';
  import CompanyFormModal from './components/company-form-modal.vue';

  // 响应式数据
  const loading = ref(false);
  const companyList = ref<CompanyState[]>([]);
  const userList = ref<UserInfo[]>([]);
  const modalVisible = ref(false);
  const modalMode = ref<'create' | 'edit'>('create');
  const currentRecord = ref<CompanyState | null>(null);

  // 搜索表单
  const searchForm = reactive({
    companyName: '',
    userId: '',
  });

  // 分页配置
  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: true,
    showJumper: true,
    showPageSize: true,
  });

  // 表格列配置
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      slotName: 'companyName',
    },
    {
      title: '公司编码',
      dataIndex: 'companyCode',
    },
    {
      title: '联系电话',
      dataIndex: 'companyPhone',
    },
    {
      title: '质保年',
      dataIndex: 'warrantyYear',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
    {
      title: '操作',
      slotName: 'actions',
    },
  ];

  // 获取公司列表
  const fetchCompanyList = async () => {
    loading.value = true;
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        companyName: searchForm.companyName || undefined,
        userId: searchForm.userId || undefined,
      };

      const response = await getCompanyList(params);
      if (response.data && response.data.data) {
        companyList.value = response.data.data || [];
        pagination.total = response.data.total || 0;
      } else {
        companyList.value = [];
        pagination.total = 0;
      }
    } catch (error) {
      Message.error('获取公司列表失败');
    } finally {
      loading.value = false;
    }
  };

  // 获取用户列表
  const fetchUserList = async () => {
    try {
      const response = await getUserList();
      userList.value = response.data || [];
    } catch (error) {
      // console.error('获取用户列表失败', error);
    }
  };

  // 生命周期
  onMounted(() => {
    fetchCompanyList();
    fetchUserList();
  });

  // 搜索
  const handleSearch = () => {
    pagination.current = 1;
    fetchCompanyList();
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.companyName = '';
    searchForm.userId = '';
    pagination.current = 1;
    fetchCompanyList();
  };

  // 分页变化
  const handlePageChange = (page: number) => {
    pagination.current = page;
    fetchCompanyList();
  };

  const handlePageSizeChange = (size: number) => {
    pagination.pageSize = size;
    pagination.current = 1;
    fetchCompanyList();
  };

  // 创建公司
  const handleCreate = () => {
    modalMode.value = 'create';
    currentRecord.value = null;
    modalVisible.value = true;
  };

  // 查看公司详情
  const handleView = (record: CompanyState) => {
    // 跳转到详情页面或显示详情弹窗
    // 这里可以添加查看公司详情的逻辑
    // console.log('查看公司详情', record);
  };

  // 编辑公司
  const handleEdit = (record: CompanyState) => {
    modalMode.value = 'edit';
    currentRecord.value = record;
    modalVisible.value = true;
  };

  // 删除公司
  const handleDelete = async (record: CompanyState) => {
    try {
      await deleteCompanyState(record.id || 0);
      Message.success('删除成功');
      fetchCompanyList();
    } catch (error) {
      Message.error('删除失败');
    }
  };

  // 弹窗操作成功
  const handleModalSuccess = () => {
    modalVisible.value = false;
    fetchCompanyList();
  };
</script>

<style scoped>
  .container {
    padding: 20px;
  }

  .content {
    margin-top: 20px;
  }
</style>
