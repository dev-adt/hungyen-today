/**
 * BACKEND BRAND CONFIGURATION
 * -------------------------------------------------------------
 * File cấu hình thương hiệu tập trung cho Node.js Express Backend.
 * Tự động đồng bộ với biến môi trường (.env) nếu có.
 */

require('dotenv').config();

const brandConfig = {
  appName: process.env.APP_NAME || 'HungYen.today Platform',
  brandName: process.env.BRAND_NAME || 'HungYen.today',
  brandShortName: process.env.BRAND_SHORT_NAME || 'Hưng Yên Today',
  siteUrl: process.env.SITE_URL || 'https://hungyen.today',
  demoSiteUrl: 'https://hungyen.today',
  
  // Nhận diện logo thương hiệu
  logo: {
    primary: '/logo_icon.svg',
    dark: '/logo_icon.svg',
    icon: '/logo_icon.svg',
    favicon: '/favicon.svg'
  },
  
  // Thông tin thanh toán ngân hàng (VietQR)
  bankAccount: {
    bankName: 'Techcombank',
    bankBranch: 'PGD Văn Quán / Chi nhánh Hà Nội',
    accountNumber: '19036730021017',
    accountHolder: 'CONG TY CO PHAN ADT QUOC TE',
    binCode: '970407'
  },

  // AI System Persona Prompt cho Hưng Yên
  ai: {
    agentName: process.env.AI_AGENT_NAME || 'Hưng Yên AI Assistant',
    systemPrompt: process.env.AI_SYSTEM_PROMPT || 
      "Bạn là trợ lý AI chuyên nghiệp của nền tảng HungYen.today — Nền tảng kết nối hợp tác, xúc tiến đầu tư và quảng bá tỉnh Hưng Yên tích hợp AI. Hãy tư vấn sâu sắc, chuẩn xác, giàu thông tin và truyền cảm hứng về cơ hội đầu tư, quy hoạch vùng, chuỗi cung ứng công nghiệp, nông nghiệp hữu cơ, sản vật OCOP, di sản Phố Hiến và kinh tế biển của tỉnh Hưng Yên."
  },

  // Email Brand Info
  email: {
    fromName: process.env.SMTP_FROM_NAME || 'Ban Biên Tập HungYen.today',
    fromAddress: process.env.SMTP_FROM || `"HungYen.today" <${process.env.SMTP_USER || 'no-reply@hungyen.today'}>`,
    supportEmail: process.env.SUPPORT_EMAIL || 'support@hungyen.today'
  },

  // 6 Chuyên mục chuẩn Hưng Yên Today
  defaultCategories: [
    { name: 'Khám phá Hưng Yên', slug: 'kham-pha-hung-yen', icon: '🏯', description: 'Di sản Phố Hiến, văn hóa làng nghề, ẩm thực đặc sản và trải nghiệm sinh thái ven biển' },
    { name: 'Doanh nghiệp & Sản phẩm', slug: 'doanh-nghiep-san-pham', icon: '🏢', description: 'Hồ sơ doanh nghiệp, sản phẩm OCOP, nông sản chất lượng cao và showroom số' },
    { name: 'Giao thương và Đầu tư', slug: 'giao-thuong-va-dau-tu', icon: '💼', description: 'Môi trường đầu tư, KCN hiện đại, cơ hội hợp tác và chuỗi logistics liên vùng' },
    { name: 'Sự kiện & Diễn đàn', slug: 'su-kien-dien-dan', icon: '📅', description: 'Lịch sự kiện kinh tế, hội nghị xúc tiến đầu tư và kết nối giao thương B2B' },
    { name: 'Cộng đồng', slug: 'cong-dong', icon: '🤝', description: 'Mạng lưới doanh nghiệp, chuyên gia, người Hưng Yên toàn cầu và cộng tác viên' },
    { name: 'AI Center', slug: 'ai-center', icon: '✨', description: 'Trợ lý AI Hưng Yên, nền tảng ORION và các giải pháp AI tiên tiến từ ADT' }
  ]
};

module.exports = brandConfig;
