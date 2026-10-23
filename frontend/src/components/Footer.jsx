import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LanguageContext';
import { usePWA } from '../contexts/PWAContext';
import brandConfig from '../brand.config';

export const Footer = () => {
  const { currentLang } = useTranslation();
  const { isInstalled, installApp } = usePWA();

  return (
    <footer style={{
      backgroundColor: '#081D23',
      backgroundImage: 'linear-gradient(180deg, #0F262D 0%, #051419 100%)',
      color: '#B5C4C9',
      padding: '3.5rem 0 1.5rem',
      fontSize: '12.5px',
      borderTop: '1px solid rgba(207, 163, 74, 0.3)',
      lineHeight: '1.65'
    }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Main 4-Column Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Column 1: Logo & Brand Title */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #123B46 0%, #CFA34A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: '900',
                  fontSize: '16px',
                  border: '1px solid rgba(207, 163, 74, 0.5)',
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
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#ffffff',
                    letterSpacing: '-0.3px',
                    lineHeight: '1.1'
                  }}>
                    HungYen<span style={{ color: '#CFA34A' }}>.today</span>
                  </div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: '700',
                    color: '#CFA34A',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    marginTop: '2px'
                  }}>
                    {currentLang === 'en' ? 'CONNECTIVITY, INVESTMENT & TOURISM' : 'HỘI TỤ PHÙ SA, KẾT NỐI TƯƠNG LAI'}
                  </div>
                </div>
              </div>
            </Link>
            <div style={{
              fontSize: '12px',
              color: '#d1e0e5',
              lineHeight: '1.6',
              marginTop: '0.5rem',
              marginBottom: '1rem'
            }}>
              {brandConfig.description}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={installApp}
                title="Cài đặt ứng dụng HungYen.today (PWA)"
                style={{
                  background: 'rgba(207, 163, 74, 0.15)',
                  border: '1px solid rgba(207, 163, 74, 0.4)',
                  color: '#F2D794',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.15)'; }}
              >
                <i className="ti ti-device-mobile-down"></i>
                <span>{isInstalled ? (currentLang === 'en' ? '✓ PWA App Installed' : '✓ Ứng dụng PWA đã cài') : (currentLang === 'en' ? 'Install PWA App' : 'Cài đặt ứng dụng PWA')}</span>
              </button>

              <Link
                to="/guide"
                title={currentLang === 'en' ? 'System User Guide' : 'Hướng dẫn sử dụng hệ thống'}
                style={{
                  background: 'rgba(18, 59, 70, 0.4)',
                  border: '1px solid rgba(207, 163, 74, 0.35)',
                  color: '#FAF8F3',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(18, 59, 70, 0.4)'; }}
              >
                <i className="ti ti-book"></i>
                <span>{currentLang === 'en' ? 'User Guide' : 'Hướng dẫn sử dụng'}</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Agency & Platform Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#7E959E' }}>{currentLang === 'en' ? 'Operating Platform:' : 'Nền tảng vận hành:'}</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>{brandConfig.platformName}</strong>
            </div>
            <div>
              <span style={{ color: '#7E959E' }}>{currentLang === 'en' ? 'Core Mission:' : 'Sứ mệnh cốt lõi:'}</span>{' '}
              <span style={{ color: '#d1e0e5' }}>{brandConfig.tagline}</span>
            </div>
            <div style={{ marginTop: '4px' }}>
              <span style={{ color: '#7E959E' }}>{currentLang === 'en' ? 'Technology Partner:' : 'Đơn vị công nghệ:'}</span>{' '}
              <a href="https://www.adtgroup.net/" target="_blank" rel="noreferrer" style={{ color: '#F2D794', textDecoration: 'none', fontWeight: '600' }}>
                {brandConfig.partnerLegalName} (ADT Group)
              </a>
            </div>
            <div>
              <span style={{ color: '#7E959E' }}>Website:</span>{' '}
              <a href="https://www.adtgroup.net/" target="_blank" rel="noreferrer" style={{ color: '#F2D794', textDecoration: 'none' }}>
                https://www.adtgroup.net/
              </a>
            </div>
          </div>

          {/* Column 3: Contact & Support */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#7E959E' }}>{currentLang === 'en' ? 'Platform Management:' : 'Ban Quản trị Cổng thông tin:'}</span>{' '}
              <strong style={{ color: '#f1f5f9' }}>{currentLang === 'en' ? `Editorial Board of ${brandConfig.brandShortName}` : `Ban Biên Tập ${brandConfig.brandShortName}`}</strong>
            </div>
            <div>
              <span style={{ color: '#7E959E' }}>{currentLang === 'en' ? 'Working Hours:' : 'Giờ làm việc:'}</span>{' '}
              <span style={{ color: '#d1e0e5' }}>{brandConfig.contact.workingHours}</span>
            </div>
            <div style={{ marginTop: '2px' }}>
              <span style={{ color: '#7E959E' }}>{currentLang === 'en' ? 'Support Hotline:' : 'Hotline tiếp nhận:'}</span>{' '}
              <a href={`tel:${brandConfig.contact.hotline.replace(/\s+/g, '')}`} style={{ color: '#CFA34A', fontWeight: '800', textDecoration: 'none', fontSize: '14px' }}>
                {brandConfig.contact.hotline}
              </a>
            </div>
            <div>
              <span style={{ color: '#7E959E' }}>Email:</span>{' '}
              <a href={`mailto:${brandConfig.contact.email}`} style={{ color: '#F2D794', textDecoration: 'none' }}>{brandConfig.contact.email}</a>
            </div>
          </div>

          {/* Column 4: Address & Social Media */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
            <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '13px', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {currentLang === 'en' ? 'Headquarters & Connection' : 'Địa bàn & Trụ sở Kết nối'}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <i className="ti ti-map-pin" style={{ color: '#CFA34A', marginTop: '3px', flexShrink: 0 }}></i>
              <span><strong>{currentLang === 'en' ? 'Location:' : 'Địa bàn:'}</strong> {brandConfig.contact.address}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <a href={`tel:${brandConfig.contact.hotline.replace(/\s+/g, '')}`} style={{ color: '#CFA34A', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-phone"></i> {brandConfig.contact.hotline}
              </a>
              <span style={{ color: '#4A626A' }}>|</span>
              <a href={`mailto:${brandConfig.contact.supportEmail}`} style={{ color: '#d1e0e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <i className="ti ti-mail"></i> {brandConfig.contact.supportEmail}
              </a>
            </div>

            {/* Social Media Links */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11px', color: '#7E959E', marginBottom: '6px' }}>
                {currentLang === 'en' ? 'Technology ecosystem links:' : 'Hệ sinh thái công nghệ & truyền thông:'}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a 
                  href="https://www.adtgroup.net/" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(207, 163, 74, 0.2)', border: '1px solid #CFA34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CFA34A', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title="ADT Group Website"
                >
                  <i className="ti ti-world" style={{ fontSize: '15px' }}></i>
                </a>
                <a 
                  href={brandConfig.socials.facebook} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title={`Facebook ADT Group`}
                >
                  <i className="ti ti-brand-facebook" style={{ fontSize: '16px' }}></i>
                </a>
                <Link 
                  to="/ai-chat"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(207, 163, 74, 0.25)', border: '1px solid #CFA34A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F2D794', textDecoration: 'none', transition: 'transform 0.2s' }}
                  title={brandConfig.aiAssistant.name}
                >
                  <i className="ti ti-sparkles" style={{ fontSize: '15px' }}></i>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '12px',
          color: '#7E959E'
        }}>
          <div>
            {brandConfig.contact.copyright}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <Link
              to="/guide"
              style={{
                color: '#CFA34A',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(207, 163, 74, 0.12)',
                border: '1px solid rgba(207, 163, 74, 0.35)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(207, 163, 74, 0.12)'; }}
            >
              <i className="ti ti-book" style={{ fontSize: '14px' }}></i>
              <span>{currentLang === 'en' ? 'User Guide' : 'Hướng dẫn sử dụng'}</span>
            </Link>
            <Link to="/posts" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              {currentLang === 'en' ? 'Articles & Opportunities' : 'Tin tức & Cơ hội'}
            </Link>
            <Link to="/members" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              {currentLang === 'en' ? 'Enterprises' : 'Doanh nghiệp'}
            </Link>
            <Link to="/events" style={{ color: '#B5C4C9', textDecoration: 'none' }}>
              {currentLang === 'en' ? 'Events' : 'Sự kiện'}
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
