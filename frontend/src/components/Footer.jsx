import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { usePWA } from '../contexts/PWAContext';
import brandConfig from '../brand.config';

export const Footer = () => {
  const { currentLang } = useTranslation();
  const { isInstalled, installApp } = usePWA();

  const isEn = currentLang === 'en';

  return (
    <footer style={{
      backgroundColor: '#07181D',
      backgroundImage: 'linear-gradient(180deg, #0C2329 0%, #051418 100%)',
      color: '#B5C4C9',
      padding: '4rem 0 1.75rem',
      fontSize: '13px',
      borderTop: '1px solid rgba(207, 163, 74, 0.35)',
      lineHeight: '1.7',
      position: 'relative'
    }}>
      {/* Decorative Top Accent Glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        maxWidth: '90%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #CFA34A, transparent)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main 4-Column Modern Tech Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Column 1: Brand & Strategic Mission */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #123B46 0%, #CFA34A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '18px',
                  border: '1.5px solid rgba(207, 163, 74, 0.6)',
                  boxShadow: '0 4px 16px rgba(207, 163, 74, 0.25)',
                  flexShrink: 0
                }}>
                  <img 
                    src="/logo_icon.svg" 
                    alt="HungYen.today Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { 
                      e.target.src = '/logo_icon.png';
                      e.target.onerror = () => {
                        e.target.style.display = 'none';
                        e.target.parentNode.innerText = 'HY';
                      };
                    }}
                  />
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Be Vietnam Pro', 'Outfit', sans-serif",
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#ffffff',
                    letterSpacing: '-0.3px',
                    lineHeight: '1.1'
                  }}>
                    HungYen<span style={{ color: '#CFA34A' }}>.today</span>
                  </div>
                  <div style={{
                    fontSize: '9.5px',
                    fontWeight: '700',
                    color: '#CFA34A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginTop: '3px'
                  }}>
                    {isEn ? 'CONNECTIVITY, INVESTMENT & TOURISM' : 'HỘI TỤ PHÙ SA • KẾT NỐI TƯƠNG LAI'}
                  </div>
                </div>
              </div>
            </Link>

            <p style={{
              fontSize: '12.5px',
              color: '#C8D7DC',
              lineHeight: '1.65',
              marginBottom: '1.25rem'
            }}>
              {isEn 
                ? 'HungYen.today is a high-tech regional investment and digital economy portal powered by ADT Group, connecting global investors, industrial ecosystems, and cultural heritage of Hung Yen province.'
                : 'Cổng thông tin kinh tế số, xúc tiến đầu tư và kết nối hệ sinh thái doanh nghiệp tỉnh Hưng Yên do ADT Group phát triển công nghệ — Kết nối dòng vốn, công nghiệp công nghệ cao và di sản Phố Hiến.'
              }
            </p>

            {/* Quick Action Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={installApp}
                title="Cài đặt ứng dụng HungYen.today (PWA)"
                style={{
                  background: 'rgba(207, 163, 74, 0.15)',
                  border: '1px solid rgba(207, 163, 74, 0.45)',
                  color: '#F2D794',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.15)'; }}
              >
                <i className="ti ti-device-mobile-down" style={{ fontSize: '14px' }}></i>
                <span>{isInstalled ? (isEn ? '✓ PWA Installed' : '✓ Ứng dụng đã cài') : (isEn ? 'Install PWA App' : 'Cài đặt ứng dụng PWA')}</span>
              </button>

              <Link
                to="/guide"
                title={isEn ? 'System User Guide' : 'Hướng dẫn sử dụng hệ thống'}
                style={{
                  background: 'rgba(18, 59, 70, 0.45)',
                  border: '1px solid rgba(207, 163, 74, 0.35)',
                  color: '#FAF8F3',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(18, 59, 70, 0.45)'; }}
              >
                <i className="ti ti-book" style={{ fontSize: '14px' }}></i>
                <span>{isEn ? 'User Guide' : 'Hướng dẫn sử dụng'}</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Economic & Investment Pillars */}
          <div>
            <div style={{
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '4px', height: '14px', backgroundColor: '#CFA34A', borderRadius: '2px', display: 'inline-block' }} />
              {isEn ? 'Key Growth Pillars' : 'Trục Kinh Tế Trọng Điểm'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px' }}>
              <li>
                <Link to="/posts?category=%C4%90%E1%BA%A7u%20t%C6%B0%20%26%20D%E1%BB%B1%20%C3%A1n" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-chevron-right" style={{ color: '#CFA34A', fontSize: '12px' }}></i>
                  {isEn ? 'Industrial Parks & FDI Promotion' : 'KCN Thăng Long II & Xúc tiến Đầu tư FDI'}
                </Link>
              </li>
              <li>
                <Link to="/posts?category=Doanh%20nghi%E1%BB%87p%20%26%20S%E1%BA%A3n%20ph%E1%BA%A9m" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-chevron-right" style={{ color: '#CFA34A', fontSize: '12px' }}></i>
                  {isEn ? 'OCOP & King-Tribute Longan Specialties' : 'Nông sản OCOP & Nhãn lồng Tiến vua'}
                </Link>
              </li>
              <li>
                <Link to="/posts?category=V%C4%83n%20h%C3%B3a%20%26%20Di%20s%E1%BA%A3n" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-chevron-right" style={{ color: '#CFA34A', fontSize: '12px' }}></i>
                  {isEn ? 'Pho Hien Historical Port & Heritage Sites' : 'Quần thể Di tích Quốc gia Phố Hiến'}
                </Link>
              </li>
              <li>
                <Link to="/posts?category=%C4%90%C3%B4%20th%E1%BB%8B%20%26%20B%E1%BA%A5t%20%C4%91%E1%BB%99ng%20s%E1%BA%A3n" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-chevron-right" style={{ color: '#CFA34A', fontSize: '12px' }}></i>
                  {isEn ? 'Ecopark Green Township & Modern Real Estate' : 'Đô thị Sinh thái Ecopark Văn Giang'}
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-chevron-right" style={{ color: '#CFA34A', fontSize: '12px' }}></i>
                  {isEn ? 'Trade Promotion & B2B Matchmaking Events' : 'Sự kiện Xúc tiến Thương mại & Hội nghị B2B'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ADT Digital Technology Solutions */}
          <div>
            <div style={{
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '4px', height: '14px', backgroundColor: '#CFA34A', borderRadius: '2px', display: 'inline-block' }} />
              {isEn ? 'ADT Digital Solutions' : 'Giải Pháp Số ADT Group'}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '12.5px' }}>
              <li>
                <Link to="/ai-chat" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-sparkles" style={{ color: '#CFA34A', fontSize: '13px' }}></i>
                  {isEn ? 'AI Tourism & Investment Assistant' : 'Trợ lý Trí tuệ Nhân tạo AI Hưng Yên'}
                </Link>
              </li>
              <li>
                <a href="#giai-phap-chuyen-doi-so" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-map-2" style={{ color: '#CFA34A', fontSize: '13px' }}></i>
                  {isEn ? 'Digital Heritage Map & Interactive VR/AR' : 'Bản đồ số & Tương tác VR/AR Di sản'}
                </a>
              </li>
              <li>
                <a href="#giai-phap-chuyen-doi-so" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-building-store" style={{ color: '#CFA34A', fontSize: '13px' }}></i>
                  {isEn ? 'Omnichannel Distribution & E-Commerce' : 'Hệ thống Phân phối Số & Sàn Giao thương'}
                </a>
              </li>
              <li>
                <Link to="/members" style={{ color: '#C8D7DC', textDecoration: 'none', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-id-badge-2" style={{ color: '#CFA34A', fontSize: '13px' }}></i>
                  {isEn ? 'Digital Enterprise Membership Network' : 'Mạng lưới Định danh & Thẻ số Hội viên'}
                </Link>
              </li>
              <li>
                <a href="https://www.adtgroup.net/" target="_blank" rel="noreferrer" style={{ color: '#F2D794', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="ti ti-external-link" style={{ fontSize: '13px' }}></i>
                  {isEn ? 'About ADT Group Technology Ecosystem' : 'Khám phá Hệ sinh thái Công nghệ ADT Group'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Investment Partnership */}
          <div>
            <div style={{
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ width: '4px', height: '14px', backgroundColor: '#CFA34A', borderRadius: '2px', display: 'inline-block' }} />
              {isEn ? 'Partnership & Hotline' : 'Hợp Tác & Kết Nối'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <i className="ti ti-map-pin" style={{ color: '#CFA34A', marginTop: '3px', flexShrink: 0, fontSize: '15px' }}></i>
                <div>
                  <strong style={{ color: '#ffffff' }}>{isEn ? 'Location:' : 'Địa bàn:'}</strong> {brandConfig.contact.address}
                </div>
              </div>

              <div style={{
                background: 'rgba(207, 163, 74, 0.12)',
                border: '1px solid rgba(207, 163, 74, 0.35)',
                borderRadius: '10px',
                padding: '10px 14px',
                marginTop: '4px'
              }}>
                <div style={{ fontSize: '11px', color: '#B5C4C9', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                  {isEn ? 'Investment Promotion Hotline' : 'Hotline Hỗ Trợ Xúc Tiến Đầu Tư'}
                </div>
                <a 
                  href={`tel:${brandConfig.contact.hotline.replace(/\s+/g, '')}`} 
                  style={{ color: '#F2D794', fontWeight: '800', textDecoration: 'none', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="ti ti-phone-call" style={{ color: '#CFA34A' }}></i>
                  {brandConfig.contact.hotline}
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="ti ti-mail" style={{ color: '#CFA34A', flexShrink: 0, fontSize: '15px' }}></i>
                <div>
                  <span style={{ color: '#8EA1A8' }}>Email:</span>{' '}
                  <a href={`mailto:${brandConfig.contact.email}`} style={{ color: '#C8D7DC', textDecoration: 'none' }}>
                    {brandConfig.contact.email}
                  </a>
                </div>
              </div>

              {/* Social & AI Connect */}
              <div style={{ marginTop: '6px' }}>
                <div style={{ fontSize: '11px', color: '#8EA1A8', marginBottom: '8px' }}>
                  {isEn ? 'Connect with our ecosystem:' : 'Kết nối mạng lưới công nghệ:'}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a 
                    href="https://www.adtgroup.net/" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(207, 163, 74, 0.15)', border: '1px solid rgba(207, 163, 74, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2D794', textDecoration: 'none', transition: 'transform 0.2s' }}
                    title="ADT Group Website"
                  >
                    <i className="ti ti-world" style={{ fontSize: '16px' }}></i>
                  </a>
                  <a 
                    href={brandConfig.socials.facebook} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', transition: 'transform 0.2s' }}
                    title="Facebook ADT Group"
                  >
                    <i className="ti ti-brand-facebook" style={{ fontSize: '17px' }}></i>
                  </a>
                  <Link 
                    to="/ai-chat"
                    style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: 'rgba(18, 59, 70, 0.6)', border: '1px solid #CFA34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2D794', textDecoration: 'none', transition: 'transform 0.2s' }}
                    title={brandConfig.aiAssistant.name}
                  >
                    <i className="ti ti-sparkles" style={{ fontSize: '16px' }}></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Clean Footer Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          fontSize: '12px',
          color: '#8EA1A8'
        }}>
          <div>
            © 2026 <strong>HungYen.today</strong>. Nền tảng số thuộc hệ sinh thái <strong>ADT Group</strong>. Bảo lưu mọi quyền.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Link to="/posts" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              {isEn ? 'Articles & Projects' : 'Cơ hội & Dự án'}
            </Link>
            <Link to="/members" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              {isEn ? 'Enterprises' : 'Doanh nghiệp'}
            </Link>
            <Link to="/events" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              {isEn ? 'Events' : 'Sự kiện'}
            </Link>
            <Link to="/guide" style={{ color: '#CFA34A', textDecoration: 'none', fontWeight: '600' }}>
              {isEn ? 'User Guide' : 'Hướng dẫn sử dụng'}
            </Link>
            <a href="https://www.adtgroup.net/" target="_blank" rel="noreferrer" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              ADT Group
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
