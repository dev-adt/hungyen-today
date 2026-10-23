/**
 * Cấu hình Chuyên mục chính và Lĩnh vực con mặc định cho HungYen.today
 * (Đồng bộ theo Đặc tả thiết kế và Dự án Hưng Yên Today)
 * Dữ liệu được tải động từ API /api/categories (Quản lý chuyên mục trong Admin).
 */

export const CATEGORIES_DATA = [
  {
    id: 'kham-pha-hung-yen',
    name: 'Khám phá Hưng Yên',
    name_en: 'Discover Hung Yen',
    order_index: 1,
    subcategories: [
      'Di sản Phố Hiến',
      'Văn hóa & Làng nghề',
      'Ẩm thực & Đặc sản',
      'Sinh thái & Ven biển'
    ]
  },
  {
    id: 'doanh-nghiep-san-pham',
    name: 'Doanh nghiệp & Sản phẩm',
    name_en: 'Enterprises & Products',
    order_index: 2,
    subcategories: [
      'Danh bạ Doanh nghiệp',
      'Sản phẩm OCOP & Nông sản',
      'Showroom số & Chuỗi cung ứng',
      'Đổi mới sáng tạo & Khởi nghiệp'
    ]
  },
  {
    id: 'giao-thuong-va-dau-tu',
    name: 'Giao thương và Đầu tư',
    name_en: 'Trade & Investment',
    order_index: 3,
    subcategories: [
      'Môi trường & Chính sách Đầu tư',
      'Khu & Cụm công nghiệp',
      'Cơ hội Hợp tác Kinh doanh',
      'Cảng biển & Logistics liên vùng'
    ]
  },
  {
    id: 'su-kien-dien-dan',
    name: 'Sự kiện & Diễn đàn',
    name_en: 'Events & Forums',
    order_index: 4,
    subcategories: [
      'Hội nghị Xúc tiến Đầu tư',
      'Sự kiện Kết nối Giao thương',
      'Lễ hội Văn hóa & Du lịch'
    ]
  },
  {
    id: 'cong-dong',
    name: 'Cộng đồng',
    name_en: 'Community',
    order_index: 5,
    subcategories: [
      'Mạng lưới Doanh nghiệp',
      'Chuyên gia & Cố vấn',
      'Người Hưng Yên Toàn cầu',
      'Cộng tác viên Nội dung'
    ]
  },
  {
    id: 'ai-center',
    name: 'AI Center',
    name_en: 'AI Center',
    order_index: 6,
    subcategories: [
      'Trợ lý AI Hưng Yên',
      'Nền tảng ORION ADT',
      'Bộ đôi Trợ lý AI Phường xã',
      'Giải pháp Edunow.AI'
    ]
  }
];

export const ALL_CATEGORIES = CATEGORIES_DATA.map(c => c.name);

export const getSubcategoriesByCategory = (categoryName) => {
  const cat = CATEGORIES_DATA.find(c => c.name === categoryName);
  return cat ? cat.subcategories : [];
};

export const CATEGORY_LABELS = {
  // Hung Yen Specific Categories
  'Khám phá Hưng Yên': { vi: 'Khám phá Hưng Yên', en: 'Discover Hung Yen', zh: '探索兴安', ja: 'フンイエン探索', ko: '흥옌 탐방' },
  'Doanh nghiệp & Sản phẩm': { vi: 'Doanh nghiệp & Sản phẩm', en: 'Enterprises & Products', zh: '企业与产品', ja: '企業・製品', ko: '기업 및 제품' },
  'Giao thương và Đầu tư': { vi: 'Giao thương và Đầu tư', en: 'Trade & Investment', zh: '经贸与投资', ja: '貿易・投資', ko: '무역 및 투자' },
  'Dự án & Đầu tư': { vi: 'Giao thương và Đầu tư', en: 'Trade & Investment', zh: '经贸与投资', ja: '貿易・投資', ko: '무역 및 투자' },
  'Đầu tư & Dự án': { vi: 'Giao thương và Đầu tư', en: 'Trade & Investment', zh: '经贸与投资', ja: '貿易・投資', ko: '무역 및 투자' },
  'Sự kiện & Diễn đàn': { vi: 'Sự kiện & Diễn đàn', en: 'Events & Forums', zh: '活动与论坛', ja: 'イベント・フォーラム', ko: '이벤트 및 포럼' },
  'Cộng đồng': { vi: 'Cộng đồng', en: 'Community', zh: '社区', ja: 'コミュニティ', ko: '커뮤니티' },
  'AI Center': { vi: 'AI Center', en: 'AI Center', zh: 'AI中心', ja: 'AIセンター', ko: 'AI 센터' },
  
  // Legacy / Fallback Categories
  'Khám phá': { vi: 'Khám phá', en: 'Discover', zh: '探索', ja: '探索', ko: '탐방' },
  'Doanh nghiệp': { vi: 'Doanh nghiệp', en: 'Enterprises', zh: '企业', ja: '企業', ko: '기업' },
  'Đầu tư': { vi: 'Đầu tư', en: 'Investment', zh: '投资', ja: '投資', ko: '투자' },
  'Sự kiện': { vi: 'Sự kiện', en: 'Events', zh: '活动', ja: 'イベント', ko: '이벤트' },
  'Dữ liệu & Báo cáo': { vi: 'Dữ liệu & Báo cáo', en: 'Data & Reports', zh: '数据与报告', ja: 'データ・レポート', ko: '데이터 및 보고서' }
};

export const SUBCATEGORY_LABELS = {
  // Hung Yen Subcategories
  'Di sản Phố Hiến': { vi: 'Di sản Phố Hiến', en: 'Pho Hien Heritage', zh: '宪街遗产', ja: 'フォーヒエン遺産', ko: '포히엔 유산' },
  'Văn hóa & Làng nghề': { vi: 'Văn hóa & Làng nghề', en: 'Culture & Craft Villages', zh: '文化与手工艺村', ja: '文化・工芸村', ko: '문화 및 공예 마을' },
  'Ẩm thực & Đặc sản': { vi: 'Ẩm thực & Đặc sản', en: 'Cuisine & Specialties', zh: '美食与特产', ja: '料理・特産品', ko: '요리 및 특산품' },
  'Sinh thái & Ven biển': { vi: 'Sinh thái & Ven biển', en: 'Ecology & Coast', zh: '生态与沿海', ja: '生態・沿岸', ko: '생태 및 해안' },
  'Danh bạ Doanh nghiệp': { vi: 'Danh bạ Doanh nghiệp', en: 'Business Directory', zh: '企业名录', ja: '企業名鑑', ko: '기업 디렉토리' },
  'Sản phẩm OCOP & Nông sản': { vi: 'Sản phẩm OCOP & Nông sản', en: 'OCOP & Agro-products', zh: 'OCOP与农产品', ja: 'OCOP・農産物', ko: 'OCOP 및 농산물' },
  'Showroom số & Chuỗi cung ứng': { vi: 'Showroom số & Chuỗi cung ứng', en: 'Digital Showroom & Supply Chain', zh: '数字展厅与供应链', ja: 'デジタルショールーム・サプライチェーン', ko: '디지털 쇼룸 및 공급망' },
  'Đổi mới sáng tạo & Khởi nghiệp': { vi: 'Đổi mới sáng tạo & Khởi nghiệp', en: 'Innovation & Startups', zh: '创新创业', ja: 'イノベーション・起業', ko: '혁신 및 스타트업' },
  'Môi trường & Chính sách Đầu tư': { vi: 'Môi trường & Chính sách Đầu tư', en: 'Investment Policy & Climate', zh: '投资环境与政策', ja: '投資環境・政策', ko: '투자 환경 및 정책' },
  'Khu & Cụm công nghiệp': { vi: 'Khu & Cụm công nghiệp', en: 'Industrial Parks', zh: '工业区与产业集群', ja: '工業団地・集積地', ko: '산업단지 및 클러스터' },
  'Cơ hội Hợp tác Kinh doanh': { vi: 'Cơ hội Hợp tác Kinh doanh', en: 'Business Cooperation Opportunities', zh: '经贸合作商机', ja: 'ビジネス提携機会', ko: '비즈니스 협력 기회' },
  'Cảng biển & Logistics liên vùng': { vi: 'Cảng biển & Logistics liên vùng', en: 'Seaports & Regional Logistics', zh: '海港与区域物流', ja: '港湾・地域物流', ko: '항만 및 지역 물류' },
  'Hội nghị Xúc tiến Đầu tư': { vi: 'Hội nghị Xúc tiến Đầu tư', en: 'Investment Promotion Conference', zh: '招商引资大会', ja: '投資促進会議', ko: '투자 유치 회의' },
  'Sự kiện Kết nối Giao thương': { vi: 'Sự kiện Kết nối Giao thương', en: 'Trade Matchmaking Events', zh: '经贸对接活动', ja: 'ビジネスマッチング', ko: '무역 매칭 이벤트' },
  'Lễ hội Văn hóa & Du lịch': { vi: 'Lễ hội Văn hóa & Du lịch', en: 'Cultural & Tourism Festivals', zh: '文旅节日', ja: '文化・観光祭り', ko: '문화 및 관광 축제' },
  'Mạng lưới Doanh nghiệp': { vi: 'Mạng lưới Doanh nghiệp', en: 'Enterprise Network', zh: '企业网络', ja: '企業ネットワーク', ko: '기업 네트워크' },
  'Chuyên gia & Cố vấn': { vi: 'Chuyên gia & Cố vấn', en: 'Experts & Advisors', zh: '专家与顾问', ja: '専門家・顧問', ko: '전문가 및 고문' },
  'Người Hưng Yên Toàn cầu': { vi: 'Người Hưng Yên Toàn cầu', en: 'Global Hung Yen Community', zh: '全球兴安同乡', ja: 'グローバルフンイエンコミュニティ', ko: '글로벌 흥옌 향우회' },
  'Cộng tác viên Nội dung': { vi: 'Cộng tác viên Nội dung', en: 'Content Contributors', zh: '内容创作者', ja: 'コンテンツ協力者', ko: '콘텐츠 기고자' },
  'Trợ lý AI Hưng Yên': { vi: 'Trợ lý AI Hưng Yên', en: 'Hung Yen AI Assistant', zh: '兴安AI助手', ja: 'フンイエンAIアシスタント', ko: '흥옌 AI 어시스턴트' },
  'Nền tảng ORION ADT': { vi: 'Nền tảng ORION ADT', en: 'ORION ADT Platform', zh: 'ORION ADT平台', ja: 'ORION ADTプラットフォーム', ko: 'ORION ADT 플랫폼' },
  'Bộ đôi Trợ lý AI Phường xã': { vi: 'Bộ đôi Trợ lý AI Phường xã', en: 'Commune & Ward AI Assistant Duo', zh: '乡坊AI助手组合', ja: '自治体AIアシスタント', ko: '동주민센터 AI 어시스턴트' },
  'Giải pháp Edunow.AI': { vi: 'Giải pháp Edunow.AI', en: 'Edunow.AI Solution', zh: 'Edunow.AI教育解决方案', ja: 'Edunow.AIソリューション', ko: 'Edunow.AI 솔루션' }
};

export const getCategoryLabel = (cat, lang = 'vi') => {
  if (!cat) return '';
  const l = lang || 'vi';
  if (typeof cat === 'object') {
    if (cat.name) {
      if (CATEGORY_LABELS[cat.name]?.[l]) return CATEGORY_LABELS[cat.name][l];
      if (l === 'en' && cat.name_en) return String(cat.name_en);
      if (l !== 'vi' && CATEGORY_LABELS[cat.name]?.en) return CATEGORY_LABELS[cat.name].en;
      return String(cat.name);
    }
    return '';
  }
  if (typeof cat === 'string') {
    if (CATEGORY_LABELS[cat]?.[l]) return CATEGORY_LABELS[cat][l];
    if (l !== 'vi' && CATEGORY_LABELS[cat]?.en) return CATEGORY_LABELS[cat].en;
    return cat;
  }
  return String(cat);
};

export const getSubCategoryLabel = (sub, lang = 'vi') => {
  if (!sub) return '';
  const l = lang || 'vi';
  if (typeof sub === 'object') {
    if (sub.name) {
      if (SUBCATEGORY_LABELS[sub.name]?.[l]) return SUBCATEGORY_LABELS[sub.name][l];
      if (l === 'en' && sub.name_en) return String(sub.name_en);
      if (l !== 'vi' && SUBCATEGORY_LABELS[sub.name]?.en) return SUBCATEGORY_LABELS[sub.name].en;
      return String(sub.name);
    }
    return '';
  }
  if (typeof sub === 'string') {
    if (SUBCATEGORY_LABELS[sub]?.[l]) return SUBCATEGORY_LABELS[sub][l];
    if (l !== 'vi' && SUBCATEGORY_LABELS[sub]?.en) return SUBCATEGORY_LABELS[sub].en;
    return sub;
  }
  return String(sub);
};

export default CATEGORIES_DATA;
