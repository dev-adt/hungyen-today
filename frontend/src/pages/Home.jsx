import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingAIBot from '../components/FloatingAIBot';
import SEOHead from '../components/SEOHead';
import brandConfig from '../brand.config';
import { fetchJsonWithTimeout, FALLBACK_POSTS, FALLBACK_EVENTS, FALLBACK_MEMBERS } from '../utils/api';
import './HomeHungYen.css';

// TOP 9 KHU CÔNG NGHIỆP TIÊU BIỂU HƯNG YÊN (THUẦN THÔNG TIN, TOP 3 NỔI BẬT HƠN)
const TOP_INDUSTRIAL_PARKS = [
  {
    id: 'kcn-thang-long-2',
    name: 'Khu Công Nghiệp Thăng Long II (TLIP II)',
    location: 'Thị xã Mỹ Hào & Huyện Yên Mỹ (Trục QL5)',
    acreage: '525 ha',
    occupancy: 'Lấp đầy >85%',
    tag: 'Chuẩn sinh thái Tập đoàn Sumitomo Nhật Bản',
    desc: 'KCN sinh thái kiểu mẫu hàng đầu miền Bắc do Tập đoàn Sumitomo (Nhật Bản) phát triển, cứ điểm quy tụ hàng loạt tập đoàn công nghệ cao toàn cầu như Panasonic, Toto, Daikin, Canon, Kyocera.',
    focus: 'Điện tử viễn thông, linh kiện bán dẫn, cơ khí chính xác, thiết bị ô tô & công nghệ cao.'
  },
  {
    id: 'kcn-pho-noi-a',
    name: 'Khu Công Nghiệp Phố Nối A',
    location: 'Huyện Văn Lâm & Thị xã Mỹ Hào',
    acreage: '600 ha',
    occupancy: 'Lấp đầy >90%',
    tag: 'Cửa ngõ kết nối kinh tế Hà Nội - Hải Phòng',
    desc: 'Cứ điểm công nghiệp quy mô lớn nhất tỉnh, nằm ở cửa ngõ kết nối Hà Nội - Hải Phòng, hạ tầng kỹ thuật đồng bộ, trung tâm kho vận và chuỗi cung ứng liên vùng hiện đại.',
    focus: 'Cơ khí chế tạo, điện - điện tử, vật liệu mới, kho bãi logistics & bao bì thông minh.'
  },
  {
    id: 'kcn-yen-my-2',
    name: 'Khu Công Nghiệp Yên Mỹ II & Yên Mỹ',
    location: 'Huyện Yên Mỹ (Nút giao Cao tốc HN - HP)',
    acreage: '313 ha',
    occupancy: 'Trọng điểm thu hút FDI',
    tag: 'Nút giao cao tốc chiến lược & Quỹ đất sạch',
    desc: 'Nằm ngay nút giao chiến lược của cao tốc Hà Nội - Hải Phòng, sẵn sàng quỹ đất sạch đón đầu các dự án công nghệ phụ trợ, thiết bị y tế và năng lượng sạch thế hệ mới.',
    focus: 'Công nghiệp phụ trợ, thiết bị y tế cao cấp, năng lượng sạch & tự động hóa hiện đại.'
  }
];

const NEXT_INDUSTRIAL_PARKS = [
  {
    id: 'kcn-sach-viet-han',
    name: 'KCN Sạch Hưng Yên (Khu Hợp tác Việt - Hàn)',
    location: 'Huyện Ân Thi & Huyện Yên Mỹ',
    scale: '143 ha',
    industry: 'Tập đoàn LH Hàn Quốc'
  },
  {
    id: 'kcn-so-5',
    name: 'KCN Số 5 Hưng Yên',
    location: 'Huyện Ân Thi & Huyện Kim Động',
    scale: '192,6 ha',
    industry: 'Logistics & Công nghiệp sinh thái'
  },
  {
    id: 'kcn-so-3',
    name: 'KCN Số 3 Hưng Yên',
    location: 'Huyện Yên Mỹ & Huyện Khoái Châu',
    scale: '159 ha',
    industry: 'Đa ngành công nghệ sạch'
  },
  {
    id: 'kcn-pho-noi-b',
    name: 'KCN Dệt may Phố Nối (Phố Nối B)',
    location: 'Thị xã Mỹ Hào & Huyện Yên Mỹ',
    scale: '121 ha',
    industry: 'Thời trang & Dệt kỹ thuật cao'
  },
  {
    id: 'kcn-minh-duc',
    name: 'KCN Minh Đức',
    location: 'Phường Minh Đức, Thị xã Mỹ Hào',
    scale: '198 ha',
    industry: 'Cơ khí lắp ráp & Vật liệu mới'
  },
  {
    id: 'kcn-kim-dong',
    name: 'KCN Kim Động',
    location: 'Huyện Kim Động',
    scale: '100 ha',
    industry: 'Chế biến sạch & Kho vận liên vùng'
  }
];

// 6 Trụ cột phát triển Hưng Yên (Topic Navigator gọn gàng)
const STRATEGIC_TOPICS = [
  {
    id: 'topic-industry',
    title: 'Công nghiệp & Chuỗi cung ứng',
    desc: 'KCN Thăng Long II, công nghệ cao & quỹ đất sạch',
    icon: 'ti ti-building-factory-2',
    link: '/posts?category=Giao thương và Đầu tư&subCategory=Khu & Cụm công nghiệp'
  },
  {
    id: 'topic-agriculture',
    title: 'Nông nghiệp & Sản vật địa phương',
    desc: 'Nhãn lồng Phố Hiến, tương Bần & vùng VietGAP',
    icon: 'ti ti-leaf',
    link: '/posts?category=Doanh nghiệp & Sản phẩm&subCategory=Sản phẩm OCOP & Nông sản'
  },
  {
    id: 'topic-logistics',
    title: 'Kinh tế kết nối & Logistics',
    desc: 'Hành lang sông Hồng, Vành đai 4 & trung tâm kho vận',
    icon: 'ti ti-truck-delivery',
    link: '/posts?category=Giao thương và Đầu tư&subCategory=Cảng biển & Logistics liên vùng'
  },
  {
    id: 'topic-heritage',
    title: 'Di sản & Du lịch trải nghiệm',
    desc: 'Phố Hiến đệ nhất, đền Mẫu, chùa Chuông & làng cổ',
    icon: 'ti ti-building-monument',
    link: '/posts?category=Khám phá Hưng Yên&subCategory=Di sản Phố Hiến'
  },
  {
    id: 'topic-innovation',
    title: 'Đô thị sinh thái & Đổi mới',
    desc: 'Đại đô thị xanh Ecopark, công nghệ số & ứng dụng AI',
    icon: 'ti ti-trees',
    link: '/posts?category=Doanh nghiệp & Sản phẩm&subCategory=Đổi mới sáng tạo & Khởi nghiệp'
  },
  {
    id: 'topic-community',
    title: 'Làng nghề & Mạng lưới kiều bào',
    desc: 'Làng nghề Thủ Sỹ, Thôn Cao & kết nối toàn cầu',
    icon: 'ti ti-world',
    link: '/posts?category=Cộng đồng&subCategory=Người Hưng Yên Toàn cầu'
  }
];

// Danh mục di sản tiêu biểu Hưng Yên (Khu khám phá 2 cột tương tác)
const HERITAGE_DESTINATIONS = [
  {
    id: 'pho-hien',
    index: '01',
    title: 'Quần thể Di tích Quốc gia đặc biệt Phố Hiến',
    typeLabel: 'Di sản Lịch sử • Đền Mẫu & Hồ Bán Nguyệt',
    location: 'TP. Hưng Yên',
    desc: 'Thương cảng cổ sầm uất bậc nhất thế kỷ XVII “Thứ nhất Kinh kỳ, thứ nhì Phố Hiến”. Quần thể gồm Đền Mẫu soi bóng hồ Bán Nguyệt, Đông Đô Quảng Hội và hệ thống văn hóa phù sa sông Hồng kết tinh nghìn năm lịch sử.',
    img: '/images/hungyen/hungyen_den_mau.jpg'
  },
  {
    id: 'chua-chuong',
    index: '02',
    title: 'Chùa Chuông — Phố Hiến đệ nhất danh lam',
    typeLabel: 'Di sản Kiến trúc & Tâm linh',
    location: 'Phường Hiến Nam, TP. Hưng Yên',
    desc: 'Được tôn vinh là danh thắng đệ nhất xứ nhãn với tam quan cổ kính, cây cầu đá xanh rêu phong và hệ thống tượng Phật thời Hậu Lê bằng gỗ sơn son thếp vàng vô cùng tinh xảo.',
    img: '/images/hungyen/hungyen_chua_chuong.jpg'
  },
  {
    id: 'lang-thu-sy',
    index: '03',
    title: 'Làng nghề đan đó Thủ Sỹ truyền thống',
    typeLabel: 'Làng nghề cổ truyền Bắc Bộ',
    location: 'Huyện Tiên Lữ',
    desc: 'Không gian văn hóa làng quê mộc mạc lưu giữ nghề đan đó thủ công hơn hai thế kỷ. Những chiếc đó tre xòe hoa giữa sân gạch cổ vừa là ngư cụ gắn với đời sống sông nước, vừa là tác phẩm mỹ nghệ xuất khẩu.',
    img: '/images/hungyen/hungyen_lang_dan_do.jpg'
  },
  {
    id: 'chua-keo',
    index: '04',
    title: 'Chùa Keo — Di sản kiến trúc gỗ lim cổ kính',
    typeLabel: 'Kiến trúc Cổ truyền',
    location: 'Không gian Văn hóa Hưng Yên',
    desc: 'Kiệt tác nghệ thuật kiến trúc gỗ cổ truyền Việt Nam với kỹ thuật đục mộng chuẩn xác, không dùng đinh thép, lưu giữ không gian thanh tịnh và lễ hội truyền thống đặc sắc.',
    img: '/images/hungyen/hungyen_chua_keo.jpg'
  },
  {
    id: 'lang-huong-cao',
    index: '05',
    title: 'Làng nghề hương xạ Thôn Cao',
    typeLabel: 'Làng nghề Thảo mộc truyền thống',
    location: 'Huyện Ân Thi',
    desc: 'Làng nghề làm hương nức tiếng với công thức 36 vị thảo mộc thiên nhiên cổ truyền, tạo nên mùi thơm thanh khiết, tao nhã lan tỏa khắp các nếp nhà và đình chùa Việt.',
    img: '/images/hungyen/hungyen_lang_huong.jpg'
  },
  {
    id: 'den-da-hoa',
    index: '06',
    title: 'Đền Đa Hòa — Huyền tích Chử Đồng Tử Tiên Dung',
    typeLabel: 'Di tích Lịch sử & Tâm linh',
    location: 'Huyện Khoái Châu',
    desc: 'Ngôi đền cổ tuyệt mỹ soi bóng sông Hồng, tôn vinh Đức thánh Chử Đồng Tử — một trong Tứ bất tử của tín ngưỡng dân gian Việt Nam, biểu tượng của tình yêu bất diệt và khát vọng khai mở giao thương.',
    img: '/images/hungyen/hungyen_den_da_hoa.jpg'
  }
];

// Danh sách sản vật tiêu biểu Hưng Yên (OCOP & Đặc sản địa phương)
const LOCAL_PRODUCTS = [
  {
    id: 'prod-nhan-long',
    name: 'Nhãn lồng tiến vua Phố Hiến',
    producer: 'HTX Nhãn lồng Hồng Nam',
    location: 'TP. Hưng Yên',
    cert: 'OCOP 5 Sao • Chỉ dẫn địa lý',
    desc: 'Trái to, cùi dày giòn ráo nước, hạt tiêu nhỏ, hương thơm thanh khiết đặc trưng vùng đất bãi phù sa.',
    img: '/images/hungyen/hungyen_nhan_long.jpg'
  },
  {
    id: 'prod-ga-dong-tao',
    name: 'Gà Đông Tảo thuần chủng',
    producer: 'Hội Chăn nuôi Gà Đông Tảo',
    location: 'Huyện Khoái Châu',
    cert: 'Đặc sản Tiến Vua • Nguồn gen quý',
    desc: 'Đôi chân to vảy rồng đặc trưng, nuôi thả tự nhiên bằng ngô thóc, thịt chắc ngọt đậm đà danh bất hư truyền.',
    img: '/images/hungyen/hungyen_ga_dong_tao.jpg'
  },
  {
    id: 'prod-tuong-ban',
    name: 'Tương Bần Mỹ Hào hảo hạng',
    producer: 'Làng nghề Tương Bần truyền thống',
    location: 'Thị xã Mỹ Hào',
    cert: 'OCOP 4 Sao • Gia vị cổ truyền',
    desc: 'Lên men tự nhiên từ đỗ tương rang vàng, nếp cái hoa vàng và muối sạch, sánh mịn thơm ngon nức tiếng miền Bắc.',
    img: '/images/hungyen/hungyen_den_da_hoa.jpg'
  },
  {
    id: 'prod-mat-ong-nhan',
    name: 'Mật ong hoa nhãn nguyên chất',
    producer: 'Vùng nuôi ong ven đê sông Hồng',
    location: 'Tỉnh Hưng Yên',
    cert: 'OCOP 4 Sao • Tự nhiên 100%',
    desc: 'Thu hoạch từ những vườn nhãn bạt ngàn vào độ nở rộ tháng ba, sắc vàng óng ánh và hương thơm hoa nhãn tự nhiên.',
    img: '/images/hungyen/hungyen_lang_hoa_vangiang.jpg'
  },
  {
    id: 'prod-do-tre-thu-sy',
    name: 'Đó tre mỹ nghệ Thủ Sỹ',
    producer: 'Làng nghề Thủ Sỹ',
    location: 'Huyện Tiên Lữ',
    cert: 'OCOP 3 Sao • Thủ công mỹ nghệ',
    desc: 'Những chiếc đó tre tinh xảo đan thủ công từ nan nứa già, vừa là ngư cụ truyền thống vừa là sản phẩm trang trí nghệ thuật.',
    img: '/images/hungyen/hungyen_lang_dan_do.jpg'
  },
  {
    id: 'prod-bonsai-vangiang',
    name: 'Hoa kiểng & Bonsai Văn Giang',
    producer: 'Làng hoa Xuân Quan - Phụng Công',
    location: 'Huyện Văn Giang',
    cert: 'Nông nghiệp Sinh thái Đô thị',
    desc: 'Nghệ thuật tạo tác cây cảnh thế và hoa rực rỡ cung ứng cho không gian sống sinh thái và các lễ hội lớn.',
    img: '/images/hungyen/hungyen_lang_huong.jpg'
  }
];

export const Home = () => {
  const { role } = useAuth();
  const { currentLang } = useTranslation();
  const navigate = useNavigate();

  // State tìm kiếm tinh gọn
  const [searchQuery, setSearchQuery] = useState('');

  // State bài viết (Hưng Yên hôm nay)
  const [postsList, setPostsList] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // State Theo dấu di sản (Interactive 2-column)
  const [selectedHeritageId, setSelectedHeritageId] = useState('pho-hien');

  // State sự kiện
  const [eventsList, setEventsList] = useState([]);

  // State Tham gia cùng Hưng Yên Today (Single Conversion Hub)
  const [activeNeed, setActiveNeed] = useState('enterprise');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    email: '',
    city: 'Hưng Yên',
    notes: '',
    agreeProcess: true
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Nạp danh sách bài viết từ Backend (fallback FALLBACK_POSTS)
  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
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
    loadPosts();
    return () => { isMounted = false; };
  }, []);

  // Nạp danh sách sự kiện từ Backend (fallback FALLBACK_EVENTS)
  useEffect(() => {
    let isMounted = true;
    const loadEvents = async () => {
      try {
        const res = await fetchJsonWithTimeout('/api/events?limit=4');
        if (isMounted) {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            setEventsList(res.data);
          } else {
            setEventsList(FALLBACK_EVENTS);
          }
        }
      } catch (err) {
        if (isMounted) setEventsList(FALLBACK_EVENTS);
      }
    };
    loadEvents();
    return () => { isMounted = false; };
  }, []);

  // State Doanh nghiệp tiêu biểu (Gắn nổi bật & Hạng Platinum)
  const [membersList, setMembersList] = useState([]);
  const [membersLoading, setMembersLoading] = useState(true);

  // Nạp danh sách doanh nghiệp thành viên (lọc is_featured = 1 hoặc tier = Platinum)
  useEffect(() => {
    let isMounted = true;
    const loadMembers = async () => {
      try {
        const res = await fetchJsonWithTimeout('/api/members?status=approved', {}, 4000);
        if (isMounted) {
          if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            const qualified = res.data.filter(m => m.is_featured === 1 || m.is_featured === true || m.tier === 'Platinum');
            setMembersList(qualified.length > 0 ? qualified : res.data);
          } else {
            setMembersList(FALLBACK_MEMBERS);
          }
        }
      } catch (err) {
        if (isMounted) setMembersList(FALLBACK_MEMBERS);
      } finally {
        if (isMounted) setMembersLoading(false);
      }
    };
    loadMembers();
    return () => { isMounted = false; };
  }, []);

  // Lấy tối đa 6 doanh nghiệp tiêu biểu để hiển thị
  const displayMembers = (membersList.length > 0 ? membersList : FALLBACK_MEMBERS).slice(0, 6);

  // Tách bài viết nổi bật bên trái (~2/3) và danh sách 3-4 bài bên phải (KHÔNG TRÙNG NHAU)
  const featuredPost = postsList.find(p => p.is_featured === 1) || postsList[0];
  const sidePosts = postsList
    .filter(p => {
      const pId = p.id || p._id || p.slug;
      const fId = featuredPost?.id || featuredPost?._id || featuredPost?.slug;
      return pId !== fId;
    })
    .slice(0, 4);

  // Tách sự kiện tiêu điểm và danh sách sự kiện tiếp theo
  const allEvents = eventsList.length > 0 ? eventsList : FALLBACK_EVENTS;
  const featuredEvent = allEvents[0];
  const nextEvents = allEvents.slice(1, 4);

  // Địa danh di sản đang chọn
  const selectedHeritage = HERITAGE_DESTINATIONS.find(d => d.id === selectedHeritageId) || HERITAGE_DESTINATIONS[0];

  // Xử lý tìm kiếm tinh gọn
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/posts?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/posts');
    }
  };

  // Nhãn nhu cầu hiện tại
  const NEED_LABELS = {
    enterprise: 'Giới thiệu doanh nghiệp',
    product: 'Giới thiệu sản phẩm / OCOP',
    partner: 'Gửi nhu cầu hợp tác & đầu tư',
    content: 'Đóng góp nội dung & sự kiện'
  };

  // Xử lý gửi Form Đăng ký vào backend /api/leads
  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.companyName.trim()) {
      alert(currentLang === 'en' ? 'Please fill in Name, Phone, and Organization (*)' : 'Vui lòng điền Họ tên, Số điện thoại và Tên tổ chức/doanh nghiệp (*)');
      return;
    }
    if (!formData.agreeProcess) {
      alert(currentLang === 'en' ? 'Please agree to information processing for feedback' : 'Vui lòng xác nhận đồng ý xử lý thông tin để nhận phản hồi');
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
          memberType: NEED_LABELS[activeNeed] || 'Đăng ký kết nối',
          notes: `[Nhu cầu: ${NEED_LABELS[activeNeed]}]. Ghi chú: ${formData.notes.trim() || 'Không có'}`
        })
      });

      if (res.ok) {
        setFormSuccess(true);
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.error || 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại sau.');
      }
    } catch (err) {
      alert('Không thể kết nối máy chủ. Vui lòng liên hệ ban điều phối qua hotline 0986 354 152.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="hy-home-wrapper">
      <SEOHead 
        title={`${brandConfig.brandName} — Hưng Yên: Dòng chảy di sản và giao thương`}
        description="Khám phá di sản, trải nghiệm đời sống và kết nối những giá trị mới của Hưng Yên trên nền tảng tích hợp AI."
      />
      <Navbar />

      <main id="main-content">
        {/* =========================================================================
            1. HERO SECTION (ẢNH PHONG CẢNH LỚN, NỘI DUNG LỆCH TRÁI PHÍA DƯỚI)
            ========================================================================= */}
        <section className="hy-hero-section">
          <div className="hy-container">
            <div className="hy-hero-content">
              <div className="hy-hero-caption">
                <i className="ti ti-map-pin" /> Sông Hồng & Đất bãi Phố Hiến trù phú
              </div>
              <h1 className="hy-hero-title">
                Khám phá Hưng Yên.
                <span>Kết nối cơ hội phát triển.</span>
              </h1>
              <p className="hy-hero-desc">
                Nền tảng thông tin văn hóa, đời sống di sản, kết nối doanh nghiệp và xúc tiến đầu tư tại Hưng Yên.
              </p>
              <div className="hy-hero-actions">
                <a href="#theo-dau-di-san" className="hy-btn-primary">
                  <i className="ti ti-compass" />
                  <span>Khám phá Hưng Yên</span>
                </a>
                <a href="#kcn-hung-yen" className="hy-btn-secondary">
                  <i className="ti ti-building-factory-2" />
                  <span>Hạ tầng KCN & Đầu tư</span>
                </a>
              </div>

              {/* Quick Stats Bar lấp đầy khoảng trống, tạo chiều sâu dữ liệu */}
              <div className="hy-hero-stats-row">
                <div className="hy-hero-stat-item">
                  <span className="hy-hero-stat-num">17</span>
                  <span className="hy-hero-stat-lbl">Khu & Cụm công nghiệp</span>
                </div>
                <div className="hy-hero-stat-item">
                  <span className="hy-hero-stat-num">1.800+</span>
                  <span className="hy-hero-stat-lbl">Di tích lịch sử & văn hóa</span>
                </div>
                <div className="hy-hero-stat-item">
                  <span className="hy-hero-stat-num">120+</span>
                  <span className="hy-hero-stat-lbl">Sản phẩm OCOP đạt chuẩn</span>
                </div>
                <div className="hy-hero-stat-item">
                  <span className="hy-hero-stat-num">Top đầu</span>
                  <span className="hy-hero-stat-lbl">Thu hút FDI Bắc Bộ</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            TÌM KIẾM TINH GỌN (NGAY CHÂN HERO)
            ========================================================================= */}
        <div className="hy-container">
          <div className="hy-search-strip">
            <form onSubmit={handleSearchSubmit} className="hy-search-form">
              <div className="hy-search-input-box">
                <i className="ti ti-search" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Bạn muốn tìm điểm đến, doanh nghiệp, sản phẩm hay cơ hội hợp tác?"
                  className="hy-search-input"
                  aria-label="Tìm kiếm trên Hưng Yên Today"
                />
              </div>
              <button type="submit" className="hy-search-btn">
                <span>Tìm kiếm</span>
                <i className="ti ti-arrow-right" />
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================================
            A. HƯNG YÊN HÔM NAY (ĐƯA LÊN NGAY SAU HERO & TÌM KIẾM)
            Desktop: 1 bài nổi bật ~2/3 + 3-4 bài ngắn bên phải
            ========================================================================= */}
        <section className="hy-section">
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Tin tức & Nhịp sống</span>
              <h2 className="hy-section-title">Hưng Yên hôm nay</h2>
              <p className="hy-section-desc">
                Cập nhật chuyển động kinh tế, đời sống di sản và những câu chuyện mới nhất từ địa phương.
              </p>
            </div>

            <div className="hy-news-grid">
              {/* Cột trái: 1 Bài nổi bật lớn */}
              {featuredPost && (
                <Link
                  to={featuredPost.slug ? `/posts/${featuredPost.slug}` : `/posts/${featuredPost.id || featuredPost._id || ''}`}
                  className="hy-news-featured-card"
                >
                  <div className="hy-news-featured-img-wrap">
                    <img
                      src={featuredPost.image_url || featuredPost.cover_image || featuredPost.img || '/images/hungyen/hungyen_kcn_thang_long.jpg'}
                      alt={featuredPost.title}
                      className="hy-news-featured-img"
                      loading="lazy"
                    />
                  </div>
                  <div className="hy-news-featured-body">
                    <span className="hy-tag-pill brick">
                      {featuredPost.sub_category || featuredPost.category || 'Tiêu điểm'}
                    </span>
                    <h3 className="hy-news-featured-title">{featuredPost.title}</h3>
                    <p className="hy-news-featured-desc">
                      {featuredPost.summary || featuredPost.excerpt || featuredPost.desc}
                    </p>
                    <div className="hy-news-meta">
                      <span><i className="ti ti-user" /> {featuredPost.author_name || featuredPost.author || 'Ban Biên Tập'}</span>
                      <span>•</span>
                      <span><i className="ti ti-calendar" /> {featuredPost.created_at ? new Date(featuredPost.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật'}</span>
                      <span>•</span>
                      <span><i className="ti ti-eye" /> {featuredPost.views ? featuredPost.views.toLocaleString() : '1,250'} xem</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Cột phải: Danh sách 3-4 bài ngắn, không trùng bài nổi bật */}
              <div className="hy-news-side-list">
                {sidePosts.map((post, idx) => (
                  <Link
                    key={post.id || post._id || idx}
                    to={post.slug ? `/posts/${post.slug}` : `/posts/${post.id || post._id || idx}`}
                    className="hy-news-side-item"
                  >
                    <div className="hy-news-side-thumb">
                      <img
                        src={post.image_url || post.cover_image || post.img || '/images/hungyen/hungyen_nhan_long.jpg'}
                        alt={post.title}
                        loading="lazy"
                      />
                    </div>
                    <div className="hy-news-side-content">
                      <span className="hy-tag-pill" style={{ alignSelf: 'flex-start', fontSize: '10px', padding: '2px 8px' }}>
                        {post.sub_category || post.category || 'Tin tức'}
                      </span>
                      <h4 className="hy-news-side-title">{post.title}</h4>
                      <div className="hy-news-meta" style={{ marginTop: '2px', fontSize: '11.5px' }}>
                        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hy-news-view-all">
              <Link to="/posts" className="hy-link-arrow">
                <span>Xem tất cả bài viết</span>
                <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            BLOCK MỚI: TOP 9 KHU CÔNG NGHIỆP TIÊU BIỂU HƯNG YÊN
            (Thiết kế chuyên sâu: Top 3 nổi bật hơn hẳn, 6 KCN tiếp theo gọn gàng)
            ========================================================================= */}
        <section id="kcn-hung-yen" className="hy-section" style={{ background: '#FFFFFF' }}>
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Hạ tầng công nghiệp & Động lực phát triển</span>
              <h2 className="hy-section-title">Top 9 Khu Công Nghiệp Tiêu Biểu Hưng Yên</h2>
              <p className="hy-section-desc">
                Các trung tâm công nghiệp công nghệ cao, chuỗi cung ứng cơ khí chính xác và hạ tầng logistics trọng điểm thu hút dòng vốn đầu tư toàn cầu.
              </p>
            </div>

            {/* Hàng 1: TOP 3 KHU CÔNG NGHIỆP TRỌNG ĐIỂM (THUẦN THÔNG TIN, THIẾT KẾ ĐẸP NHƯ ĐẮK LẮK) */}
            <div className="hy-kcn-top3-grid">
              {TOP_INDUSTRIAL_PARKS.map((kcn) => (
                <div key={kcn.id} className="hy-kcn-card-top">
                  <div className="hy-kcn-top-header">
                    <div className="hy-kcn-top-icon">
                      <i className="ti ti-building-factory-2" />
                    </div>
                    <div>
                      <h3 className="hy-kcn-top-title">{kcn.name}</h3>
                      <div className="hy-kcn-top-loc">
                        <i className="ti ti-map-pin" /> {kcn.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hy-kcn-metrics-box">
                    <span><i className="ti ti-maximize" /> Quy mô {kcn.acreage}</span>
                    <span>•</span>
                    <span style={{ color: '#A6533D' }}><i className="ti ti-chart-pie" /> {kcn.occupancy}</span>
                  </div>
                  <p className="hy-kcn-top-desc">{kcn.desc}</p>
                  <div className="hy-kcn-focus-box">
                    <strong>Ngành mũi nhọn:</strong> {kcn.focus}
                  </div>
                </div>
              ))}
            </div>

            {/* Hàng 2: 6 KHU CÔNG NGHIỆP TIÊU BIỂU TIẾP THEO (KHÔNG BỊ KHUẤT CHỮ TRÊN CẢ DESKTOP & MOBILE) */}
            <div className="hy-kcn-next-grid">
              {NEXT_INDUSTRIAL_PARKS.map((item) => (
                <div key={item.id} className="hy-kcn-mini-card">
                  <div className="hy-kcn-mini-main">
                    <div className="hy-kcn-mini-icon">
                      <i className="ti ti-building-factory-2" />
                    </div>
                    <div className="hy-kcn-mini-text">
                      <h4 className="hy-kcn-mini-title">{item.name}</h4>
                      <div className="hy-kcn-mini-meta">
                        <i className="ti ti-map-pin" /> {item.location}
                      </div>
                    </div>
                  </div>
                  <div className="hy-kcn-mini-details">
                    <span className="hy-kcn-mini-scale">{item.scale}</span>
                    <span className="hy-kcn-mini-ind">{item.industry}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            B. CHỌN ĐIỀU BẠN QUAN TÂM (ĐIỀU HƯỚNG CHUYÊN ĐỀ GỌN)
            ========================================================================= */}
        <section className="hy-section">
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Chuyên đề chiến lược</span>
              <h2 className="hy-section-title">Chọn điều bạn quan tâm</h2>
              <p className="hy-section-desc">
                Điều hướng nhanh tới sáu lĩnh vực trọng tâm phát triển kinh tế, văn hóa và đời sống tỉnh Hưng Yên.
              </p>
            </div>

            <div className="hy-topics-grid">
              {STRATEGIC_TOPICS.map((topic) => (
                <Link key={topic.id} to={topic.link} className="hy-topic-card">
                  <div className="hy-topic-icon">
                    <i className={topic.icon} />
                  </div>
                  <div className="hy-topic-info">
                    <h3 className="hy-topic-name">{topic.title}</h3>
                    <p className="hy-topic-desc">{topic.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            C. THEO DẤU DI SẢN (KHU KHÁM PHÁ 2 CỘT TƯƠNG TÁC)
            Cột trái: danh sách chọn. Cột phải: ảnh lớn + mô tả chi tiết.
            ========================================================================= */}
        <section id="theo-dau-di-san" className="hy-section">
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Hành trình địa phương</span>
              <h2 className="hy-section-title">Theo dấu di sản</h2>
              <p className="hy-section-desc">
                Khám phá chiều sâu lịch sử, không gian kiến trúc cổ và nét đẹp làng nghề truyền thống nghìn năm đất Phố Hiến.
              </p>
            </div>

            <div className="hy-heritage-explorer">
              {/* Cột trái: Danh sách địa điểm có thể chọn */}
              <div className="hy-heritage-list" role="tablist" aria-label="Danh sách di sản">
                {HERITAGE_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedHeritageId === dest.id}
                    tabIndex={0}
                    className={`hy-heritage-btn ${selectedHeritageId === dest.id ? 'active' : ''}`}
                    onClick={() => setSelectedHeritageId(dest.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedHeritageId(dest.id);
                      }
                    }}
                  >
                    <span className="hy-heritage-idx">{dest.index}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hy-heritage-btn-title">{dest.title}</div>
                      <div className="hy-heritage-btn-loc">
                        <i className="ti ti-map-pin" /> {dest.location}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Cột phải: Ảnh lớn, tên địa điểm, mô tả ngắn và nút xem chi tiết */}
              <div className="hy-heritage-display" key={selectedHeritage.id}>
                <div className="hy-heritage-display-img-wrap">
                  <img
                    src={selectedHeritage.img}
                    alt={selectedHeritage.title}
                    className="hy-heritage-display-img"
                    loading="lazy"
                  />
                </div>
                <div className="hy-heritage-display-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="hy-tag-pill brick">{selectedHeritage.typeLabel}</span>
                    <span style={{ fontSize: '12.5px', color: '#556B67' }}>
                      <i className="ti ti-map-pin" /> {selectedHeritage.location}
                    </span>
                  </div>
                  <h3 className="hy-heritage-display-title">{selectedHeritage.title}</h3>
                  <p className="hy-heritage-display-desc">{selectedHeritage.desc}</p>
                  <div className="hy-heritage-display-footer">
                    <Link
                      to={`/posts?search=${encodeURIComponent(selectedHeritage.title.split('—')[0].trim())}`}
                      className="hy-link-arrow"
                    >
                      <span>Xem bài viết về địa danh này</span>
                      <i className="ti ti-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            DOANH NGHIỆP TIÊU BIỂU (HỘI VIÊN GẮN NỔI BẬT & HẠNG PLATINUM)
            ========================================================================= */}
        <section id="doanh-nghiep-tieu-bieu" className="hy-section" style={{ background: '#FFFFFF' }}>
          <div className="hy-container">
            <div className="hy-section-header-flex">
              <div className="hy-section-header" style={{ marginBottom: 0 }}>
                <span className="hy-section-badge">Cộng đồng & Mạng lưới thành viên</span>
                <h2 className="hy-section-title">Doanh nghiệp tiêu biểu</h2>
                <p className="hy-section-desc">
                  Mạng lưới các doanh nghiệp thành viên được gắn nổi bật và hội viên hạng Platinum dẫn đầu trong sản xuất, công nghệ và xúc tiến đầu tư tại Hưng Yên.
                </p>
              </div>
              <div className="hy-section-header-actions">
                <Link to="/members" className="hy-link-arrow">
                  <span>Xem toàn bộ danh bạ hội viên</span>
                  <i className="ti ti-arrow-right" />
                </Link>
              </div>
            </div>

            <div className="hy-members-featured-grid">
              {displayMembers.map((m) => {
                const isFeatured = m.is_featured === 1 || m.is_featured === true;
                const isPlatinum = m.tier === 'Platinum';
                return (
                  <div key={m.id} className={`hy-member-featured-card ${isPlatinum ? 'platinum' : ''}`}>
                    <div className="hy-member-card-top-row">
                      <div className="hy-member-avatar-box">
                        {m.logo_url ? (
                          <img
                            src={m.logo_url}
                            alt={m.name}
                            className="hy-member-avatar-img"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                e.currentTarget.nextElementSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="hy-member-avatar-fallback"
                          style={{
                            display: m.logo_url ? 'none' : 'flex',
                            background: m.bg || 'var(--hy-primary-light)',
                            color: m.fg || 'var(--hy-primary)'
                          }}
                        >
                          {m.initials || m.name?.slice(0, 2).toUpperCase() || 'HY'}
                        </div>
                      </div>

                      <div className="hy-member-badges-wrap">
                        {isFeatured && (
                          <span className="hy-member-pill featured" title="Doanh nghiệp gắn nổi bật">
                            <i className="ti ti-star-filled" /> Nổi bật
                          </span>
                        )}
                        {isPlatinum && (
                          <span className="hy-member-pill platinum" title="Hội viên hạng Platinum">
                            <i className="ti ti-diamond" /> Platinum
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="hy-member-card-title">{m.company_name || m.name}</h3>

                    <div className="hy-member-card-meta">
                      <div className="hy-member-meta-line">
                        <i className="ti ti-briefcase" />
                        <span>{m.industry || 'Đa ngành'}</span>
                      </div>
                      <div className="hy-member-meta-line">
                        <i className="ti ti-map-pin" />
                        <span>{m.address || m.city || 'Hưng Yên'}</span>
                      </div>
                    </div>

                    <p className="hy-member-card-desc">
                      {m.bio || m.desc || m.description || 'Doanh nghiệp thành viên tiêu biểu trong mạng lưới xúc tiến đầu tư và thương mại Hưng Yên.'}
                    </p>

                    <div className="hy-member-card-footer">
                      <Link to={`/members?search=${encodeURIComponent(m.name)}`} className="hy-member-btn-view">
                        <span>Xem hồ sơ</span>
                        <i className="ti ti-arrow-right" />
                      </Link>
                      <span className="hy-member-status-verified">
                        <i className="ti ti-circle-check-filled" /> Đã xác thực
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hy-members-footer-strip">
              <div className="hy-members-footer-text">
                <i className="ti ti-shield-check" />
                <span>Doanh nghiệp của bạn đang hoạt động hoặc đầu tư tại Hưng Yên? Gia nhập mạng lưới để tăng cường hiện diện và kết nối đối tác.</span>
              </div>
              {role === 'guest' ? (
                <Link to="/register" className="hy-btn-primary" style={{ padding: '10px 24px', fontSize: '14.5px', whiteSpace: 'nowrap' }}>
                  <i className="ti ti-user-plus" />
                  <span>Đăng ký tham gia mạng lưới</span>
                </Link>
              ) : (
                <Link to={role === 'admin' ? '/admin' : '/member-dashboard'} className="hy-btn-primary" style={{ padding: '10px 24px', fontSize: '14.5px', whiteSpace: 'nowrap' }}>
                  <i className="ti ti-layout-dashboard" />
                  <span>{role === 'admin' ? 'Trang quản trị' : 'Quản lý hồ sơ doanh nghiệp'}</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================================
            E. SẢN VẬT TỪ ĐỊA PHƯƠNG (TÁCH BIỆT KHỎI DOANH NGHIỆP, DẢI SẢN PHẨM)
            ========================================================================= */}
        <section className="hy-section">
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Nông sản & OCOP</span>
              <h2 className="hy-section-title">Sản vật từ địa phương</h2>
              <p className="hy-section-desc">
                Những đặc sản kết tinh từ phù sa trù phú, bàn tay khéo léo của người thợ và tiêu chuẩn chứng nhận OCOP rõ ràng.
              </p>
            </div>

            <div className="hy-products-grid">
              {LOCAL_PRODUCTS.slice(0, 4).map((prod) => (
                <Link
                  key={prod.id}
                  to={`/posts?search=${encodeURIComponent(prod.name)}`}
                  className="hy-product-card"
                >
                  <div className="hy-product-thumb">
                    <img src={prod.img} alt={prod.name} loading="lazy" />
                    <span className="hy-product-cert-badge">{prod.cert.split('•')[0]}</span>
                  </div>
                  <div className="hy-product-body">
                    <h3 className="hy-product-name">{prod.name}</h3>
                    <p className="hy-product-producer">
                      <i className="ti ti-building-store" /> {prod.producer} • {prod.location}
                    </p>
                    <p className="hy-product-desc">{prod.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                to="/posts?category=Doanh nghiệp & Sản phẩm&subCategory=Sản phẩm OCOP & Nông sản"
                className="hy-link-arrow"
              >
                <span>Xem tất cả sản phẩm & đặc sản Hưng Yên</span>
                <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SỰ KIỆN & DIỄN ĐÀN TIÊU ĐIỂM (EVENTS SPOTLIGHT)
            Được nâng cấp thành khối độc lập, nổi bật rực rỡ như phần bài viết
            ========================================================================= */}
        <section id="su-kien" className="hy-section" style={{ background: '#FAF8F3' }}>
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Lễ hội & Giao thương</span>
              <h2 className="hy-section-title">Sự kiện & Diễn đàn tiêu điểm</h2>
              <p className="hy-section-desc">
                Khám phá nhịp sống lễ hội văn hóa dân gian Phố Hiến và các diễn đàn xúc tiến đầu tư, kinh tế số trọng điểm tại Hưng Yên.
              </p>
            </div>

            <div className="hy-events-bento">
              {/* Cột trái: 1 Sự kiện tiêu điểm lớn */}
              {featuredEvent && (
                <Link
                  to={featuredEvent.slug ? `/events/${featuredEvent.slug}` : '/events'}
                  className="hy-event-spotlight-card"
                >
                  <img
                    src={featuredEvent.image_url || '/images/hungyen/hungyen_chua_chuong.jpg'}
                    alt={featuredEvent.title}
                    className="hy-event-spotlight-img"
                    loading="lazy"
                  />
                  <div className="hy-event-spotlight-overlay" />
                  <div className="hy-event-spotlight-content">
                    <div className="hy-event-date-pill">
                      <i className="ti ti-calendar" />
                      <span>{featuredEvent.event_date ? new Date(featuredEvent.event_date).toLocaleDateString('vi-VN') : 'Sắp diễn ra'}</span>
                    </div>
                    <h3 className="hy-event-spotlight-title">{featuredEvent.title}</h3>
                    <p className="hy-event-spotlight-desc">
                      {featuredEvent.short_desc || featuredEvent.desc}
                    </p>
                    <div className="hy-event-spotlight-meta">
                      <span><i className="ti ti-map-pin" /> {featuredEvent.location}</span>
                      <span style={{ fontWeight: 750 }}>
                        {featuredEvent.is_paid ? `${featuredEvent.price?.toLocaleString()}đ` : 'Miễn phí'} • Đăng ký vé →
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Cột phải: 3 Sự kiện tiếp theo dạng thẻ ngang */}
              <div className="hy-events-side-stack">
                {nextEvents.map((evt, idx) => {
                  const evtDate = evt.event_date ? new Date(evt.event_date) : null;
                  const day = evtDate ? evtDate.getDate() : '15';
                  const month = evtDate ? `T${evtDate.getMonth() + 1}` : 'T11';
                  return (
                    <Link
                      key={evt.id || idx}
                      to={evt.slug ? `/events/${evt.slug}` : '/events'}
                      className="hy-event-side-card"
                    >
                      <div className="hy-event-date-box">
                        <span className="hy-event-date-day">{day}</span>
                        <span className="hy-event-date-mo">{month}</span>
                      </div>
                      <div className="hy-event-side-body">
                        <span className="hy-tag-pill" style={{ alignSelf: 'flex-start', fontSize: '10px', padding: '2px 8px' }}>
                          {evt.is_paid ? 'Sự kiện có phí' : 'Miễn phí tham gia'}
                        </span>
                        <h4 className="hy-event-side-title">{evt.title}</h4>
                        <div className="hy-event-side-loc">
                          <i className="ti ti-map-pin" /> {evt.location}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Link to="/events" className="hy-link-arrow">
                <span>Xem toàn bộ lịch sự kiện & diễn đàn Hưng Yên</span>
                <i className="ti ti-arrow-right" />
              </Link>
            </div>
          </div>
        </section>



        {/* =========================================================================
            G. TIỆN ÍCH AI (LÀM RÕ NGƯỜI DÙNG CÓ THỂ LÀM GÌ, HÀNH ĐỘNG THẬT)
            ========================================================================= */}
        <section className="hy-section" style={{ background: '#FFFFFF' }}>
          <div className="hy-container">
            <div className="hy-section-header">
              <span className="hy-section-badge">Trợ lý số địa phương</span>
              <h2 className="hy-section-title">Tiện ích AI Hưng Yên</h2>
              <p className="hy-section-desc">
                Ứng dụng trí tuệ nhân tạo hỗ trợ tra cứu thông tin địa phương, gợi ý kết nối kinh doanh và giải đáp tức thì 24/7.
              </p>
            </div>

            <div className="hy-ai-grid">
              <div className="hy-ai-card">
                <div className="hy-ai-card-icon">
                  <i className="ti ti-compass" />
                </div>
                <h3 className="hy-ai-card-title">Tra cứu di sản & văn hóa</h3>
                <p className="hy-ai-card-desc">
                  Tìm hiểu nguồn gốc lịch sử của hơn 1.800 di tích, huyền tích Phố Hiến, lộ trình tham quan làng nghề và đặc sản ẩm thực có nguồn gốc xác thực.
                </p>
                <a href="#theo-dau-di-san" className="hy-ai-card-btn">
                  <span>Khám phá di sản</span>
                  <i className="ti ti-arrow-right" />
                </a>
              </div>

              <div className="hy-ai-card">
                <div className="hy-ai-card-icon">
                  <i className="ti ti-building" />
                </div>
                <h3 className="hy-ai-card-title">Gợi ý kết nối doanh nghiệp & OCOP</h3>
                <p className="hy-ai-card-desc">
                  Hỗ trợ tìm kiếm cơ sở sản xuất đạt chuẩn VietGAP, kết nối đối tác công nghiệp phụ trợ tại các KCN và thông tin đầu mối tiếp nhận hợp tác.
                </p>
                <a href="#kcn-hung-yen" className="hy-ai-card-btn">
                  <span>Tìm đối tác phù hợp</span>
                  <i className="ti ti-arrow-right" />
                </a>
              </div>

              <div className="hy-ai-card">
                <div className="hy-ai-card-icon">
                  <i className="ti ti-messages" />
                </div>
                <h3 className="hy-ai-card-title">Hỏi đáp trực tiếp cùng Trợ lý AI</h3>
                <p className="hy-ai-card-desc">
                  Hỏi đáp nhanh mọi thông tin về thủ tục đăng ký thành viên, lịch lễ hội, cẩm nang du lịch và thông tin kết nối bất kỳ lúc nào.
                </p>
                <button
                  type="button"
                  className="hy-ai-card-btn"
                  onClick={() => {
                    const aiBtn = document.querySelector('.floating-ai-trigger, #floating-ai-button, [aria-label*="AI"]');
                    if (aiBtn) aiBtn.click();
                    else window.dispatchEvent(new CustomEvent('open-ai-chat'));
                  }}
                >
                  <i className="ti ti-sparkles" />
                  <span>Mở Trợ lý AI ngay</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            H. THAM GIA CÙNG HƯNG YÊN TODAY (SINGLE CONVERSION HUB)
            Gộp các khối kêu gọi thành một điểm chuyển đổi rõ ràng cuối trang
            ========================================================================= */}
        <section id="dang-ky-mang-luoi" className="hy-join-section">
          <div className="hy-container">
            <div className="hy-join-box">
              <div className="hy-join-header">
                <span className="hy-section-badge">Mở rộng mạng lưới</span>
                <h2 className="hy-section-title">Tham gia cùng Hưng Yên Today</h2>
                <p className="hy-section-desc">
                  Dù bạn là doanh nghiệp, cơ sở sản xuất, người làm nghề hay muốn đóng góp nội dung — chúng tôi luôn sẵn sàng đồng hành và phản hồi nhanh chóng.
                </p>
              </div>

              {/* Bộ chọn nhu cầu tham gia */}
              <div className="hy-needs-selector">
                {Object.entries(NEED_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`hy-need-pill ${activeNeed === key ? 'active' : ''}`}
                    onClick={() => setActiveNeed(key)}
                  >
                    <i className={
                      key === 'enterprise' ? 'ti ti-building' :
                      key === 'product' ? 'ti ti-package' :
                      key === 'partner' ? 'ti ti-handshake' : 'ti ti-news'
                    } />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {formSuccess ? (
                <div className="hy-success-banner">
                  <i className="ti ti-circle-check" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0' }}>
                    Gửi thông tin thành công!
                  </h3>
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                    Cảm ơn bạn đã quan tâm. Bộ phận điều phối Hưng Yên Today đã tiếp nhận yêu cầu <strong>{NEED_LABELS[activeNeed]}</strong> và sẽ liên hệ hỗ trợ bạn trong thời gian sớm nhất.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSuccess(false)}
                    className="hy-btn-primary"
                    style={{ marginTop: '1.25rem' }}
                  >
                    Gửi thêm thông tin khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="hy-join-form">
                  <div className="hy-form-grid-2">
                    <div className="hy-form-group">
                      <label className="hy-form-label">
                        Họ và tên người liên hệ <span>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Ví dụ: Nguyễn Văn An"
                        className="hy-form-input"
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">
                        Số điện thoại liên hệ <span>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Ví dụ: 0912 345 678"
                        className="hy-form-input"
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">
                        Tên tổ chức / Doanh nghiệp / Cơ sở <span>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Ví dụ: HTX Nhãn lồng Phố Hiến"
                        className="hy-form-input"
                      />
                    </div>

                    <div className="hy-form-group">
                      <label className="hy-form-label">
                        Địa chỉ Email (nếu có)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@doanhnghiep.vn"
                        className="hy-form-input"
                      />
                    </div>

                    <div className="hy-form-group full">
                      <label className="hy-form-label">
                        Địa bàn hoạt động
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Ví dụ: TP. Hưng Yên / Khoái Châu / Mỹ Hào / Tỉnh khác"
                        className="hy-form-input"
                      />
                    </div>

                    <div className="hy-form-group full">
                      <label className="hy-form-label">
                        Mô tả nhu cầu hợp tác hoặc thông tin cần giới thiệu <span>*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Mô tả tóm tắt về sản phẩm, lĩnh vực hoạt động hoặc nhu cầu kết nối cụ thể của bạn..."
                        className="hy-form-textarea"
                      />
                    </div>
                  </div>

                  <label className="hy-form-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.agreeProcess}
                      onChange={(e) => setFormData({ ...formData, agreeProcess: e.target.checked })}
                    />
                    <span>
                      Tôi xác nhận thông tin cung cấp là chính xác và đồng ý để bộ phận điều phối Hưng Yên Today liên hệ hỗ trợ.
                    </span>
                  </label>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="submit"
                      disabled={formLoading}
                      className="hy-btn-primary"
                      style={{ padding: '13px 36px', fontSize: '15.5px' }}
                    >
                      {formLoading ? (
                        <>
                          <i className="ti ti-loader ti-spin" />
                          <span>Đang gửi thông tin...</span>
                        </>
                      ) : (
                        <>
                          <i className="ti ti-send" />
                          <span>Gửi yêu cầu tham gia</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingAIBot />
    </div>
  );
};

export default Home;
