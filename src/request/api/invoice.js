const invoiceApi = {
  GetAreaList: {
    //获取省市区
    method: 'get',
    module: 'b2b',
    address: 'Common/GetAreaList',
  },
  saveMailAddress: {
    // 新增邮寄地址
    method: 'post',
    module: 'platform',
    address: 'mailAddress/saveMailAddress',
  },
  updateMailAddress: {
    // 编辑邮寄地址
    method: 'post',
    module: 'platform',
    address: 'mailAddress/updateMailAddress',
  },
  pageMailAddress: {
    // 查询邮寄地址分页
    method: 'post',
    module: 'platform',
    address: 'mailAddress/pageMailAddress',
  },
  batchDeleteMailAddress: {
    // 批量删除邮寄地址
    method: 'post',
    module: 'platform',
    address: 'mailAddress/batchDeleteMailAddress',
  },
  getMailAddressDetail: {
    //查询邮寄地址详情
    method: 'get',
    module: 'platform',
    address: 'mailAddress/getMailAddressDetail',
  },
  pageInvoice: {
    //查询企业已添加发票分页
    method: 'post',
    module: 'platform',
    address: 'invoice/page',
  },
  getInvoiceDetail: {
    //查询发票信息详情
    method: 'get',
    module: 'platform',
    address: 'invoice/detail',
  },
  batchDeleteInvoice: {
    //批量删除发票信息
    method: 'get',
    module: 'platform',
    address: 'invoice/batchDeleteInvoice',
  },
  saveInvoice: {
    //新增&编辑 发票
    method: 'post',
    module: 'platform',
    address: 'invoice/save',
  },
  validInvoice: {
    //启用&停用 发票
    method: 'post',
    module: 'platform',
    address: 'invoice/valid',
  },
  listEnterpriseAccount: {
    //查询公司列表-发票选公司用
    method: 'get',
    module: 'platform',
    address: 'account/list',
  },
  getEnterpriseDimension: {
    //查询企业开票维度
    method: 'get',
    module: 'platform',
    address: 'enterpriseDimensionRelation/getEnterpriseDimension',
  },
  saveEnterpriseDimension: {
    //新增或修改企业开票维度关系
    method: 'post',
    module: 'platform',
    address: 'enterpriseDimensionRelation/saveOrUpdateEnterpriseDimensionRelation',
  },
  invoiceDefault: {
    //母公司设置默认发票
    method: 'post',
    module: 'platform',
    address: 'invoice/default',
  },
  listBankType: {
    //查询银行类型列表
    method: 'post',
    module: 'finance-asset',
    address: 'asset/listBankType',
  },
  getInvoiceOpenStep: {
    // 查询企业发票信息填写步骤
    method: 'get',
    module: 'platform',
    address: 'invoiceOpenStep/getInvoiceOpenStep',
  },
  invoiceExport: {
    // 导出开票规则明细
    method: 'get',
    module: 'platform',
    address: 'invoice/export',
  },
  invoiceImport: {
    // 导入开票规则明细
    method: 'post',
    module: 'platform',
    address: 'invoice/import',
  },
};
exports.invoiceApi = invoiceApi;
