import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';
import { usePWA } from '../contexts/PWAContext';
import brandConfig from '../brand.config';
import { getCategoryLabel, getSubCategoryLabel, CATEGORIES_DATA } from '../constants/categories';

export const Navbar = () => {
  const { role, user, logout } = useAuth();
  const { currentLang, changeLang, t, availableLanguages } = useTranslation();
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const currentLangObj = (availableLanguages || []).find(l => l.code === currentLang) || {
    code: currentLang,
    label: (currentLang || 'VI').toUpperCase(),
    name: 'Tiếng Việt',
    flag: '🇻🇳'
  };
  // Khởi tạo ngay lập tức từ bộ nhớ đệm hoặc CATEGORIES_DATA chuẩn để Header luôn hiện 0ms không bao giờ bị trắng
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const cached = localStorage.getItem('dnvn_cached_categories');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return CATEGORIES_DATA;
  });
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [mobileExpandedCatId, setMobileExpandedCatId] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const navRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Đóng mobile menu hoặc dropdown khi nhấn phím Escape và trả focus về trigger (F-02)
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          if (mobileToggleRef.current) {
            mobileToggleRef.current.focus();
          }
        }
        if (activeDropdownId) {
          setActiveDropdownId(null);
        }
        if (langDropdownOpen) {
          setLangDropdownOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [mobileMenuOpen, activeDropdownId, langDropdownOpen]);

  // Đồng bộ động Chuyên mục & Lĩnh vực từ Backend / Database ngầm trong nền (SWR Pattern)
  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/categories?_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isMounted) {
            // Sắp xếp theo order_index tăng dần do admin thiết lập
            const sorted = [...json.data].sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            setCategoriesList(sorted);
            try {
              localStorage.setItem('dnvn_cached_categories', JSON.stringify(sorted));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('Navbar: Không thể tải danh mục từ API.', err.message);
      }
    };
    fetchCategories();

    // Lắng nghe sự kiện cập nhật từ trang Admin hoặc các tab khác
    const handleUpdate = () => fetchCategories();
    window.addEventListener('categories-updated', handleUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'dnvn_cached_categories' || !e.key) {
        fetchCategories();
      }
    });

    return () => { 
      isMounted = false; 
      window.removeEventListener('categories-updated', handleUpdate);
    };
  }, []);

  // Xử lý đóng dropdown khi click bên ngoài (hỗ trợ Touch & Click)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdownId(null);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Handle dropdown hover with debounce
  const handleMouseEnter = (catId) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdownId(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownId(null);
    }, 220);
  };

  // Toggle Dropdown cho Touchscreen & Keyboard
  const handleToggleDropdown = (catId, e) => {
    e.stopPropagation();
    setActiveDropdownId(prev => (prev === catId ? null : catId));
  };

  const handleKeyDown = (catId, e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveDropdownId(prev => (prev === catId ? null : catId));
    } else if (e.key === 'Escape') {
      setActiveDropdownId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'HY';
    return name.trim().split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  // Tên hiển thị đầy đủ trực tiếp từ Admin thiết lập có hỗ trợ song ngữ tức thì
  const getCategoryName = (cat) => {
    return getCategoryLabel(cat, currentLang);
  };

  const getSubName = (sub) => {
    return getSubCategoryLabel(sub, currentLang);
  };

  // Lấy danh sách chuyên mục con an toàn từ dữ liệu động
  const getSubList = (cat) => {
    if (!cat) return [];
    if (Array.isArray(cat.sub_categories) && cat.sub_categories.length > 0) {
      return cat.sub_categories;
    }
    if (Array.isArray(cat.subcategories) && cat.subcategories.length > 0) {
      return cat.subcategories;
    }
    if (typeof cat.subcategories === 'string') {
      try {
        const parsed = JSON.parse(cat.subcategories);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  return (
    <>
      <style>{`
        /* Reset and enforce immunity from any external styles */
        .dnvn-navbar-header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 99999 !important;
          background: #103D3B !important;
          background-image: linear-gradient(180deg, #134B49 0%, #082927 100%) !important;
          border-bottom: 2px solid rgba(214, 168, 70, 0.45) !important;
          box-shadow: 0 4px 20px rgba(8, 41, 39, 0.5) !important;
          width: 100% !important;
          max-width: 100vw !important;
          box-sizing: border-box !important;
        }

        .dnvn-navbar-spacer {
          height: 72px;
          width: 100%;
          flex-shrink: 0;
        }

        .dnvn-header-container {
          width: 100% !important;
          max-width: 1680px !important;
          margin: 0 auto !important;
          padding: 8px 18px !important;
          min-height: 72px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 10px !important;
          position: relative !important;
          box-sizing: border-box !important;
        }

        /* Brand Styling */
        .dnvn-brand-link {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          text-decoration: none !important;
          flex-shrink: 0 !important;
        }

        .dnvn-brand-icon {
          width: 44px !important;
          height: 44px !important;
          border-radius: 11px !important;
          background: linear-gradient(135deg, #123B46 0%, #CFA34A 100%) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          font-size: 16px !important;
          border: 1.5px solid rgba(207, 163, 74, 0.5) !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35) !important;
          overflow: hidden !important;
          flex-shrink: 0 !important;
        }

        .dnvn-brand-icon-img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        .dnvn-brand-text-box {
          display: flex !important;
          flex-direction: column !important;
          line-height: 1.15 !important;
        }

        .dnvn-brand-title {
          font-family: 'Be Vietnam Pro', 'Outfit', sans-serif !important;
          font-weight: 800 !important;
          font-size: 19px !important;
          color: #ffffff !important;
          letter-spacing: -0.3px !important;
        }

        .dnvn-brand-subtitle {
          font-size: 8px !important;
          font-weight: 700 !important;
          color: #CFA34A !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase !important;
          margin-top: 2px !important;
        }

        /* Navigation Categories (Single row in center, allows text wrapping) */
        .dnvn-nav-categories {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 6px !important;
          flex: 1 1 auto !important;
          margin: 0 6px !important;
          overflow: visible !important;
        }

        .dnvn-cat-wrapper {
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .dnvn-nav-item-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #FAF8F3 !important;
          text-decoration: none !important;
          font-weight: 650 !important;
          font-size: 14.5px !important;
          padding: 6px 10px !important;
          border-radius: 7px !important;
          transition: all 0.18s ease !important;
          cursor: pointer !important;
          background: transparent !important;
          border: 1px solid transparent !important;
          box-sizing: border-box !important;
          user-select: none !important;
          white-space: normal !important;
          word-break: normal !important;
          text-align: center !important;
          line-height: 1.25 !important;
          max-width: 145px !important;
          gap: 4px !important;
        }

        .dnvn-nav-item-btn:hover {
          color: #CFA34A !important;
          background-color: rgba(207, 163, 74, 0.15) !important;
          border-color: rgba(207, 163, 74, 0.35) !important;
        }

        .dnvn-nav-item-btn.active {
          color: #FFFFFF !important;
          background-color: rgba(207, 163, 74, 0.25) !important;
          border-bottom: 2px solid #CFA34A !important;
        }

        .dnvn-nav-text {
          white-space: normal !important;
          word-break: normal !important;
          display: inline !important;
          text-align: center !important;
        }

        .dnvn-dropdown-panel {
          position: absolute !important;
          top: calc(100% + 4px) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          min-width: 250px !important;
          background-color: #082927 !important;
          background-image: linear-gradient(180deg, #103D3B 0%, #082927 100%) !important;
          border: 1px solid rgba(214, 168, 70, 0.35) !important;
          border-radius: 10px !important;
          padding: 8px 0 !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(214, 168, 70, 0.2) !important;
          z-index: 999999 !important;
          animation: dnvnFadeIn 0.15s ease-out !important;
        }

        .dnvn-dropdown-panel::before {
          content: '' !important;
          position: absolute !important;
          top: -8px !important;
          left: 0 !important;
          right: 0 !important;
          height: 8px !important;
          background: transparent !important;
        }

        .dnvn-dropdown-item {
          display: block !important;
          padding: 9px 16px !important;
          color: #FAF8F3 !important;
          text-decoration: none !important;
          font-size: 13px !important;
          font-weight: 500 !important;
          transition: all 0.15s ease !important;
          border-left: 3px solid transparent !important;
          white-space: normal !important;
          word-break: normal !important;
          line-height: 1.35 !important;
        }

        .dnvn-dropdown-item:hover,
        .dnvn-dropdown-item:focus {
          background-color: rgba(207, 163, 74, 0.2) !important;
          color: #F2D794 !important;
          border-left: 3px solid #CFA34A !important;
          padding-left: 20px !important;
          outline: none !important;
        }

        /* Right Controls */
        .dnvn-nav-right {
          display: flex !important;
          align-items: center !important;
          gap: 7px !important;
          flex-shrink: 0 !important;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1400px) {
          .dnvn-navbar-header { min-height: 70px !important; }
          .dnvn-navbar-spacer { height: 70px !important; }
          .dnvn-header-container { min-height: 70px !important; padding: 6px 14px !important; }
          .dnvn-brand-title { font-size: 18px !important; }
          .dnvn-nav-item-btn { font-size: 13.5px !important; padding: 5px 8px !important; max-width: 125px !important; }
        }

        @media (max-width: 1200px) {
          .dnvn-navbar-header { min-height: 68px !important; }
          .dnvn-navbar-spacer { height: 68px !important; }
          .dnvn-header-container { min-height: 68px !important; padding: 5px 10px !important; gap: 6px !important; }
          .dnvn-brand-title { font-size: 16.5px !important; }
          .dnvn-brand-subtitle { font-size: 7.5px !important; }
          .dnvn-nav-item-btn { font-size: 12.5px !important; font-weight: 600 !important; padding: 4px 6px !important; max-width: 110px !important; }
        }

        .dnvn-mobile-toggle {
          display: none !important;
        }

        @media (max-width: 1080px) {
          .dnvn-nav-categories { display: none !important; }
          .dnvn-btn-join-desktop { display: none !important; }
          .dnvn-mobile-toggle { 
            display: inline-flex !important;
            min-width: 36px !important;
            min-height: 36px !important;
          }
          .dnvn-navbar-header { min-height: 62px !important; }
          .dnvn-navbar-spacer { height: 62px !important; }
          .dnvn-header-container { min-height: 62px !important; padding: 4px 12px !important; }
        }

        @keyframes dnvnFadeIn {
          from { opacity: 0; transform: translate(-50%, -6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      {/* Skip Link phục vụ người dùng phím / Screen Reader */}
      <a href="#main-content" className="skip-link">
        {currentLang === 'en' ? "Skip to main content" : "Chuyển đến nội dung chính"}
      </a>

      <header className="dnvn-navbar-header">
        <div className="dnvn-header-container">
          
          {/* 1. BRAND LOGO */}
          <Link 
            to="/" 
            className="dnvn-brand-link notranslate"
            translate="no"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title={brandConfig.brandName}
          >
            <div className="dnvn-brand-icon notranslate" translate="no">
              <img 
                src="/logo_icon.svg" 
                alt="HungYen.today Logo" 
                className="dnvn-brand-icon-img"
                onError={(e) => { 
                  e.target.src = '/logo_icon.png';
                  e.target.onerror = () => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerText = 'HY';
                  };
                }}
              />
            </div>
            <div className="dnvn-brand-text-box notranslate" translate="no">
              <span className="dnvn-brand-title notranslate" translate="no">
                HungYen<span style={{ color: '#CFA34A' }}>.today</span>
              </span>
              <span className="dnvn-brand-subtitle">
                {currentLang === 'en' ? 'HUNG YEN CONNECTIVITY & INVESTMENT' : 'HỘI TỤ PHÙ SA, KẾT NỐI TƯƠNG LAI'}
              </span>
            </div>
          </Link>

          {/* 2. CENTER: CATEGORIES NAVIGATION */}
          <nav 
            ref={navRef}
            className="dnvn-nav-categories" 
            aria-label="Menu chuyên mục"
          >
            {categoriesList.map((cat) => {
              const subs = getSubList(cat);
              const hasSubs = subs.length > 0;
              const isOpen = activeDropdownId === (cat.id || cat.name);
              const isCatActive = location.pathname === '/posts' && location.search.includes(encodeURIComponent(cat.name));
              const catDisplayName = getCategoryName(cat);

              return (
                <div
                  key={cat.id || cat.name}
                  className="dnvn-cat-wrapper"
                  onMouseEnter={() => handleMouseEnter(cat.id || cat.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={`/posts?category=${encodeURIComponent(cat.name)}`}
                    className={`dnvn-nav-item-btn ${isCatActive ? 'active' : ''}`}
                    aria-expanded={isOpen}
                    aria-haspopup={hasSubs ? 'true' : 'false'}
                    onClick={(e) => {
                      if (window.innerWidth <= 1080 && hasSubs) {
                        e.preventDefault();
                        handleToggleDropdown(cat.id || cat.name, e);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(cat.id || cat.name, e)}
                    title={catDisplayName}
                  >
                    <span className="dnvn-nav-text">{catDisplayName}</span>
                    {hasSubs && (
                      <i 
                        className={`ti ti-chevron-down ${isOpen ? 'rotate' : ''}`}
                        style={{ 
                          fontSize: '10px', 
                          marginLeft: '2px', 
                          opacity: 0.8, 
                          transition: 'transform 0.18s ease',
                          transform: isOpen ? 'rotate(180deg)' : 'none',
                          flexShrink: 0
                        }} 
                      />
                    )}
                  </Link>

                  {/* Mega / Dropdown menu cho lĩnh vực chuyên ngành con */}
                  {hasSubs && isOpen && (
                    <div 
                      className="dnvn-dropdown-panel"
                      role="menu"
                    >
                      {subs.map((sub, idx) => {
                        const subName = typeof sub === 'object' ? sub.name : sub;
                        const subLabel = getSubName(sub);
                        return (
                          <Link
                            key={idx}
                            to={`/posts?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(subName)}`}
                            className="dnvn-dropdown-item"
                            role="menuitem"
                            onClick={() => setActiveDropdownId(null)}
                          >
                            {subLabel}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 3. RIGHT CONTROLS: COMPACT LANGUAGE (VI, EN...), SEARCH, JOIN NETWORK & AUTH */}
          <div className="dnvn-nav-right">
            
            {/* Tìm kiếm nhanh */}
            <Link
              to="/search"
              title={currentLang === 'en' ? 'Search Database' : 'Tìm kiếm dữ liệu'}
              style={{
                color: '#FAF8F3',
                padding: '6px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'color 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#CFA34A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#FAF8F3'; }}
            >
              <i className="ti ti-search" style={{ fontSize: '17px' }}></i>
            </Link>

            {/* Bộ chuyển đổi Đa ngôn ngữ */}
            <div 
              ref={langDropdownRef} 
              className="notranslate"
              translate="no"
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <button
                type="button"
                className="notranslate"
                translate="no"
                onClick={() => setLangDropdownOpen(prev => !prev)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                title="Chuyển đổi ngôn ngữ / Switch Language"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(207, 163, 74, 0.4)',
                  borderRadius: '7px',
                  padding: '5px 9px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(207, 163, 74, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(207, 163, 74, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(207, 163, 74, 0.4)';
                }}
              >
                <span className="notranslate" translate="no">{(currentLang || 'VI').toUpperCase()}</span>
                <i 
                  className="ti ti-chevron-down notranslate" 
                  translate="no"
                  style={{ 
                    fontSize: '9px', 
                    color: '#CFA34A', 
                    transition: 'transform 0.2s ease',
                    transform: langDropdownOpen ? 'rotate(180deg)' : 'none'
                  }} 
                />
              </button>

              {langDropdownOpen && (
                <div
                  className="notranslate"
                  translate="no"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    backgroundColor: '#0F323C',
                    backgroundImage: 'linear-gradient(180deg, #164450 0%, #0F323C 100%)',
                    border: '1px solid rgba(207, 163, 74, 0.45)',
                    borderRadius: '10px',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(207, 163, 74, 0.2)',
                    minWidth: '165px',
                    padding: '6px',
                    zIndex: 100001,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}
                >
                  {(availableLanguages || []).map((lang) => {
                    const isActive = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        className="notranslate"
                        translate="no"
                        onClick={() => {
                          changeLang(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '7px 9px',
                          borderRadius: '6px',
                          border: 'none',
                          background: isActive ? 'rgba(207, 163, 74, 0.22)' : 'transparent',
                          color: isActive ? '#F2D794' : '#FAF8F3',
                          fontSize: '12px',
                          fontWeight: isActive ? '700' : '500',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span className="notranslate" translate="no" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {isActive && <i className="ti ti-check notranslate" translate="no" style={{ color: '#CFA34A', fontSize: '13px' }} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Nút "Đăng ký" (Chỉ hiển thị khi chưa đăng nhập / role === 'guest') */}
            {role === 'guest' && (
              <Link
                to="/register"
                className="dnvn-btn-join-desktop"
                style={{
                  backgroundColor: '#D6A846',
                  backgroundImage: 'linear-gradient(135deg, #E4BF68 0%, #D6A846 100%)',
                  color: '#082927',
                  fontSize: '12px',
                  fontWeight: '800',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(214, 168, 70, 0.35)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(214, 168, 70, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(214, 168, 70, 0.35)';
                }}
              >
                <i className="ti ti-user-plus" style={{ fontSize: '14px' }}></i>
                <span>{currentLang === 'en' ? 'Register' : 'Đăng ký'}</span>
              </Link>
            )}

            {/* Trạng thái Người dùng / Đăng nhập */}
            {role === 'guest' ? (
              <Link
                to="/login"
                className="dnvn-login-btn"
                style={{
                  color: '#FAF8F3',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  padding: '5px 9px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.18s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#CFA34A'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#FAF8F3'; }}
              >
                {currentLang === 'en' ? 'Login' : 'Đăng nhập'}
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                <Link
                  to={role === 'admin' ? "/admin-dashboard" : role === 'creator' ? "/creator-dashboard" : role === 'organizer' ? "/organizer-dashboard" : "/member-dashboard"}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#123B46',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '11.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    border: '1.5px solid #CFA34A',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                  }}
                  title={user?.name || 'Dashboard'}
                >
                  {getInitials(user?.name)}
                </Link>
                <button
                  onClick={logout}
                  title={currentLang === 'en' ? 'Logout' : 'Đăng xuất'}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FAF8F3',
                    opacity: 0.7,
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = '#f87171'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; e.currentTarget.style.color = '#FAF8F3'; }}
                >
                  <i className="ti ti-logout" style={{ fontSize: '15px' }}></i>
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              ref={mobileToggleRef}
              className="dnvn-mobile-toggle"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(207, 163, 74, 0.35)',
                color: '#FAF8F3',
                fontSize: '18px',
                padding: '6px 8px',
                borderRadius: '7px',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={mobileMenuOpen ? (currentLang === 'en' ? "Close mobile menu" : "Đóng menu di động") : (currentLang === 'en' ? "Open mobile menu" : "Mở menu di động")}
              aria-label={mobileMenuOpen ? (currentLang === 'en' ? "Close mobile menu" : "Đóng menu di động") : (currentLang === 'en' ? "Open mobile menu" : "Mở menu di động")}
              aria-expanded={mobileMenuOpen}
              aria-controls="dnvn-mobile-drawer"
            >
              <i className={mobileMenuOpen ? "ti ti-x" : "ti ti-menu-2"}></i>
            </button>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div 
            id="dnvn-mobile-drawer"
            role="region"
            aria-label={currentLang === 'en' ? "Mobile navigation menu" : "Menu điều hướng di động"}
            style={{
              backgroundColor: '#0F323C',
              borderTop: '1px solid rgba(207, 163, 74, 0.25)',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Chuyển ngôn ngữ & Trạng thái trong Drawer */}
            <div className="notranslate" translate="no" style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '12px', color: '#FAF8F3', opacity: 0.8, marginBottom: '8px' }}>
                {currentLang === 'en' ? 'Select Language / Chọn ngôn ngữ:' : 'Chọn ngôn ngữ / Select Language:'}
              </div>
              <div 
                className="notranslate"
                translate="no"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '3px',
                  border: '1px solid rgba(207, 163, 74, 0.25)'
                }}
              >
                {(availableLanguages || []).map((lang) => {
                  const isActive = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      className="notranslate"
                      translate="no"
                      onClick={() => changeLang(lang.code)}
                      style={{
                        background: isActive ? '#CFA34A' : 'transparent',
                        color: isActive ? '#123B46' : '#FAF8F3',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 2px',
                        fontSize: '11px',
                        fontWeight: isActive ? '800' : '500',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        boxShadow: isActive ? '0 2px 6px rgba(207, 163, 74, 0.5)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{lang.flag}</span>
                      <span className="notranslate" translate="no">{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nút Đăng ký trên Mobile (Chỉ hiển thị khi chưa đăng nhập) */}
            {role === 'guest' && (
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  backgroundColor: '#D6A846',
                  color: '#082927',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '800',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '4px'
                }}
              >
                <i className="ti ti-user-plus" style={{ fontSize: '16px' }} />
                <span>{currentLang === 'en' ? 'Register' : 'Đăng ký'}</span>
              </Link>
            )}

            {/* Nút Trợ lý AI trên Mobile */}
            <Link
              to="/ai-chat"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                backgroundColor: 'rgba(207, 163, 74, 0.2)',
                border: '1px solid #CFA34A',
                color: '#F2D794',
                padding: '10px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              <i className="ti ti-sparkles" style={{ color: '#CFA34A', fontSize: '16px' }} />
              <span>{currentLang === 'en' ? 'Hung Yen AI Assistant' : 'Trợ lý AI Hưng Yên'}</span>
            </Link>

            {/* Danh mục cấp 1 & con động trên mobile */}
            {categoriesList.map((cat) => {
              const subs = getSubList(cat);
              const isExpanded = mobileExpandedCatId === (cat.id || cat.name);
              const catDisplayName = getCategoryName(cat);

              return (
                <div key={cat.id || cat.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      to={`/posts?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '600', fontSize: '13.5px', flex: 1, padding: '6px 0' }}
                    >
                      {catDisplayName}
                    </Link>
                    {subs.length > 0 && (
                      <button
                        onClick={() => setMobileExpandedCatId(isExpanded ? null : (cat.id || cat.name))}
                        style={{ background: 'none', border: 'none', color: '#FAF8F3', opacity: 0.7, padding: '4px 8px', fontSize: '14px', cursor: 'pointer' }}
                        aria-label="Mở danh mục con"
                      >
                        <i className={isExpanded ? "ti ti-chevron-up" : "ti ti-chevron-down"}></i>
                      </button>
                    )}
                  </div>

                  {subs.length > 0 && isExpanded && (
                    <div style={{ paddingLeft: '14px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Link
                        to={`/posts?category=${encodeURIComponent(cat.name)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ color: '#CFA34A', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}
                      >
                        👉 {catDisplayName} ({currentLang === 'en' ? 'All Articles' : 'Xem tất cả'})
                      </Link>
                      {subs.map((sub, idx) => {
                        const subName = typeof sub === 'object' ? sub.name : sub;
                        const subLabel = getSubName(sub);
                        return (
                          <Link
                            key={idx}
                            to={`/posts?category=${encodeURIComponent(cat.name)}&subCategory=${encodeURIComponent(subName)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ color: '#E7EEF0', fontSize: '12px', textDecoration: 'none', padding: '4px 0' }}
                          >
                            • {subLabel}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Actions trên mobile */}
            <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {isInstallable && !isInstalled && (
                <button
                  onClick={() => { installApp(); setMobileMenuOpen(false); }}
                  style={{
                    backgroundColor: 'rgba(207, 163, 74, 0.2)',
                    border: '1px solid #CFA34A',
                    color: '#F2D794',
                    textAlign: 'center',
                    padding: '9px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <i className="ti ti-device-mobile-down"></i>
                  <span>{currentLang === 'en' ? 'Install PWA App' : 'Cài đặt ứng dụng PWA'}</span>
                </button>
              )}

              <Link
                to="/guide"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: '#FAF8F3',
                  opacity: 0.9,
                  textDecoration: 'none',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 0'
                }}
              >
                <i className="ti ti-book"></i>
                <span>{currentLang === 'en' ? 'User Guide' : 'Hướng dẫn sử dụng hệ thống'}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Spacer đệm chính xác để không bị nội dung đè lên fixed navbar */}
      <div className="dnvn-navbar-spacer" aria-hidden="true" />
    </>
  );
};

export default Navbar;
