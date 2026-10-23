# 🚀 HƯỚNG DẪN TRIỂN KHAI PRODUCTION HỆ THỐNG HUNGYEN.TODAY TRÊN VPS (PORT 3031)

Tài liệu này hướng dẫn chi tiết từng bước triển khai hệ thống **HungYen.today** trên máy chủ VPS (Ubuntu/Debian hoặc CentOS/aaPanel) sử dụng **Node.js 18+**, **MySQL 8.0**, tiến trình **PM2** chạy tại **Port 3031**, và **Nginx Reverse Proxy kèm chứng chỉ SSL Let's Encrypt**.

---

## 📋 THÔNG SỐ KỸ THUẬT HỆ THỐNG

- **Tên nền tảng**: HungYen.today (Hưng Yên Today)
- **Thông điệp**: *“Hội tụ phù sa, kết nối tương lai”*
- **Kho mã nguồn GitHub**: `https://github.com/dev-adt/hungyen-today.git`
- **Cổng dịch vụ Backend (Node.js)**: **`3031`** *(Đã cô lập độc lập, không xung đột với các dịch vụ cũ)*
- **Tên miền Production**: `hungyen.today` & `www.hungyen.today`
- **Thư mục cài đặt trên VPS**: `/www/wwwroot/hungyen.today` (hoặc `/var/www/hungyen.today`)

---

## 🛠️ BƯỚC 1: CÀI ĐẶT MÔI TRƯỜNG & KHỞI TẠO CƠ SỞ DỮ LIỆU MYSQL

### 1.1. Cài đặt các gói phần mềm cần thiết (nếu VPS mới):
```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 18 LTS hoặc 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx mysql-server certbot python3-certbot-nginx

# Cài đặt trình quản lý tiến trình PM2 toàn cục
sudo npm install -g pm2
```

### 1.2. Khởi tạo Cơ sở Dữ liệu MySQL:
Đăng nhập vào MySQL:
```bash
sudo mysql -u root -p
```
Chạy các câu lệnh SQL để tạo database và user:
```sql
CREATE DATABASE hungyen_today_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tạo user chuyên dụng hoặc cấp quyền cho root
-- (Thay 'MatKhauBaoMatCuaBan2026@' bằng mật khẩu an toàn)
CREATE USER IF NOT EXISTS 'hungyen_user'@'localhost' IDENTIFIED BY 'MatKhauBaoMatCuaBan2026@';
GRANT ALL PRIVILEGES ON hungyen_today_db.* TO 'hungyen_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📂 BƯỚC 2: CLONE MÃ NGUỒN VÀ CẤU HÌNH BIẾN MÔI TRƯỜNG (.ENV)

### 2.1. Clone mã nguồn từ GitHub:
```bash
cd /www/wwwroot
git clone https://github.com/dev-adt/hungyen-today.git hungyen.today
cd hungyen.today
```

### 2.2. Import cấu trúc CSDL 16 bảng và Dữ liệu hạt giống Hưng Yên:
```bash
mysql -u hungyen_user -p hungyen_today_db < schema.sql
```
*(Hoặc dùng phpMyAdmin trên aaPanel để Import tệp `schema.sql` vào `hungyen_today_db`)*.

### 2.3. Cấu hình file `.env`:
Tạo file `.env` từ file mẫu `.env.example`:
```bash
cp .env.example .env
nano .env
```
Cấu hình nội dung `.env` chuẩn chỉnh cho Production:
```env
# Cấu hình Cổng chạy (Port 3031)
PORT=3031
NODE_ENV=production
SITE_URL=https://hungyen.today
DEMO_SITE_URL=https://hungyen.today
JWT_SECRET=hungyen_today_secret_jwt_key_adt_2026_xyz

# Thương hiệu
APP_NAME=HungYen.today Platform
BRAND_NAME=HungYen.today
BRAND_SHORT_NAME=Hưng Yên Today
AI_AGENT_NAME=Hưng Yên AI Assistant
SUPPORT_EMAIL=contact@hungyen.today

# Cơ sở dữ liệu MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=hungyen_user
DB_PASSWORD=MatKhauBaoMatCuaBan2026@
DB_NAME=hungyen_today_db

# Trí tuệ nhân tạo (Google Gemini RAG)
GEMINI_API_KEY=dien_gemini_api_key_cua_ban_tai_day
OPENROUTER_API_KEY=

# Gửi mail thông báo SMTP (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=email_cua_ban@gmail.com
SMTP_PASS=mat_khau_ung_dung_gmail_16_ky_tu
SMTP_FROM_NAME=Ban Biên Tập HungYen.today
SMTP_FROM="HungYen.today" <contact@hungyen.today>
```

---

## 📦 BƯỚC 3: CÀI ĐẶT DEPENDENCIES & COMPILE FRONTEND BUILD

### 3.1. Cài đặt Backend Dependencies:
```bash
npm install
```

### 3.2. Cài đặt Frontend Dependencies & Build:
```bash
cd frontend
npm install
npm run build
cd ..
```
> **Ghi chú**: Vite được cấu hình tự động biên dịch toàn bộ mã nguồn React SPA, nén mã nguồn, tạo hash cache-busting và xuất thẳng ra thư mục `/public` tại thư mục gốc của dự án.

---

## ⚡ BƯỚC 4: KHỞI CHẠY TIẾN TRÌNH BACKEND VỚI PM2 (PORT 3031)

File `ecosystem.config.js` đã được thiết lập sẵn tên tiến trình `hungyen-today` và cổng `3031`.

Khởi chạy bằng PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Kiểm tra trạng thái tiến trình và log:
```bash
# Xem trạng thái
pm2 status

# Xem log thời gian thực
pm2 logs hungyen-today

# Kiểm tra port 3031 đang lắng nghe
netstat -tulpn | grep 3031
```

---

## 🌐 BƯỚC 5: CẤU HÌNH NGINX REVERSE PROXY & CHỐNG DÍNH CACHE

### 5.1. Tạo cấu hình Virtual Host Nginx:
Tạo file cấu hình `/etc/nginx/sites-available/hungyen.today` (hoặc dán vào phần cấu hình vhost trên giao diện aaPanel):

```nginx
# ─────────────────────────────────────────────────────────────
# Nginx Configuration cho HungYen.today
# Domain: hungyen.today & www.hungyen.today | Port: 3031
# ─────────────────────────────────────────────────────────────

server {
    listen 80;
    server_name hungyen.today www.hungyen.today;

    # Gzip nén dữ liệu
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    client_max_body_size 50M;

    # 1. API & Backend Reverse Proxy trỏ vào Port 3031
    location /api/ {
        proxy_pass         http://127.0.0.1:3031;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_read_timeout 180s;
        proxy_connect_timeout 15s;
    }

    # 2. Uploaded Media
    location ^~ /uploads/ {
        proxy_pass         http://127.0.0.1:3031;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        expires            30d;
        add_header         Cache-Control "public, max-age=2592000";
    }

    # 3. Vite Hashed Assets (Cache dài hạn 1 năm)
    location /assets/ {
        root    /www/wwwroot/hungyen.today/public;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 4. Media files tĩnh (Cache 7 ngày)
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|woff2)$ {
        root    /www/wwwroot/hungyen.today/public;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # 5. Static HTML & SPA Fallback: CHỐNG DÍNH CACHE index.html
    location / {
        root  /www/wwwroot/hungyen.today/public;
        index index.html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }
}
```

### 5.2. Kích hoạt Virtual Host & Reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/hungyen.today /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 BƯỚC 6: CÀI ĐẶT CHỨNG CHỈ BẢO MẬT SSL LET'S ENCRYPT MIỄN PHÍ

Chạy công cụ Certbot tự động cấp phát SSL và cấu hình HTTPS:
```bash
sudo certbot --nginx -d hungyen.today -d www.hungyen.today
```
- Chọn tự động chuyển hướng toàn bộ lượt truy cập HTTP sang HTTPS (`Redirect: Yes`).
- Chứng chỉ Let's Encrypt sẽ tự động gia hạn trước khi hết hạn mỗi 90 ngày.

---

## 🔄 BƯỚC 7: QUY TRÌNH CẬP NHẬT CODE KHI CÓ THAY ĐỔI (CI/CD BẰNG TAY)

Mỗi khi đẩy code mới lên GitHub và muốn cập nhật trên VPS, chỉ cần thực hiện 4 lệnh sau:
```bash
cd /www/wwwroot/hungyen.today

# 1. Kéo mã nguồn mới nhất về
git pull origin main

# 2. Build lại Frontend nếu có thay đổi giao diện
cd frontend && npm install && npm run build && cd ..

# 3. Cập nhật dependency Backend nếu có thêm thư viện
npm install

# 4. Tải lại tiến trình PM2 không gián đoạn (Zero-Downtime Reload)
pm2 reload hungyen-today
```

---

## 🔑 TÀI KHOẢN QUẢN TRỊ VIÊN MẶC ĐỊNH

- **Đường dẫn đăng nhập quản trị**: `https://hungyen.today/login`
- **Tên đăng nhập (Username)**: `admin`
- **Mật khẩu (Password)**: `Admin@123`
*(Vui lòng đổi mật khẩu ngay sau khi đăng nhập lần đầu tại trang Cấu hình Admin)*.

---

*Tài liệu được biên soạn và đồng bộ chuẩn hóa cho nền tảng HungYen.today bởi ADT Quốc tế.*
