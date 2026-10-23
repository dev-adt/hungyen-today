import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIBot from '../components/FloatingAIBot';
import SEOHead from '../components/SEOHead';
import brandConfig from '../brand.config';
import { fetchJsonWithTimeout, FALLBACK_POSTS } from '../utils/api';
import './HomeHungYen.css';

// 6 Trụ cột phát triển Hưng Yên (Theo Phần III Chương 8 & Phụ lục)
const SIX_PILLARS = [
  {
    id: 'pillar-industry',
    title: 'Công nghiệp và chuỗi cung ứng',
    desc: 'Phát triển công nghiệp công nghệ cao, chuỗi cung ứng cơ khí, linh kiện điện tử và hệ sinh thái KCN Thăng Long II hiện đại.',
    tag: 'Trụ cột Công nghiệp',
    img: '/images/hungyen/hungyen_kcn_thang_long.jpg',
    category: 'Giao thương và Đầu tư',
    subCategory: 'Khu & Cụm công nghiệp'
  },
  {
    id: 'pillar-agriculture',
    title: 'Nông nghiệp và sản phẩm địa phương',
    desc: 'Nông nghiệp giá trị cao, sản vật OCOP tiêu biểu (Nhãn lồng Phố Hiến, Tương Bần...) và vùng nguyên liệu hữu cơ đạt chuẩn VietGAP.',
    tag: 'Trụ cột Nông nghiệp',
    img: '/images/hungyen/hungyen_nhan_long.jpg',
    category: 'Doanh nghiệp & Sản phẩm',
    subCategory: 'Sản phẩm OCOP & Nông sản'
  },
  {
    id: 'pillar-marine-logistics',
    title: 'Kinh tế kết nối và logistics',
    desc: 'Kết nối trục hành lang kinh tế liên vùng, vành đai giao thông trọng điểm, trung tâm kho vận hiện đại và công nghiệp phụ trợ.',
    tag: 'Trụ cột Logistics',
    img: '/images/hungyen/hungyen_giao_thong.jpg',
    category: 'Giao thương và Đầu tư',
    subCategory: 'Cảng biển & Logistics liên vùng'
  },
  {
    id: 'pillar-heritage-tourism',
    title: 'Di sản và du lịch',
    desc: 'Bảo tồn không gian văn hóa Phố Hiến, Đền Mẫu, Chùa Keo, Chùa Chuông, các làng nghề cổ truyền và du lịch sinh thái sông Hồng.',
    tag: 'Trụ cột Di sản',
    img: '/images/hungyen/hungyen_den_mau.jpg',
    category: 'Khám phá Hưng Yên',
    subCategory: 'Di sản Phố Hiến'
  },
  {
    id: 'pillar-innovation',
    title: 'Đô thị sinh thái & Đổi mới sáng tạo',
    desc: 'Đại đô thị xanh Ecopark, thúc đẩy chuyển đổi số, thu hút nhân lực chất lượng cao và ứng dụng trí tuệ nhân tạo AI vào quản trị.',
    tag: 'Trụ cột Đổi mới',
    img: '/images/hungyen/hungyen_ecopark.jpg',
    category: 'Doanh nghiệp & Sản phẩm',
    subCategory: 'Đổi mới sáng tạo & Khởi nghiệp'
  },
  {
    id: 'pillar-community',
    title: 'Làng nghề & Cộng đồng toàn cầu',
    desc: 'Gìn giữ hồn quê qua các làng nghề trăm năm (Thủ Sỹ, Thôn Cao) và mạng lưới kết nối doanh nhân, kiều bào Hưng Yên khắp năm châu.',
    tag: 'Trụ cột Cộng đồng',
    img: '/images/hungyen/hungyen_lang_dan_do.jpg',
    category: 'Cộng đồng',
    subCategory: 'Người Hưng Yên Toàn cầu'
  }
];

// Khám phá Hưng Yên (Lưới biên tập 8 điểm đến chuẩn địa bàn Hưng Yên)
const EXPLORE_DESTINATIONS = [
  {
    id: 'pho-hien',
    title: 'Quần thể Di tích Quốc gia đặc biệt Phố Hiến',
    type: 'heritage',
    typeLabel: 'Di sản Lịch sử',
    location: 'TP. Hưng Yên',
    desc: 'Thương cảng cổ phồn hoa “Thứ nhất Kinh kỳ, thứ nhì Phố Hiến”, nơi lưu giữ Đền Mẫu, hồ Bán Nguyệt và hàng chục di tích độc đáo.',
    img: '/images/hungyen/hungyen_den_mau.jpg'
  },
  {
    id: 'chua-chuong',
    title: 'Chùa Chuông — Phố Hiến đệ nhất danh thắng',
    type: 'heritage',
    typeLabel: 'Di sản & Tâm linh',
    location: 'Phường Hiến Nam, TP. Hưng Yên',
    desc: 'Ngôi cổ tự linh thiêng bậc nhất xứ nhãn với tam quan cổ kính, cầu đá xanh và hệ thống tượng Phật thời Hậu Lê quý giá.',
    img: '/images/hungyen/hungyen_chua_chuong.jpg'
  },
  {
    id: 'lang-thu-sy',
    title: 'Làng nghề đan đó Thủ Sỹ truyền thống',
    type: 'craft',
    typeLabel: 'Làng nghề truyền thống',
    location: 'Huyện Tiên Lữ',
    desc: 'Không gian làng quê Bắc Bộ thanh bình với nghề đan đó thủ công hơn hai thế kỷ, những đóa hoa tre nở rộ giữa sân gạch cổ.',
    img: '/images/hungyen/hungyen_lang_dan_do.jpg'
  },
  {
    id: 'chua-keo',
    title: 'Chùa Keo — Di sản kiến trúc gỗ lim cổ kính',
    type: 'heritage',
    typeLabel: 'Di sản Kiến trúc',
    location: 'Không gian Văn hóa Hưng Yên',
    desc: 'Kiệt tác kiến trúc cổ Việt Nam với gác chuông 3 tầng bằng gỗ lim độc nhất vô nhị, gắn liền với lễ hội truyền thống đặc sắc.',
    img: '/images/hungyen/hungyen_chua_keo.jpg'
  },
  {
    id: 'lang-huong-cao',
    title: 'Làng nghề hương xạ Thôn Cao',
    type: 'craft',
    typeLabel: 'Làng nghề truyền thống',
    location: 'Huyện Ân Thi',
    desc: 'Nổi tiếng khắp cả nước với hương thơm thảo mộc tự nhiên tinh tế, sắc đỏ rực rỡ và bí quyết thảo dược gia truyền từ thế kỷ 18.',
    img: '/images/hungyen/hungyen_lang_huong.jpg'
  },
  {
    id: 'nhan-long',
    title: 'Vùng đặc sản Nhãn lồng Phố Hiến',
    type: 'cuisine',
    typeLabel: 'Ẩm thực & Đặc sản',
    location: 'TP. Hưng Yên & Khoái Châu',
    desc: 'Vương giả chi quả tiến vua nức tiếng với cùi dày, giòn ngọt, hương thơm thanh khiết của vùng phù sa châu thổ sông Hồng.',
    img: '/images/hungyen/hungyen_nhan_long.jpg'
  },
  {
    id: 'lang-hoa-xuan-quan',
    title: 'Làng hoa & cây cảnh Phụng Công - Xuân Quan',
    type: 'eco',
    typeLabel: 'Sinh thái & Trải nghiệm',
    location: 'Huyện Văn Giang',
    desc: 'Thủ phủ hoa cây cảnh và vựa quất cảnh trù phú ven sông Hồng, cung cấp hoa kiểng cho toàn miền Bắc và du lịch sinh thái.',
    img: '/images/hungyen/hungyen_lang_hoa_vangiang.jpg'
  },
  {
    id: 'den-da-hoa',
    title: 'Đền Đa Hòa — Huyền tích Chử Đồng Tử Tiên Dung',
    type: 'heritage',
    typeLabel: 'Di sản & Tâm linh',
    location: 'Huyện Khoái Châu',
    desc: 'Ngôi đền cổ kính tuyệt mỹ soi bóng sông Hồng, tôn vinh mối tình bất tử trong Tứ bất tử văn hóa dân gian Việt Nam.',
    img: '/images/hungyen/hungyen_den_da_hoa.jpg'
  }
];

// 6 Sản phẩm OCOP & Đặc sản tiêu biểu Hưng Yên
const OCOP_PRODUCTS = [
  {
    name: 'Nhãn lồng tiến vua Phố Hiến',
    category: 'OCOP 5 Sao • Đặc sản Tiến Vua',
    desc: 'Trái to, cùi dày giòn ngọt nước, hương thơm quý phái được bảo hộ chỉ dẫn địa lý toàn cầu.',
    img: '/images/hungyen/hungyen_nhan_long.jpg'
  },
  {
    name: 'Gà Đông Tảo thuần chủng Khoái Châu',
    category: 'Đặc sản Tiến Vua • Nông nghiệp quý hiếm',
    desc: 'Đôi chân to vảy rồng đặc trưng, thịt chắc thơm ngọt đậm đà, quà biếu thượng hạng xứ nhãn.',
    img: '/images/hungyen/hungyen_ga_dong_tao.jpg'
  },
  {
    name: 'Tương Bần Mỹ Hào hảo hạng',
    category: 'OCOP 4 Sao • Gia vị truyền thống',
    desc: 'Lên men tự nhiên từ gạo nếp cái hoa vàng và đỗ tương thơm ngon, nước chấm trứ danh xứ Bắc.',
    img: '/images/hungyen/hungyen_den_da_hoa.jpg'
  },
  {
    name: 'Mật ong hoa nhãn nguyên chất Hưng Yên',
    category: 'OCOP 4 Sao • Nông sản sạch',
    desc: 'Thu hoạch từ những vườn nhãn bạt ngàn nở rộ ven đê sông Hồng, sánh mịn vàng óng tự nhiên.',
    img: '/images/hungyen/hungyen_lang_hoa_vangiang.jpg'
  },
  {
    name: 'Hoa kiểng & Bonsai Văn Giang',
    category: 'Nông nghiệp sinh thái đô thị',
    desc: 'Nghệ thuật cây cảnh thế và hoa rực rỡ phục vụ lễ hội, đô thị sinh thái Vùng Thủ đô.',
    img: '/images/hungyen/hungyen_lang_huong.jpg'
  },
  {
    name: 'Sản phẩm mây tre đan đó Thủ Sỹ',
    category: 'OCOP 3 Sao • Thủ công mỹ nghệ',
    desc: 'Những chiếc đó tre tinh xảo vừa là ngư cụ truyền thống vừa là tác phẩm trang trí mỹ thuật độc đáo.',
    img: '/images/hungyen/hungyen_lang_dan_do.jpg'
  }
];

// Cơ hội hợp tác & Đầu tư tiêu biểu
const INVESTMENT_OPPORTUNITIES = [
  {
    title: 'Thu hút công nghiệp phụ trợ & công nghệ cao vào KCN Thăng Long II',
    type: 'investment',
    typeLabel: 'Cơ hội Đầu tư',
    provider: 'Ban Quản lý KCN Hưng Yên',
    desc: 'Hạ tầng đồng bộ chuẩn Nhật Bản, quỹ đất sạch sẵn sàng tiếp nhận doanh nghiệp cơ khí chính xác và điện tử.',
    updated: 'Tháng 10/2026',
    status: 'Đang mở tiếp nhận'
  },
  {
    title: 'Tìm kiếm đối tác cung ứng bao bì & đóng gói nông sản xuất khẩu',
    type: 'supplier',
    typeLabel: 'Tìm nhà cung cấp',
    provider: 'HTX Nông sản Hưng Yên',
    desc: 'Nhu cầu hợp tác lâu dài với đơn vị cung cấp bao bì tự hủy sinh học và thùng carton chịu lực cho nhãn lồng xuất khẩu.',
    updated: 'Tháng 10/2026',
    status: 'Xác nhận nhu cầu'
  },
  {
    title: 'Dự án Trung tâm Logistics & Kho bãi liên vùng ven sông Hồng',
    type: 'partner',
    typeLabel: 'Tìm đối tác phát triển',
    provider: 'Liên danh Hạ tầng Hưng Yên',
    desc: 'Hợp tác liên doanh vận hành trung tâm phân phối hàng hóa kết nối hành lang kinh tế Hà Nội - Hải Phòng.',
    updated: 'Tháng 10/2026',
    status: 'Đang kêu gọi đối tác'
  },
  {
    title: 'Hợp tác phát triển chuỗi chế biến sâu dược liệu & thảo mộc OCOP',
    type: 'partner',
    typeLabel: 'Hợp tác chế biến',
    provider: 'Hiệp hội Doanh nghiệp Hưng Yên',
    desc: 'Mời các doanh nghiệp chuyển giao công nghệ chiết xuất tinh dầu, chế biến trà dược liệu và mỹ phẩm thiên nhiên.',
    updated: 'Tháng 10/2026',
    status: 'Đang kết nối'
  }
];

export const Home = () => {
  const { currentLang } = useTranslation();
  const navigate = useNavigate();

  // State tìm kiếm & Tab nhu cầu
  const [activeSearchTab, setActiveSearchTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State bộ lọc khám phá
  const [exploreFilter, setExploreFilter] = useState('all');

  // State dữ liệu sự kiện từ backend
  const [eventsList, setEventsList] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // State danh sách bài viết & bộ lọc chuyên mục
  const [postsList, setPostsList] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activePostCategory, setActivePostCategory] = useState('all');

  // Nạp bài viết từ backend hoặc fallback Hưng Yên
  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        const res = await fetchJsonWithTimeout('/api/posts?limit=8');
        if (isMounted) {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            setPostsList(res.data);
          } else {
            setPostsList(FALLBACK_POSTS);
          }
        }
      } catch (err) {
        if (isMounted) setPostsList(FALLBACK_POSTS);
      } finally {
        if (isMounted) setPostsLoading(false);
      }
    };
    fetchPosts();
    return () => { isMounted = false; };
  }, []);

  // State Form tiếp nhận nhu cầu kết nối (Gửi đến /api/leads)
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    city: 'Hưng Yên',
    serviceNeed: 'Tìm đối tác phù hợp',
    notes: '',
    agreeProcess: true,
    subscribeNewsletter: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Nạp sự kiện thật từ backend
  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        const res = await fetchJsonWithTimeout('/api/events?limit=4');
        if (isMounted) {
          if (res?.data && Array.isArray(res.data)) {
            setEventsList(res.data);
          }
        }
      } catch (err) {
        console.warn('Không có sự kiện từ backend:', err.message);
      } finally {
        if (isMounted) setEventsLoading(false);
      }
    };
    fetchEvents();
    return () => { isMounted = false; };
  }, []);

  // Xử lý tìm kiếm theo nhu cầu
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      let targetUrl = `/posts?search=${encodeURIComponent(searchQuery.trim())}`;
      if (activeSearchTab !== 'all') {
        targetUrl += `&type=${encodeURIComponent(activeSearchTab)}`;
      }
      navigate(targetUrl);
    } else {
      navigate('/posts');
    }
  };

  // Xử lý gửi Form Đăng ký tham gia mạng lưới (Gửi đến /api/leads)
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.companyName.trim()) {
      alert(currentLang === 'en' ? 'Please fill in Name, Phone, and Organization (*)' : 'Vui lòng điền Họ tên, Số điện thoại và Tên tổ chức/doanh nghiệp (*)');
      return;
    }
    if (!formData.agreeProcess) {
      alert(currentLang === 'en' ? 'Please agree to information processing for feedback' : 'Vui lòng đồng ý xử lý thông tin để bộ phận điều phối liên hệ phản hồi');
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          city: formData.city.trim(),
          companyName: formData.companyName.trim(),
          memberType: formData.serviceNeed,
          notes: `Nhóm nhu cầu: ${formData.serviceNeed}. Bản tin: ${formData.subscribeNewsletter ? 'Có nhận' : 'Không'}. Ghi chú: ${formData.notes.trim() || 'Không có'}`
        })
      });

      if (res.ok) {
        setFormSuccess(true);
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ. Vui lòng liên hệ hotline 0986 354 152.');
    } finally {
      setFormLoading(false);
    }
  };

  // Lọc điểm đến khám phá
  const filteredDestinations = exploreFilter === 'all' 
    ? EXPLORE_DESTINATIONS 
    : EXPLORE_DESTINATIONS.filter(d => d.type === exploreFilter);

  // Lọc danh sách bài viết theo chuyên mục
  const filteredPosts = postsList.filter((post) => {
    if (activePostCategory === 'all') return true;
    const cat = `${post.category || ''} ${post.sub_category || ''} ${post.title || ''}`.toLowerCase();
    if (activePostCategory === 'kinh-te') {
      return cat.includes('đầu tư') || cat.includes('kinh tế') || cat.includes('công nghiệp') || cat.includes('kcn') || cat.includes('doanh nghiệp');
    }
    if (activePostCategory === 'di-san') {
      return cat.includes('di sản') || cat.includes('văn hóa') || cat.includes('du lịch') || cat.includes('phố hiến') || cat.includes('làng nghề');
    }
    if (activePostCategory === 'ocop') {
      return cat.includes('ocop') || cat.includes('nông sản') || cat.includes('sản phẩm') || cat.includes('đặc sản') || cat.includes('nhãn');
    }
    return true;
  });

  const featuredPost = filteredPosts[0] || postsList[0];
  const sidePosts = filteredPosts.length > 1 ? filteredPosts.slice(1, 4) : postsList.slice(1, 4);
  const bottomPosts = filteredPosts.length > 4 ? filteredPosts.slice(4, 7) : (postsList.length > 4 ? postsList.slice(4, 7) : []);

  return (
    <div className="hy-home-wrapper">
      <SEOHead 
        title={`${brandConfig.brandName} — ${brandConfig.slogan}`}
        description={brandConfig.description}
      />
      <Navbar />

      <main id="main-content">
        {/* =========================================================================
            KHU VỰC 1: KHỐI MỞ ĐẦU (HERO SECTION)
            ========================================================================= */}
        <section className="hy-hero-section">
          <div className="hy-hero-content">
            <div className="hy-hero-badge">
              <i className="ti ti-sparkles" /> Nền tảng Tích hợp AI • ADT Quốc tế
            </div>
            <h1 className="hy-hero-title">
              Hưng Yên <span>Today</span>
            </h1>
            <div className="hy-hero-tagline">
              {brandConfig.slogan}
            </div>
            <p className="hy-hero-desc">
              Khám phá di sản, kết nối doanh nghiệp và mở rộng cơ hội hợp tác tại Hưng Yên trên nền tảng tích hợp AI.
            </p>
            <div className="hy-hero-actions">
              <a href="#kham-pha" className="hy-btn-primary">
                <i className="ti ti-compass" />
                <span>Khám phá Hưng Yên</span>
              </a>
              <a href="#dang-ky-mang-luoi" className="hy-btn-secondary">
                <i className="ti ti-briefcase" />
                <span>Tìm đối tác phù hợp</span>
              </a>
            </div>
          </div>
        </section>

        <div className="hy-container">
          {/* =========================================================================
              KHU VỰC 2: TÌM KIẾM THEO NHU CẦU
              ========================================================================= */}
          <section className="hy-search-section">
            <div className="hy-search-box">
              <div className="hy-search-tabs">
                <button
                  type="button"
                  className={`hy-search-tab-btn ${activeSearchTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab('all')}
                >
                  <i className="ti ti-grid-dots" /> Tất cả nhu cầu
                </button>
                <button
                  type="button"
                  className={`hy-search-tab-btn ${activeSearchTab === 'destination' ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab('destination')}
                >
                  <i className="ti ti-map-pin" /> Điểm đến
                </button>
                <button
                  type="button"
                  className={`hy-search-tab-btn ${activeSearchTab === 'enterprise' ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab('enterprise')}
                >
                  <i className="ti ti-building" /> Doanh nghiệp
                </button>
                <button
                  type="button"
                  className={`hy-search-tab-btn ${activeSearchTab === 'product' ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab('product')}
                >
                  <i className="ti ti-package" /> Sản phẩm
                </button>
                <button
                  type="button"
                  className={`hy-search-tab-btn ${activeSearchTab === 'opportunity' ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab('opportunity')}
                >
                  <i className="ti ti-target" /> Cơ hội
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="hy-search-form">
                <div className="hy-search-input-wrapper">
                  <i className="ti ti-search" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Bạn muốn tìm điểm đến, doanh nghiệp, sản phẩm hay cơ hội hợp tác?"
                    className="hy-search-input"
                  />
                </div>
                <button type="submit" className="hy-search-submit">
                  <span>Tìm kiếm</span>
                  <i className="ti ti-arrow-right" />
                </button>
              </form>
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 3: GIỚI THIỆU NỀN TẢNG
              ========================================================================= */}
          <section className="hy-intro-card">
            <div className="hy-intro-title">
              Một địa chỉ để <span>khám phá và kết nối</span> Hưng Yên
            </div>
            <p className="hy-intro-text">
              Hưng Yên Today kết nối câu chuyện địa phương với doanh nghiệp, sản phẩm, sự kiện và những người đang tìm cơ hội hợp tác. Dữ liệu được tổ chức để dễ tìm kiếm; AI hỗ trợ gợi ý, còn mỗi kết nối quan trọng đều có đầu mối tiếp nhận.
            </p>
            <div className="hy-intro-highlights">
              <div className="hy-intro-item">
                <div className="hy-intro-item-icon"><i className="ti ti-database" /></div>
                <div className="hy-intro-item-text">
                  <strong>Dữ liệu chuẩn hóa</strong>
                  <span>Thông tin có nguồn xác thực và cập nhật thường xuyên</span>
                </div>
              </div>
              <div className="hy-intro-item">
                <div className="hy-intro-item-icon"><i className="ti ti-robot" /></div>
                <div className="hy-intro-item-text">
                  <strong>Trợ lý AI địa phương</strong>
                  <span>Tích hợp giải pháp AI gợi ý và tra cứu 24/7</span>
                </div>
              </div>
              <div className="hy-intro-item">
                <div className="hy-intro-item-icon"><i className="ti ti-headset" /></div>
                <div className="hy-intro-item-text">
                  <strong>Đầu mối tiếp nhận</strong>
                  <span>Mỗi yêu cầu kết nối đều có người đồng hành hỗ trợ</span>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 4: SÁU TRỤ CỘT PHÁT TRIỂN
              ========================================================================= */}
          <section className="hy-section">
            <div className="hy-section-header">
              <span className="hy-section-badge">Định hướng chiến lược</span>
              <h2 className="hy-section-title">Sáu Trụ Cột Phát Triển Hưng Yên</h2>
              <p className="hy-section-desc">
                Không gian kinh tế, văn hóa và đổi mới sáng tạo toàn tỉnh kết nối trong một nền tảng thống nhất.
              </p>
            </div>

            <div className="hy-pillars-grid">
              {SIX_PILLARS.map((pillar) => (
                <Link
                  key={pillar.id}
                  to={`/posts?category=${encodeURIComponent(pillar.category)}&subCategory=${encodeURIComponent(pillar.subCategory)}`}
                  className="hy-pillar-card"
                >
                  <div className="hy-pillar-img-box">
                    <img src={pillar.img} alt={pillar.title} className="hy-pillar-img" loading="lazy" />
                    <span className="hy-pillar-tag">{pillar.tag}</span>
                  </div>
                  <div className="hy-pillar-body">
                    <h3 className="hy-pillar-title">{pillar.title}</h3>
                    <p className="hy-pillar-desc">{pillar.desc}</p>
                    <div className="hy-pillar-link">
                      <span>Xem chuyên mục</span>
                      <i className="ti ti-arrow-right" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* =========================================================================
            KHU VỰC BÀI VIẾT TIÊU ĐIỂM & ĐIỂM TIN MỚI (BENTO SPOTLIGHT)
            Nổi bật bài viết mới, phong cách hiện đại Bento Box Magazine
            ========================================================================= */}
        <section className="hy-posts-section">
          <div className="hy-container">
            <div className="hy-posts-header">
              <div>
                <span className="hy-section-badge">Bản tin & Tiêu điểm</span>
                <h2 className="hy-section-title">Điểm Tin Mới & Bài Viết Nổi Bật</h2>
                <p className="hy-section-desc">
                  Cập nhật chuyển động kinh tế, xúc tiến đầu tư, nhịp sống di sản và nông sản đặc sắc Hưng Yên.
                </p>
                <div className="hy-posts-filter-tabs">
                  <button
                    type="button"
                    className={`hy-post-pill-btn ${activePostCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActivePostCategory('all')}
                  >
                    <i className="ti ti-layout-grid" /> Tất cả bài viết
                  </button>
                  <button
                    type="button"
                    className={`hy-post-pill-btn ${activePostCategory === 'kinh-te' ? 'active' : ''}`}
                    onClick={() => setActivePostCategory('kinh-te')}
                  >
                    <i className="ti ti-chart-line" /> Kinh tế & Đầu tư
                  </button>
                  <button
                    type="button"
                    className={`hy-post-pill-btn ${activePostCategory === 'di-san' ? 'active' : ''}`}
                    onClick={() => setActivePostCategory('di-san')}
                  >
                    <i className="ti ti-building-monument" /> Di sản & Văn hóa
                  </button>
                  <button
                    type="button"
                    className={`hy-post-pill-btn ${activePostCategory === 'ocop' ? 'active' : ''}`}
                    onClick={() => setActivePostCategory('ocop')}
                  >
                    <i className="ti ti-leaf" /> Nông sản & OCOP
                  </button>
                </div>
              </div>

              <Link to="/posts" className="hy-posts-view-all-btn">
                <span>Xem toàn bộ bài viết</span>
                <i className="ti ti-arrow-right" />
              </Link>
            </div>

            {/* Bento Grid */}
            {featuredPost && (
              <div className="hy-posts-bento-grid">
                {/* Cột Trái: Spotlight Hero Card */}
                <Link 
                  to={featuredPost.slug ? `/posts/${featuredPost.slug}` : `/posts/${featuredPost.id || featuredPost._id || ''}`} 
                  className="hy-post-spotlight-card"
                >
                  <div className="hy-post-spotlight-img-wrap">
                    <img 
                      src={featuredPost.image_url || featuredPost.cover_image || featuredPost.img || featuredPost.image || '/images/hungyen/hungyen_kcn_thang_long.jpg'} 
                      alt={featuredPost.title} 
                      className="hy-post-spotlight-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="hy-post-spotlight-overlay" />
                  <div className="hy-post-spotlight-content">
                    <div className="hy-post-spotlight-badges">
                      <span className="hy-post-cat-badge">
                        {featuredPost.sub_category || featuredPost.category || 'Tiêu Điểm'}
                      </span>
                      <span className="hy-post-trending-badge">
                        <i className="ti ti-flame" /> MỚI NHẤT
                      </span>
                    </div>
                    <h3 className="hy-post-spotlight-title">{featuredPost.title}</h3>
                    <p className="hy-post-spotlight-desc">
                      {featuredPost.summary || featuredPost.excerpt || featuredPost.desc}
                    </p>
                    <div className="hy-post-spotlight-footer">
                      <span>
                        <i className="ti ti-user" /> {featuredPost.author_name || featuredPost.author || 'Ban Biên Tập'} • {featuredPost.created_at ? new Date(featuredPost.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật'}
                      </span>
                      <span className="hy-post-read-cta">
                        Đọc bài viết <i className="ti ti-arrow-right" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Cột Phải: Side Stack */}
                <div className="hy-posts-side-stack">
                  {sidePosts.map((post, idx) => (
                    <Link 
                      key={post.id || post._id || idx} 
                      to={post.slug ? `/posts/${post.slug}` : `/posts/${post.id || post._id || idx}`} 
                      className="hy-post-side-card"
                    >
                      <div className="hy-post-side-thumb">
                        <img 
                          src={post.image_url || post.cover_image || post.img || post.image || '/images/hungyen/hungyen_nhan_long.jpg'} 
                          alt={post.title} 
                          loading="lazy"
                        />
                      </div>
                      <div className="hy-post-side-info">
                        <span className="hy-post-side-cat">
                          {post.sub_category || post.category || 'Tin tức'}
                        </span>
                        <h4 className="hy-post-side-title">{post.title}</h4>
                        <div className="hy-post-side-meta">
                          <span>
                            <i className="ti ti-calendar" /> {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Hôm nay'}
                          </span>
                          <span>
                            <i className="ti ti-eye" /> {post.views ? post.views.toLocaleString() : '1,200'} xem
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Hàng Dưới: Mini Cards */}
            {bottomPosts.length > 0 && (
              <div className="hy-posts-bottom-row">
                {bottomPosts.map((post, idx) => (
                  <Link 
                    key={post.id || post._id || idx} 
                    to={post.slug ? `/posts/${post.slug}` : `/posts/${post.id || post._id || idx}`} 
                    className="hy-post-mini-card"
                  >
                    <div className="hy-post-mini-thumb">
                      <img 
                        src={post.image_url || post.cover_image || post.img || post.image || '/images/hungyen/hungyen_den_mau.jpg'} 
                        alt={post.title} 
                        loading="lazy"
                      />
                    </div>
                    <div className="hy-post-mini-body">
                      <span className="hy-post-side-cat">
                        {post.sub_category || post.category || 'Khám phá'}
                      </span>
                      <h4 className="hy-post-mini-title">{post.title}</h4>
                      <p className="hy-post-mini-desc">
                        {post.summary || post.excerpt || post.desc}
                      </p>
                      <div className="hy-post-side-meta" style={{ marginTop: 'auto' }}>
                        <span>
                          <i className="ti ti-calendar" /> {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                        </span>
                        <span>
                          <i className="ti ti-eye" /> {post.views ? post.views.toLocaleString() : '850'} xem
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="hy-container">
          {/* =========================================================================
              KHU VỰC 5: KHÁM PHÁ HƯNG YÊN (DI SẢN, LÀNG NGHỀ, ẨM THỰC, SINH THÁI)
              ========================================================================= */}
          <section id="kham-pha" className="hy-section">
            <div className="hy-section-header">
              <span className="hy-section-badge">Hành trình trải nghiệm</span>
              <h2 className="hy-section-title">Khám Phá Di Sản & Điểm Đến Hưng Yên</h2>
              <p className="hy-section-desc">
                Tìm một hành trình phù hợp với thời gian và sở thích của bạn, từ câu chuyện di sản Phố Hiến đến đời sống làng nghề và sinh thái ven biển.
              </p>
            </div>

            <div className="hy-explore-filter">
              <button
                type="button"
                className={`hy-filter-btn ${exploreFilter === 'all' ? 'active' : ''}`}
                onClick={() => setExploreFilter('all')}
              >
                Tất cả điểm đến
              </button>
              <button
                type="button"
                className={`hy-filter-btn ${exploreFilter === 'heritage' ? 'active' : ''}`}
                onClick={() => setExploreFilter('heritage')}
              >
                Di sản Phố Hiến
              </button>
              <button
                type="button"
                className={`hy-filter-btn ${exploreFilter === 'craft' ? 'active' : ''}`}
                onClick={() => setExploreFilter('craft')}
              >
                Làng nghề truyền thống
              </button>
              <button
                type="button"
                className={`hy-filter-btn ${exploreFilter === 'cuisine' ? 'active' : ''}`}
                onClick={() => setExploreFilter('cuisine')}
              >
                Ẩm thực & Đặc sản
              </button>
              <button
                type="button"
                className={`hy-filter-btn ${exploreFilter === 'eco' ? 'active' : ''}`}
                onClick={() => setExploreFilter('eco')}
              >
                Sinh thái & Ven biển
              </button>
            </div>

            <div className="hy-dest-grid">
              {filteredDestinations.map((dest) => (
                <div key={dest.id} className="hy-dest-card">
                  <div className="hy-dest-thumb">
                    <img src={dest.img} alt={dest.title} loading="lazy" />
                    <span className="hy-dest-category-badge">{dest.typeLabel}</span>
                  </div>
                  <div className="hy-dest-body">
                    <div className="hy-dest-loc">
                      <i className="ti ti-map-pin" />
                      <span>{dest.location}</span>
                    </div>
                    <h3 className="hy-dest-title">{dest.title}</h3>
                    <p className="hy-dest-desc">{dest.desc}</p>
                    <div className="hy-dest-footer">
                      <Link 
                        to={`/posts?search=${encodeURIComponent(dest.title)}`} 
                        className="hy-dest-btn"
                      >
                        <span>Xem chi tiết</span>
                        <i className="ti ti-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 6: DOANH NGHIỆP & SẢN PHẨM OCOP
              ========================================================================= */}
          <section className="hy-section">
            <div className="hy-section-header">
              <span className="hy-section-badge">Mạng lưới kinh tế</span>
              <h2 className="hy-section-title">Doanh Nghiệp & Sản Phẩm Tiêu Biểu</h2>
              <p className="hy-section-desc">
                Đưa năng lực sản xuất, chuỗi cung ứng và sản vật OCOP Hưng Yên đến đúng đối tác trong nước và quốc tế.
              </p>
            </div>

            {/* Khối lời mời đăng ký hồ sơ doanh nghiệp */}
            <div className="hy-enterprise-cta-card">
              <div className="hy-enterprise-cta-text">
                <h3>Đưa năng lực doanh nghiệp đến đúng đối tác</h3>
                <p>Đăng ký hồ sơ số trên HungYen.today để được nhận diện năng lực và tiếp nhận cơ hội hợp tác minh bạch.</p>
              </div>
              <Link to="/register" className="hy-btn-primary">
                <i className="ti ti-id-badge-2" />
                <span>Đăng ký hồ sơ doanh nghiệp</span>
              </Link>
            </div>

            {/* Lưới sản phẩm OCOP & Đặc sản */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--hy-text-main)' }}>
                Sản phẩm OCOP & Đặc sản có nguồn gốc xác thực
              </h3>
              <Link to="/posts?category=Doanh nghiệp & Sản phẩm" style={{ color: 'var(--hy-primary)', fontWeight: '700', textDecoration: 'none', fontSize: '14px' }}>
                Xem tất cả sản phẩm →
              </Link>
            </div>

            <div className="hy-products-grid">
              {OCOP_PRODUCTS.map((prod, idx) => (
                <div key={idx} className="hy-product-card">
                  <img src={prod.img} alt={prod.name} className="hy-product-img" loading="lazy" />
                  <div className="hy-product-body">
                    <span className="hy-product-badge">{prod.category}</span>
                    <h4 className="hy-product-title">{prod.name}</h4>
                    <p className="hy-product-desc">{prod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 7: CƠ HỘI HỢP TÁC VÀ ĐẦU TƯ
              ========================================================================= */}
          <section className="hy-section">
            <div className="hy-section-header">
              <span className="hy-section-badge">Xúc tiến thương mại</span>
              <h2 className="hy-section-title">Kết Nối Nhu Cầu Với Nguồn Lực Phù Hợp</h2>
              <p className="hy-section-desc">
                Cập nhật các cơ hội đầu tư hạ tầng, tìm nhà cung cấp và kết nối giao thương có nguồn xác thực.
              </p>
            </div>

            <div className="hy-opp-grid">
              {INVESTMENT_OPPORTUNITIES.map((opp, idx) => (
                <div key={idx} className="hy-opp-card">
                  <span className={`hy-opp-type-badge badge-${opp.type}`}>
                    {opp.typeLabel}
                  </span>
                  <h3 className="hy-opp-title">{opp.title}</h3>
                  <p className="hy-opp-content">{opp.desc}</p>
                  <div className="hy-opp-meta">
                    <span>Đơn vị: <strong>{opp.provider}</strong></span>
                    <span>{opp.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 8: SỰ KIỆN & DIỄN ĐÀN TRỌNG ĐIỂM
              ========================================================================= */}
          <section className="hy-section">
            <div className="hy-section-header">
              <span className="hy-section-badge">Kết nối trực tiếp</span>
              <h2 className="hy-section-title">Sự Kiện & Diễn Đàn</h2>
              <p className="hy-section-desc">
                Các hoạt động hội thảo, xúc tiến thương mại và kết nối B2B chính thức.
              </p>
            </div>

            {eventsList.length > 0 ? (
              <div className="hy-opp-grid">
                {eventsList.map((evt) => (
                  <div key={evt.id} className="hy-opp-card">
                    <span className="hy-opp-type-badge badge-partner">Sự kiện chính thức</span>
                    <h3 className="hy-opp-title">{evt.title}</h3>
                    <p className="hy-opp-content">{evt.summary || evt.description}</p>
                    <div className="hy-opp-meta">
                      <span>Thời gian: {evt.start_time ? new Date(evt.start_time).toLocaleDateString('vi-VN') : 'Sắp diễn ra'}</span>
                      <Link to={`/events/${evt.slug || evt.id}`} style={{ color: 'var(--hy-primary)', fontWeight: '750' }}>
                        Xem và đăng ký →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Hiển thị trạng thái phù hợp theo quy chuẩn tài liệu, không dùng lịch giả */
              <div className="hy-event-banner-empty">
                <i className="ti ti-calendar-time" />
                <h3>Các hoạt động kết nối đang được chuẩn bị</h3>
                <p>
                  Lịch hội nghị xúc tiến đầu tư và diễn đàn kết nối doanh nghiệp năm 2026 đang được cập nhật cùng các cơ quan ban ngành và đối tác địa phương.
                </p>
                <a href="#dang-ky-mang-luoi" className="hy-btn-primary">
                  <i className="ti ti-bell-ringing" />
                  <span>Đăng ký nhận thông báo sự kiện</span>
                </a>
              </div>
            )}
          </section>

          {/* =========================================================================
              KHU VỰC 9: AI CENTER CỦA HƯNG YÊN TODAY
              ========================================================================= */}
          <section className="hy-ai-section">
            <div className="hy-ai-header">
              <div className="hy-ai-badge">
                <i className="ti ti-sparkles" /> Trí tuệ Nhân tạo Hưng Yên Today
              </div>
              <h2 className="hy-ai-title">
                Bắt đầu từ <span>điều bạn đang cần</span>
              </h2>
              <p className="hy-ai-desc">
                Trợ lý AI hỗ trợ tra cứu thông tin di sản, gợi ý đối tác và hỗ trợ thao tác trên nền tảng theo kho tri thức địa phương đã được xác minh.
              </p>
            </div>

            <div className="hy-ai-prompts-grid">
              <button
                type="button"
                className="hy-ai-prompt-btn"
                onClick={() => navigate('/ai-chat?q=Tôi muốn khám phá Hưng Yên cuối tuần')}
              >
                <i className="ti ti-compass" />
                <span>“Tôi muốn khám phá Hưng Yên cuối tuần”</span>
              </button>
              <button
                type="button"
                className="hy-ai-prompt-btn"
                onClick={() => navigate('/ai-chat?q=Tôi cần tìm nhà cung cấp phù hợp tại Hưng Yên')}
              >
                <i className="ti ti-building" />
                <span>“Tôi cần tìm nhà cung cấp phù hợp”</span>
              </button>
              <button
                type="button"
                className="hy-ai-prompt-btn"
                onClick={() => navigate('/ai-chat?q=Tôi muốn giới thiệu doanh nghiệp và sản phẩm lên nền tảng')}
              >
                <i className="ti ti-id-badge-2" />
                <span>“Tôi muốn giới thiệu doanh nghiệp”</span>
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/ai-chat" className="hy-btn-primary" style={{ display: 'inline-flex' }}>
                <i className="ti ti-messages" />
                <span>Mở Trợ lý AI Hưng Yên chuyên sâu</span>
              </Link>
            </div>

            <div className="hy-ai-notice">
              💡 <strong>Lưu ý:</strong> Trợ lý AI hỗ trợ tìm thông tin và gợi ý theo dữ liệu được cung cấp. Thông tin quan trọng về pháp lý, quy hoạch và thủ tục đầu tư cần được kiểm tra qua nguồn chính thức và các đầu mối liên quan.
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 10: BANNER GIẢI PHÁP AI CỦA ADT (MỤC 3 BẮT BUỘC THEO TÀI LIỆU)
              ========================================================================= */}
          <section className="hy-adt-banner-section">
            <div className="hy-adt-title-banner">
              <span className="hy-section-badge">Hệ sinh thái Công nghệ ADT Group</span>
              <h2 className="hy-adt-heading">LÀM CHỦ AI – BỨT PHÁ TƯƠNG LAI</h2>
              <p className="hy-adt-subheading">
                Các giải pháp trí tuệ nhân tạo chuyên biệt được phát triển bởi Công ty Cổ phần ADT Quốc tế đồng hành cùng chính quyền, doanh nghiệp và giáo dục.
              </p>
            </div>

            <div className="hy-adt-grid-3">
              {/* Thẻ 1: Trợ lý AI phường xã */}
              <div className="hy-adt-card">
                <div className="hy-adt-thumb-169">
                  <img
                    src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80"
                    alt="Bộ đôi Trợ lý AI phường xã đạt giải Nhì Hà Nội 2025"
                    loading="lazy"
                  />
                  <span className="hy-adt-badge-source">Nguồn: ADT Group</span>
                  <span className="hy-adt-badge-sector">Chính quyền & Cơ sở</span>
                </div>
                <div className="hy-adt-body">
                  <h3 className="hy-adt-card-title">Trợ lý AI phường xã</h3>
                  <p className="hy-adt-card-desc">
                    Hỗ trợ cán bộ tra cứu, soạn thảo và xử lý công việc; hỗ trợ người dân tiếp cận thông tin thủ tục theo dữ liệu chuyên biệt được cung cấp.
                  </p>
                  <a
                    href="https://www.adtgroup.net/bo-doi-tro-ly-ai-phuong-xa-dat-giai-nhi-ha-noi-2025"
                    target="_blank"
                    rel="noreferrer"
                    className="hy-adt-btn"
                    aria-label="Tìm hiểu giải pháp Trợ lý AI phường xã (mở tab mới)"
                  >
                    <span>Tìm hiểu giải pháp</span>
                    <i className="ti ti-external-link" />
                  </a>
                </div>
              </div>

              {/* Thẻ 2: ORION */}
              <div className="hy-adt-card">
                <div className="hy-adt-thumb-169">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                    alt="Nền tảng ORION AI Agent quản trị doanh nghiệp"
                    loading="lazy"
                  />
                  <span className="hy-adt-badge-source">Nguồn: ADT Group</span>
                  <span className="hy-adt-badge-sector">Quản trị Doanh nghiệp</span>
                </div>
                <div className="hy-adt-body">
                  <h3 className="hy-adt-card-title">ORION</h3>
                  <p className="hy-adt-card-desc">
                    Nền tảng quản trị doanh nghiệp tích hợp AI, kết nối hoạt động bán hàng, AI Auto Marketing, AI Center và quản lý theo phạm vi giải pháp triển khai.
                  </p>
                  <a
                    href="https://www.adtgroup.net/orion-nen-tang-ai-agent-quan-tri-doanh-nghiep"
                    target="_blank"
                    rel="noreferrer"
                    className="hy-adt-btn"
                    aria-label="Tìm hiểu giải pháp Nền tảng ORION (mở tab mới)"
                  >
                    <span>Tìm hiểu giải pháp</span>
                    <i className="ti ti-external-link" />
                  </a>
                </div>
              </div>

              {/* Thẻ 3: Edunow.AI */}
              <div className="hy-adt-card">
                <div className="hy-adt-thumb-169">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                    alt="Edunow.AI giải pháp ứng dụng AI cho việc tuyển sinh"
                    loading="lazy"
                  />
                  <span className="hy-adt-badge-source">Nguồn: ADT Group</span>
                  <span className="hy-adt-badge-sector">Giáo dục & Tuyển sinh</span>
                </div>
                <div className="hy-adt-body">
                  <h3 className="hy-adt-card-title">Edunow.AI</h3>
                  <p className="hy-adt-card-desc">
                    Giải pháp ứng dụng AI hỗ trợ tư vấn tuyển sinh, cung cấp thông tin chương trình học và tiếp nhận nhu cầu của người học theo dữ liệu nhà trường.
                  </p>
                  <a
                    href="https://www.adtgroup.net/edunow-ai-giai-phap-ung-dung-ai-cho-viec-tuyen-sinh"
                    target="_blank"
                    rel="noreferrer"
                    className="hy-adt-btn"
                    aria-label="Tìm hiểu giải pháp Edunow.AI (mở tab mới)"
                  >
                    <span>Tìm hiểu giải pháp</span>
                    <i className="ti ti-external-link" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 11: CỘNG ĐỒNG HƯNG YÊN
              ========================================================================= */}
          <section className="hy-section">
            <div className="hy-section-header">
              <span className="hy-section-badge">Kết nối nguồn lực</span>
              <h2 className="hy-section-title">Cùng Xây Dựng Một Hưng Yên Kết Nối</h2>
              <p className="hy-section-desc">
                Chào đón các tổ chức, doanh nghiệp, chuyên gia và người Hưng Yên cùng đóng góp và phát triển mạng lưới.
              </p>
            </div>

            <div className="hy-community-grid">
              <div className="hy-community-card">
                <div className="hy-community-icon"><i className="ti ti-building" /></div>
                <h3 className="hy-community-title">Doanh nghiệp & HTX</h3>
                <p className="hy-community-desc">
                  Mở showroom số, quảng bá năng lực sản xuất, kết nối chuỗi cung ứng và tham gia các phiên giao thương định kỳ.
                </p>
                <Link to="/register" className="hy-dest-btn">Đăng ký tham gia →</Link>
              </div>

              <div className="hy-community-card">
                <div className="hy-community-icon"><i className="ti ti-school" /></div>
                <h3 className="hy-community-title">Chuyên gia & Cố vấn</h3>
                <p className="hy-community-desc">
                  Chia sẻ kiến thức chuyên môn, đồng hành tư vấn đổi mới sáng tạo, chuyển đổi số và nâng cao năng lực địa phương.
                </p>
                <a href="#dang-ky-mang-luoi" className="hy-dest-btn">Gửi đề xuất cố vấn →</a>
              </div>

              <div className="hy-community-card">
                <div className="hy-community-icon"><i className="ti ti-world" /></div>
                <h3 className="hy-community-title">Người Hưng Yên xa quê</h3>
                <p className="hy-community-desc">
                  Cầu nối thị trường, kết nối cơ hội thương mại, đóng góp sáng kiến và cùng chăm sóc các giá trị di sản quê hương.
                </p>
                <a href="#dang-ky-mang-luoi" className="hy-dest-btn">Tham gia mạng lưới →</a>
              </div>

              <div className="hy-community-card">
                <div className="hy-community-icon"><i className="ti ti-edit" /></div>
                <h3 className="hy-community-title">Cộng tác viên nội dung</h3>
                <p className="hy-community-desc">
                  Cùng chia sẻ câu chuyện di sản, hình ảnh văn hóa, sản vật làng nghề và lan tỏa thông tin tích cực về Hưng Yên.
                </p>
                <a href="#dang-ky-mang-luoi" className="hy-dest-btn">Đăng ký cộng tác →</a>
              </div>
            </div>
          </section>

          {/* =========================================================================
              KHU VỰC 12: ĐĂNG KÝ THAM GIA / FORM LEADS TIẾP NHẬN (ANCHOR #dang-ky-mang-luoi)
              ========================================================================= */}
          <section id="dang-ky-mang-luoi" className="hy-section" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div className="hy-section-header">
              <span className="hy-section-badge">Gửi thông tin kết nối</span>
              <h2 className="hy-section-title">Đăng Ký Tham Gia & Gửi Nhu Cầu Hợp Tác</h2>
              <p className="hy-section-desc">
                Điền thông tin để được bộ phận điều phối liên hệ và kết nối đến đúng nguồn lực phù hợp trong 24 giờ.
              </p>
            </div>

            <div className="hy-form-card">
              {formSuccess ? (
                <div className="hy-form-success">
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Đã tiếp nhận thông tin kết nối thành công!</h3>
                  <p style={{ margin: 0 }}>
                    Hệ thống HungYen.today đã chuyển yêu cầu đến bộ phận chuyên trách. Chúng tôi sẽ liên hệ lại với quý vị theo kênh thông tin đã cung cấp.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSuccess(false)}
                    className="hy-btn-primary"
                    style={{ marginTop: '1.25rem', padding: '10px 24px', fontSize: '14px' }}
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit}>
                  <div className="hy-form-grid">
                    <div className="hy-form-group">
                      <label className="hy-form-label">Họ và tên người liên hệ <span>*</span></label>
                      <input
                        type="text"
                        required
                        className="hy-form-control"
                        placeholder="Nguyễn Văn A"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">Tên tổ chức / Doanh nghiệp <span>*</span></label>
                      <input
                        type="text"
                        required
                        className="hy-form-control"
                        placeholder="Công ty TNHH / HTX..."
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">Số điện thoại liên hệ <span>*</span></label>
                      <input
                        type="tel"
                        required
                        className="hy-form-control"
                        placeholder="0986 xxx xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">Địa chỉ Email</label>
                      <input
                        type="email"
                        className="hy-form-control"
                        placeholder="lienhe@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">Tỉnh / Thành phố</label>
                      <input
                        type="text"
                        className="hy-form-control"
                        placeholder="Hưng Yên, Hà Nội..."
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">Nhóm nhu cầu kết nối <span>*</span></label>
                      <select
                        className="hy-form-control"
                        value={formData.serviceNeed}
                        onChange={(e) => setFormData({ ...formData, serviceNeed: e.target.value })}
                      >
                        <option value="Tìm đối tác phù hợp">Tìm đối tác phù hợp</option>
                        <option value="Tìm nhà cung cấp">Tìm nhà cung cấp</option>
                        <option value="Đăng ký hồ sơ doanh nghiệp">Đăng ký hồ sơ doanh nghiệp</option>
                        <option value="Tìm hiểu môi trường đầu tư">Tìm hiểu môi trường đầu tư</option>
                        <option value="Đóng góp chuyên môn & Cộng đồng">Đóng góp chuyên môn & Cộng đồng</option>
                        <option value="Trải nghiệm du lịch & Di sản">Trải nghiệm du lịch & Di sản</option>
                      </select>
                    </div>

                    <div className="hy-form-group full">
                      <label className="hy-form-label">Mô tả ngắn gọn nhu cầu hoặc câu hỏi</label>
                      <textarea
                        className="hy-form-control"
                        placeholder="Vui lòng nêu rõ lĩnh vực quan tâm, quy mô dự kiến hoặc nội dung cần phối hợp..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="hy-form-checkbox-group">
                    <label className="hy-form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.agreeProcess}
                        onChange={(e) => setFormData({ ...formData, agreeProcess: e.target.checked })}
                        required
                      />
                      <span>
                        Tôi đồng ý để HungYen.today xử lý thông tin trên nhằm mục đích liên hệ phản hồi và hỗ trợ kết nối. <span>*</span>
                      </span>
                    </label>

                    <label className="hy-form-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.subscribeNewsletter}
                        onChange={(e) => setFormData({ ...formData, subscribeNewsletter: e.target.checked })}
                      />
                      <span>
                        Đăng ký nhận bản tin tổng hợp cơ hội đầu tư, sự kiện và tin tức Hưng Yên định kỳ qua Email.
                      </span>
                    </label>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="hy-btn-primary"
                      style={{ padding: '14px 42px', fontSize: '16px' }}
                    >
                      {formLoading ? (
                        <>
                          <i className="ti ti-loader ti-spin" />
                          <span>Đang gửi thông tin...</span>
                        </>
                      ) : (
                        <>
                          <i className="ti ti-send" />
                          <span>Gửi đăng ký kết nối</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <FloatingAIBot />
    </div>
  );
};

export default Home;
