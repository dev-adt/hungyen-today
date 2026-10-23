/**
 * BRAND CONFIGURATION (CẤU HÌNH THƯƠNG HIỆU TẬP TRUNG)
 * -------------------------------------------------------------
 * File quản lý toàn bộ thông tin nhận diện thương hiệu nền tảng HungYen.today.
 * Định vị: Nền tảng kết nối hợp tác, xúc tiến đầu tư và quảng bá tỉnh Hưng Yên tích hợp AI
 * Thông điệp: "Hội tụ phù sa, kết nối tương lai"
 */

export const brandConfig = {
  // Thông tin định danh thương hiệu
  brandName: 'HungYen.today',
  brandShortName: 'Hưng Yên Today',
  platformName: 'HungYen.today Digital Platform',
  companyLegalName: 'Nền tảng kết nối hợp tác, xúc tiến đầu tư & quảng bá Hưng Yên',
  partnerLegalName: 'Công ty Cổ phần ADT Quốc tế',
  
  // Slogan & Định vị theo tài liệu Hưng Yên Today
  slogan: 'Hội tụ phù sa, kết nối tương lai',
  tagline: 'Khám phá di sản, kết nối doanh nghiệp và mở rộng cơ hội hợp tác tại Hưng Yên trên nền tảng tích hợp AI',
  description: 'HungYen.today kết nối câu chuyện địa phương với doanh nghiệp, sản phẩm, sự kiện và những người đang tìm cơ hội hợp tác. Dữ liệu được tổ chức để dễ tìm kiếm; AI hỗ trợ gợi ý, còn mỗi kết nối quan trọng đều có đầu mối tiếp nhận.',
  
  // Tên miền & Đường dẫn
  domain: 'hungyen.today',
  baseUrl: 'https://hungyen.today',
  demoUrl: 'https://hungyen.today',
  apiBaseUrl: '/api',

  // Nhận diện hình ảnh & Logo
  logo: {
    primary: '/logo_icon.svg',
    dark: '/logo_icon.svg',
    icon: '/logo_icon.svg',
    alt: 'HungYen.today Logo',
    favicon: '/favicon.svg',
    defaultThumbnail: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    fallbackCompanyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80'
  },

  // Bảng màu chuẩn theo định hướng: Hưng Yên — Dòng chảy di sản và giao thương
  colors: {
    primary: '#103D3B',          // Xanh chủ đạo
    primaryHover: '#0C312F',
    primaryDark: '#082927',       // Xanh rất đậm
    primaryLight: '#E6EFEF',
    creamBg: '#F7F4EC',          // Nền giấy ngà
    charcoalDark: '#203330',     // Màu chữ chính
    gold: '#D6A846',             // Vàng nhấn
    goldLight: '#E4BF68',
    goldGlow: 'rgba(214, 168, 70, 0.35)',
    brickRed: '#A6533D',         // Đỏ gạch dùng tiết chế
    accent: '#D6A846',
    accentGlow: 'rgba(214, 168, 70, 0.4)',
    border: 'rgba(16, 61, 59, 0.12)',
    borderStrong: 'rgba(16, 61, 59, 0.22)',
    darkBg: '#082927',
    darkCard: '#103D3B'
  },

  // Trợ lý Trí tuệ Nhân tạo (AI Assistant)
  aiAssistant: {
    name: 'Hưng Yên AI Assistant',
    shortName: 'Trợ lý AI Hưng Yên',
    title: 'Trợ lý AI Cố vấn Dữ liệu & Kết nối Đầu tư Hưng Yên',
    avatar: '/ai_robot_avatar-removebg.png',
    welcomeMessage: 'Xin chào! Tôi là Trợ lý AI của HungYen.today. Tôi có thể hỗ trợ quý vị tra cứu thông tin di sản Phố Hiến, làng nghề truyền thống, kết nối doanh nghiệp, tìm kiếm nhà cung cấp, cơ hội đầu tư và chính sách ưu đãi tại Hưng Yên 24/7.',
    systemRole: 'Bạn là trợ lý AI chuyên nghiệp của nền tảng HungYen.today — Nền tảng kết nối hợp tác, xúc tiến đầu tư và quảng bá tỉnh Hưng Yên tích hợp AI. Hãy tư vấn sâu sắc, chuẩn xác, giàu thông tin và truyền cảm hứng về cơ hội đầu tư, quy hoạch vùng, chuỗi cung ứng công nghiệp, nông nghiệp hữu cơ, sản vật OCOP, di sản Phố Hiến và kinh tế biển của tỉnh Hưng Yên.',
    quickSuggestions: [
      'Tôi muốn khám phá Hưng Yên cuối tuần',
      'Tôi cần tìm nhà cung cấp phù hợp tại Hưng Yên',
      'Tôi muốn giới thiệu doanh nghiệp và đưa sản phẩm lên nền tảng',
      'Tìm hiểu các khu công nghiệp và chính sách thu hút đầu tư tại Hưng Yên'
    ]
  },

  // Thông tin liên hệ & Đơn vị vận hành
  contact: {
    hotline: '0986 354 152',
    techHotline: '0986 354 152',
    email: 'banbientap@hungyen.today',
    supportEmail: 'contact@hungyen.today',
    adtWebsite: 'https://www.adtgroup.net/',
    address: 'Tỉnh Hưng Yên, Việt Nam',
    techAddress: 'Công ty Cổ phần ADT Quốc Tế — https://www.adtgroup.net/',
    workingHours: '08:00 - 17:30 (Thứ 2 - Thứ 6)',
    copyright: '© 2026 HungYen.today — Nền tảng kết nối hợp tác, xúc tiến đầu tư & quảng bá Hưng Yên tích hợp AI. Phát triển bởi ADT Quốc tế.'
  },

  // Thông tin thanh toán ngân hàng VietQR
  bankAccount: {
    bankName: 'Techcombank',
    bankBranch: 'PGD Văn Quán / Chi nhánh Hà Nội',
    accountNumber: '19036730021017',
    accountHolder: 'CONG TY CO PHAN ADT QUOC TE',
    binCode: '970407'
  },

  // Mạng xã hội
  socials: {
    facebook: 'https://facebook.com/adtgroup.net',
    youtube: 'https://youtube.com/@adtgroup',
    zalo: 'https://zalo.me/0986354152',
    website: 'https://www.adtgroup.net/'
  },

  // Quyền lợi Hội viên & Doanh nghiệp
  membership: {
    benefitsTitle: 'Quyền lợi Hội viên HungYen.today',
    badgeText: 'Mạng lưới kết nối doanh nghiệp & nhà đầu tư Hưng Yên',
    tiers: [
      { id: 'Standard', name: 'Khám phá (Cơ bản)', badge: 'Thành viên Khám phá' },
      { id: 'Silver', name: 'Doanh nghiệp Kết nối', badge: 'Đối tác Bạc' },
      { id: 'Gold', name: 'Doanh nghiệp Tiêu biểu', badge: 'Đối tác Vàng' },
      { id: 'Diamond', name: 'Nhà đầu tư Chiến lược', badge: 'Đối tác Kim Cương' }
    ]
  }
};

export const BRAND_CONFIG = brandConfig;
export default brandConfig;
