const platformApi = {
  getEnterpriseInfo: {
    //查询企业信息
    method: 'get',
    module: 'platform',
    address: 'pc-enterprise/getEnterpriseInfo',
  },
  getEnterpriseOpenStep: {
    //查询企业开通步骤
    method: 'get',
    module: 'platform',
    address: 'pc-enterprise/getEnterpriseOpenStep',
  },
  saveOrUpdateOpenStep: {
    //新增或更新企业开通步骤
    method: 'get',
    module: 'platform',
    address: 'pc-enterprise/saveOrUpdateOpenStep',
  },
  updateEnterpriseInfo: {
    //更新企业信息
    method: 'post',
    module: 'platform',
    address: 'pc-enterprise/updateEnterpriseInfo',
  },
  saveBatchMember: {
    //批量添加员工
    method: 'post',
    module: 'platform',
    address: 'pc-member/saveBatchMember',
  },
  saveBatchDept: {
    //批量添加部门
    method: 'post',
    module: 'platform',
    address: 'pc-dept/saveBatchDept',
  },
  configureBookPermissions: {
    //配置预订权限
    method: 'post',
    module: 'platform',
    address: 'pc-bookpermission/configureBookPermissions',
  },
  getMemberBookPermission: {
    //根据产品线查询员工预订权限
    method: 'get',
    module: 'platform',
    address: 'pc-bookpermission/getMemberBookPermission',
  },
  listProductType: {
    //查询允许因公预定的产品线
    method: 'get',
    module: 'platform',
    address: 'pc-bookpermission/listProductType',
  },
  // /platform/pc-enterprise/reset
  reset: {
    method: 'post',
    module: 'platform',
    address: 'pc-enterprise/reset',
  },
  getBusinessOpenRecords: {
    //查询企业开通的业务
    method: 'get',
    module: 'platform',
    address: 'pc-businessopenrecord/getBusinessOpenRecords',
  },
  listBusinessStatus: {
    //查询业务状态列表
    method: 'post',
    module: 'platform',
    address: 'pc-businessopenrecord/listBusinessStatus',
  },
  saveOrUpdateBusinessOpenRecord: {
    //新增或更新企业开通业务的状态
    method: 'post',
    module: 'platform',
    address: 'pc-businessopenrecord/saveOrUpdateBusinessOpenRecord',
  },
  saveCustomerRequire: {
    //没有您想要的接口
    method: 'post',
    module: 'platform',
    address: 'pc-businessopenrecord/saveCustomerRequire',
  },
  listUserMenu: {
    //查询用户的菜单集合
    method: 'get',
    module: 'platform',
    address: 'pc-user-menu/listUserMenu',
  },
  pageAuthMember: {
    //授权人员分页
    method: 'post',
    module: 'platform',
    address: 'pc-user-manage-scope/pageAuthMember',
  },
  saveBatchAuthMember: {
    //批量添加授权人员
    method: 'post',
    module: 'platform',
    address: 'pc-user-manage-scope/saveBatchAuthMember',
  },
  updateAuthMember: {
    //编辑授权人员
    method: 'post',
    module: 'platform',
    address: 'pc-user-manage-scope/updateAuthMember',
  },
  logicDelete: {
    //删除授权人员
    method: 'get',
    module: 'platform',
    address: 'pc-user-manage-scope/logicDelete',
  },
  getAuthMemberDetail: {
    //授权人员详情
    method: 'get',
    module: 'platform',
    address: 'pc-user-manage-scope/getAuthMemberDetail',
  },
  saveUser: {
    //添加用户
    method: 'post',
    module: 'platform',
    address: 'pc-user/saveUser',
  },
  pageSupplierManage: {
    //供应商管理分页
    method: 'post',
    module: 'platform',
    address: 'pc-businessopenrecord/pageSupplierManage',
  },
  getPendingMatters: {
    //查询企业待处理事项
    method: 'get',
    module: 'platform',
    address: 'pc-enterprise/getPendingMatters',
  },
  listTab: {
    //根据菜单id获取tab
    method: 'get',
    module: 'platform',
    address: 'pc-user-menu/listTab',
  },
  //===================首页接口===================
  getEnterpriseAllPriceConfigs: {
    // 查询企业价格配置
    method: 'post',
    module: 'platform',
    address: '/pc-platform/getEnterpriseAllPriceConfigs',
  },

  pageEnterpriseAccount: {
    //分页查询企业列表
    method: 'post',
    module: 'platform',
    address: 'account/page',
  },
  listEnterpriseAccount: {
    //查询公司列表
    method: 'get',
    module: 'platform',
    address: 'account/list',
  },
  saveEnterpriseAccount: {
    //创建子公司
    method: 'post',
    module: 'platform',
    address: 'account/save',
  },
  saveInvoice: {
    //保存发票
    method: 'post',
    module: 'platform',
    address: 'invoice/save',
  },
  listInvoice: {
    //查询企业已添加发票列表
    method: 'get',
    module: 'platform',
    address: 'invoice/list',
  },
  setEnterpriseValid: {
    //启用&停用 子公司
    method: 'post',
    module: 'platform',
    address: 'account/valid',
  },
  getEnterpriseDetail: {
    //子公司详情
    method: 'get',
    module: 'platform',
    address: 'account/detail',
  },
  getInvoiceOpenStep: {
    //查询企业发票信息填写步骤
    method: 'get',
    module: 'platform',
    address: 'invoiceOpenStep/getInvoiceOpenStep',
  },
  saveOrUpdateInvoiceOpenStep: {
    //新增&更新发票填写步骤
    method: 'post',
    module: 'platform',
    address: 'invoiceOpenStep/saveOrUpdateInvoiceOpenStep',
  },
  deleteInvoice: {
    //删除发票
    method: 'post',
    module: 'platform',
    address: 'invoice/delete',
  },
  invoiceRuleDetail: {
    //获取发票规则详情
    method: 'get',
    module: 'platform',
    address: 'invoice/rule/detail',
  },
  saveInvoiceRule: {
    //新增&编辑发票规则
    method: 'post',
    module: 'platform',
    address: 'invoice/rule/save',
  },
  balanceReminderDetail: {
    //查看余额提醒配置
    method: 'get',
    module: 'platform',
    address: 'pc-balance-reminder/detail',
  },
  balanceReminderSave: {
    //新增更新余额提醒配置
    method: 'post',
    module: 'platform',
    address: 'pc-balance-reminder/save',
  },
  accountCommonSetting: {
    //子母账户设置通用设置
    method: 'post',
    module: 'platform',
    address: 'account/common/setting',
  },
  accountCommonSettingInfo: {
    //获取子母账户设置通用设置
    method: 'get',
    module: 'platform',
    address: 'account/common/settingInfo',
  },
  GetRechargeListV2: {
    //企业充值明细V2
    method: 'post',
    module: 'common/api',
    address: 'Enterprise/GetRechargeListV2',
  },
  getMemberRoleInfo: {
    //获取人员角色
    method: 'get',
    module: 'platform',
    address: 'pc-user/getMemberRoleInfo',
  },
};

exports.platformApi = platformApi;
