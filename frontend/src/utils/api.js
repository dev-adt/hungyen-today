/**
 * Fast & Resilient API Client with strict timeouts & fallbacks
 * Prevents endless loading spinners when backend/network is slow or recovering.
 */

export const DEFAULT_TIMEOUT_MS = 10000;

export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Yêu cầu mạng hết thời gian chờ (${timeoutMs}ms): ${url}`);
    }
    throw error;
  }
}

export async function fetchJsonWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const res = await fetchWithTimeout(url, options, timeoutMs);
  if (!res.ok) {
    let errMsg = `HTTP Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) errMsg = errJson.error;
    } catch (_) {}
    throw new Error(errMsg);
  }
  return await res.json();
}

/**
 * Fallback data cho HungYen.today để trang luôn hiển thị nội dung phong phú và hấp dẫn
 */
export const FALLBACK_POSTS = [
  {
    id: 'fb-post-1',
    title: 'Vì sao Hưng Yên đang trở thành tâm điểm thu hút dòng vốn FDI công nghệ cao và logistics miền Bắc?',
    slug: 'vi-sao-hung-yen-tro-thanh-tam-diem-thu-hut-fdi-cong-nghe-cao',
    category: 'Đầu tư & Dự án',
    sub_category: 'KCN & Logistics',
    summary: 'Sở hữu vị trí cửa ngõ Đông Nam Thủ đô, kết nối trực tiếp cao tốc Hà Nội - Hải Phòng và hệ thống KCN Thăng Long II hiện đại, Hưng Yên đang khẳng định vị thế cứ điểm công nghiệp công nghệ cao dẫn đầu Vùng kinh tế trọng điểm Bắc Bộ.',
    image_url: '/images/hungyen/hungyen_kcn_thang_long.jpg',
    author_name: 'Tổ công tác Xúc tiến Đầu tư',
    company_name: 'Hiệp hội Doanh nghiệp & KCN Hưng Yên',
    company_tier: 'Diamond',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    views: 3420,
    is_featured: 1
  },
  {
    id: 'fb-post-2',
    title: 'Hành trình di sản Phố Hiến: Đánh thức thương cảng đệ nhất và không gian văn hóa Đền Mẫu - Chùa Chuông',
    slug: 'hanh-trinh-di-san-pho-hien-danh-thuc-thuong-cang-de-nhat',
    category: 'Văn hóa & Di sản',
    sub_category: 'Quần thể Phố Hiến',
    summary: 'Khám phá huyền tích "Thứ nhất Kinh Kỳ, thứ nhì Phố Hiến" qua quần thể di tích quốc gia đặc biệt với Đền Mẫu soi bóng hồ Bán Nguyệt, Chùa Chuông đệ nhất danh lam và không gian văn hóa phù sa sông Hồng.',
    image_url: '/images/hungyen/hungyen_den_mau.jpg',
    author_name: 'Trung tâm Xúc tiến Du lịch Hưng Yên',
    company_name: 'Cổng thông tin HungYen.today',
    company_tier: 'Diamond',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    views: 2850,
    is_featured: 1
  },
  {
    id: 'fb-post-3',
    title: 'Nhãn lồng Phố Hiến và Gà Đông Tảo: Chiến lược nâng tầm nông sản OCOP Hưng Yên ra thị trường quốc tế',
    slug: 'nhan-long-pho-hien-ga-dong-tao-chien-luoc-nang-tam-ocop',
    category: 'Doanh nghiệp & Sản phẩm',
    sub_category: 'Sản phẩm OCOP & Nông sản',
    summary: 'Câu chuyện xây dựng chỉ dẫn địa lý, chuỗi bảo quản lạnh hiện đại và ứng dụng thương mại điện tử giúp đặc sản tiến vua Hưng Yên chinh phục các thị trường xuất khẩu cao cấp như Nhật Bản, Hoa Kỳ và EU.',
    image_url: '/images/hungyen/hungyen_nhan_long.jpg',
    author_name: 'Chuyên trang Kinh tế Nông nghiệp',
    company_name: 'Hợp tác xã Nhãn lồng Đặc sản Hưng Yên',
    company_tier: 'Gold',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    views: 1980,
    is_featured: 1
  },
  {
    id: 'fb-post-4',
    title: 'Làng nghề đan đó Thủ Sỹ và Hương xạ Thôn Cao: Nét đẹp sinh kế trăm năm gìn giữ hồn quê xứ nhãn',
    slug: 'lang-nghe-dan-do-thu-sy-va-huong-xa-thon-cao',
    category: 'Du lịch & Trải nghiệm',
    sub_category: 'Làng nghề Truyền thống',
    summary: 'Những cánh đó tre xòe hoa bên sân gạch cổ Tiên Lữ và sắc đỏ rực rỡ của làng hương xạ Thôn Cao tạo nên điểm đến trải nghiệm văn hóa sống động níu chân du khách muôn phương.',
    image_url: '/images/hungyen/hungyen_lang_dan_do.jpg',
    author_name: 'Ban Văn hóa Làng nghề',
    company_name: 'Tổ hợp Làng nghề Truyền thống Hưng Yên',
    company_tier: 'Gold',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    views: 1650,
    is_featured: 0
  },
  {
    id: 'fb-post-5',
    title: 'Đột phá quy hoạch hạ tầng: Dự án tuyến đường kết nối di sản ven sông Hồng và đường Vành đai 4',
    slug: 'dot-pha-quy-hoach-ha-tang-ket-noi-di-san-ven-song-hong',
    category: 'Đầu tư & Dự án',
    sub_category: 'Hạ tầng Giao thông',
    summary: 'Tuyến đường di sản ven sông Hồng mở ra không gian phát triển kinh tế du lịch và logistics mới, kết nối thông suốt Hưng Yên với Hà Nội và vùng đồng bằng Bắc Bộ.',
    image_url: '/images/hungyen/hungyen_giao_thong.jpg',
    author_name: 'Ban Quản lý Dự án Giao thông',
    company_name: 'Sở Giao thông Vận tải Hưng Yên',
    company_tier: 'Diamond',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    views: 1420,
    is_featured: 0
  },
  {
    id: 'fb-post-6',
    title: 'Đô thị sinh thái Ecopark và Văn Giang: Điểm sáng không gian xanh chuẩn mực và kinh tế dịch vụ',
    slug: 'do-thi-sinh-thai-ecopark-va-van-giang-diem-sang-khong-gian-xanh',
    category: 'Du lịch & Trải nghiệm',
    sub_category: 'Đô thị Sinh thái',
    summary: 'Văn Giang khẳng định vị thế đô thị sinh thái xanh hàng đầu miền Bắc với mô hình hài hòa giữa thiên nhiên, bất động sản cao cấp và kinh tế du lịch dịch vụ ven đô.',
    image_url: '/images/hungyen/hungyen_ecopark.jpg',
    author_name: 'Nhịp sống Đô thị Hưng Yên',
    company_name: 'Khu đô thị Ecopark Hưng Yên',
    company_tier: 'Diamond',
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    views: 2150,
    is_featured: 0
  }
];

export const FALLBACK_EVENTS = [
  {
    id: 'fb-evt-1',
    title: 'Lễ hội Văn hóa Dân gian Phố Hiến 2026 — Tôn vinh Hồn thiêng Thương cảng & Kết nối Du lịch',
    slug: 'le-hoi-van-hoa-dan-gian-pho-hien-2026',
    short_desc: 'Sự kiện văn hóa truyền thống quy mô lớn tái hiện thương cảng sầm uất thế kỷ XVII với lễ rước nước, hội thi thả đèn hoa đăng và không gian giao thương ẩm thực xứ nhãn.',
    event_date: new Date(Date.now() + 86400000 * 18 + 3600000 * 5).toISOString(),
    location: 'Quần thể Di tích Quốc gia Đặc biệt Phố Hiến, TP. Hưng Yên',
    organizer: 'UBND Tỉnh Hưng Yên & HungYen.today',
    image_url: '/images/hungyen/hungyen_chua_chuong.jpg',
    is_paid: 0,
    price: 0,
    remaining_tickets: 450,
    registered_count: 350
  },
  {
    id: 'fb-evt-2',
    title: 'Diễn đàn Xúc tiến Đầu tư Công nghiệp Công nghệ cao & Đô thị Sinh thái Hưng Yên 2026',
    slug: 'dien-dan-xuc-tien-dau-tu-cong-nghiep-cnc-hung-yen-2026',
    short_desc: 'Đối thoại giữa Lãnh đạo tỉnh, hiệp hội doanh nghiệp quốc tế (JETRO, KORCHAM, EuroCham) và nhà đầu tư chiến lược về quỹ đất công nghiệp sạch và cơ chế ưu đãi.',
    event_date: new Date(Date.now() + 86400000 * 28 + 3600000 * 3).toISOString(),
    location: 'Trung tâm Hội nghị Tỉnh Hưng Yên & KĐT Ecopark Văn Giang',
    organizer: 'Sở Kế hoạch & Đầu tư Hưng Yên & ADT Group',
    image_url: '/images/hungyen/hungyen_kcn_thang_long.jpg',
    is_paid: 0,
    price: 0,
    remaining_tickets: 180,
    registered_count: 120
  },
  {
    id: 'fb-evt-3',
    title: 'Hội chợ Triển lãm Nông sản Đặc sản OCOP & Nhãn lồng Tiến Vua Hưng Yên 2026',
    slug: 'hoi-cho-trien-lam-ocop-nhan-long-hung-yen-2026',
    short_desc: 'Quy tụ hơn 120 gian hàng nông sản OCOP 3-5 sao, gà Đông Tảo giống chuẩn và nông sản an toàn kết nối trực tiếp với chuỗi siêu thị và sàn TMĐT lớn.',
    event_date: new Date(Date.now() + 86400000 * 38 + 3600000 * 2).toISOString(),
    location: 'Quảng trường Nguyễn Văn Linh, TP. Hưng Yên',
    organizer: 'Sở Công Thương Hưng Yên & Sàn Nông sản Số',
    image_url: '/images/hungyen/hungyen_nhan_long.jpg',
    is_paid: 0,
    price: 0,
    remaining_tickets: 220,
    registered_count: 180
  },
  {
    id: 'fb-evt-4',
    title: 'Hội thảo Ứng dụng AI & Chuyển đổi số trong Chuỗi cung ứng Doanh nghiệp Hưng Yên',
    slug: 'hoi-thao-ai-va-chuyen-doi-so-doanh-nghiep-hung-yen',
    short_desc: 'Trực tiếp demo Trợ lý AI du lịch, giải pháp quản trị số và nền tảng dữ liệu xúc tiến đầu tư phục vụ chuyển đổi số doanh nghiệp địa phương.',
    event_date: new Date(Date.now() + 86400000 * 48 + 3600000 * 6).toISOString(),
    location: 'Khu Công nghệ & Đổi mới Sáng tạo, KCN Thăng Long II, Mỹ Hào, Hưng Yên',
    organizer: 'Hiệp hội Doanh nghiệp Tỉnh Hưng Yên & ADT Group',
    image_url: '/images/hungyen/hungyen_ecopark.jpg',
    is_paid: 1,
    price: 200000,
    remaining_tickets: 95,
    registered_count: 65
  }
];

export const FALLBACK_MEMBERS = [
  {
    id: 1,
    name: 'Công ty Cổ phần Khu Công nghiệp Thăng Long II (Hưng Yên)',
    company_name: 'Công ty Cổ phần Khu Công nghiệp Thăng Long II (Hưng Yên)',
    tier: 'Platinum',
    industry: 'Hạ tầng Khu công nghiệp sinh thái & Thu hút FDI',
    address: 'Thị xã Mỹ Hào & Huyện Yên Mỹ, Tỉnh Hưng Yên',
    logo_url: '/images/hungyen/hungyen_kcn_thang_long.jpg',
    bio: 'Đơn vị quản lý và phát triển KCN sạch chuẩn Nhật Bản kiểu mẫu miền Bắc, thu hút hàng tỷ USD vốn đầu tư công nghệ cao từ các tập đoàn toàn cầu.'
  },
  {
    id: 2,
    name: 'Hợp tác xã Đặc sản Nhãn lồng & Nông sản Phố Hiến',
    company_name: 'Hợp tác xã Đặc sản Nhãn lồng & Nông sản Phố Hiến',
    tier: 'Gold',
    industry: 'Nông nghiệp sạch VietGAP, Nhãn tiến vua & OCOP',
    address: 'Xã Hồng Nam, TP. Hưng Yên, Tỉnh Hưng Yên',
    logo_url: '/images/hungyen/hungyen_nhan_long.jpg',
    bio: 'Sở hữu vùng trồng nhãn hương chi cùi dày hạt tiêu đạt chuẩn VietGAP, tiên phong đưa nông sản xứ nhãn lên sàn số và xuất khẩu quốc tế.'
  },
  {
    id: 3,
    name: 'Công ty Cổ phần ADT Quốc tế',
    company_name: 'Công ty Cổ phần ADT Quốc tế (ADT Group)',
    tier: 'Platinum',
    industry: 'Công nghệ số, AI Agent & Nền tảng Đô thị thông minh',
    address: 'Hà Nội & Trực thuộc Mạng lưới Xúc tiến HungYen.today',
    logo_url: '/logo_icon.svg',
    bio: 'Đơn vị kiến trúc và phát triển nền tảng số HungYen.today, cung cấp hệ thống kết nối kinh tế số thông minh và giải pháp AI toàn diện cho tỉnh Hưng Yên.'
  }
];
