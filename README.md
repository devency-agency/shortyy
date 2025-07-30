# 🔗 Shortyy – Link Shortening Service

[![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)

**Built by Devency Agency**  
A **source‑available** Flask + React app for lightweight, time‑limited link shortening. Core logic has been redacted; the client has granted us permission to semi‑open‑source this project, which is running live at [shortyy.click](https://shortyy.click).


## 🔑 Features

- **Custom short URLs** (alphanumeric, configurable length)  
- **Auto‑expiry** of links (6 hours → 1 year)  
- **QR code generation** for quick sharing  
- **Basic abuse protection** (rate limiting, reCAPTCHA stub)  
- **Analytics**: safe vs. unsafe view counts  
- **Reporting**: users can flag malicious links  
- **JWT‑secured** admin API (core methods stubbed)  
- **Minimal React frontend** (fully open source)


## 🚀 Live Site

Visit the live service at:  
https://shortyy.click


## ⚙️ Environment Variables

Add a `.env` or export these before running:

```bash
# Flask backend
export DATABASE_URL="postgresql://user:pass@host/dbname"   # or leave redacted
export JWT_SECRET_KEY="your-jwt-secret"
export SHORT_URL_LENGTH="6"
export DEBUG_MODE="False"
export CAPTCHA_DEBUG_MODE="False"
````

See `config.example.py` for templates.


## 📖 Usage / Examples

### Shorten a link

```http
POST /shorten
Content-Type: application/json

{
  "url":    "https://example.com/very/long/path",
  "expiry": "MjRo",       # one of the Base64 keys: Nmg=, MjRo, M2Q=, …
  "captcha":"<token>"     # stubbed in public version
}
```

**Response:**

```json
{
  "short_url": "a1B2c3",
  "qr_code":   "<base64‑png>"
}
```

### Redirect to original

```http
GET /a1B2c3
```

Browser will be redirected (302) to the original URL if not expired.

### Report a link

```http
GET /report?url=a1B2c3&token=<captcha‑token> # again (captcha) is stubbed in public version
```

Flags the link for admin review.


## 📜 API Reference

| Endpoint       | Method | Description                                       |
| :------------- | :----- | :------------------------------------------------ |
| `/shorten`     | POST   | Create a new short link (JSON payload)            |
| `/<short_url>` | GET    | Redirect to the original URL (if not expired)     |
| `/report`      | GET    | Report a short link for review (query params)     |
| `/admin/*`     | \*     | Admin routes (JWT required; stubs in public repo) |


## 🔧 Admin Panel

Manage your entire link‑shortening service from one place.
![Admin Dashboard Overview](gifs/demo1.gif)
> View metrics and details of created links.

![Link Management & Reporting](gifs/demo2.gif)
> Total links created, total-reports created.

### 🎯 Key Features

- **Secure JWT Login:** Only admins with valid tokens can access the panel.  
- **Report Queue:**  
  - View flagged/malicious links  
  - Approve or disable reported URLs in bulk  
  - Add notes or escalate to higher‑level review  
- **Link Analytics:**  
  - Chart views over time (safe vs. unsafe)  
  - Top referring domains & geolocations  
- **Manual Link Control:**  
  - Force‑expire or extend expiry on any link  
  - Regenerate custom slugs  
- **User Management (Future):**  
  - Create/manage admin/user roles  
  - Audit log of all admin actions  
- **Configuration:**  
  - Adjust global settings (e.g., default expiry windows)  
  - Enable/disable reCAPTCHA or rate limits  


## 📂 Folder Structure

```
.
├── app/                        # Flask application (semi‑open)
│   ├── templates/              # Jinja2 HTML templates
│   │   ├── index.html          # Main HTML template (mounts React frontend)
│   │   └── App.tsx             # Frontend react code
│   ├── __init__.py             # App factory, limiter & JWT setup
│   ├── admin.py                # Admin blueprint routes (JWT‑protected; core logic redacted)
│   ├── database.py             # SQLAlchemy models & init_db()
│   ├── routes.py               # Public API & redirect endpoints
│   └── utils.py                # Core URL, Validator, Admin & Analytics classes (stubs/redacted)
├── config.example.py           # Example configuration (env‑vars placeholders)
├── requirements.txt            # Python dependencies
└── README.md                   # Project overview, setup & usage instructions
```

## 🤝 Contributing

Contributions welcome!
Please open an issue or submit a pull request.

> *Core backend methods remain stubbed in this public repo.*


## 📜 License

This repository is **source‑available** under the MIT License.
Core security‑sensitive modules are **proprietary** and not included here.
See [`LICENSE`](./LICENSE) for details.


## 📫 Private Access & Licensing

For the complete, production‑ready codebase, email us at **[info@devency.net](mailto:info@devency.net)** for licensing options or private repo access.


## 🛣️ Roadmap

* [ ] Role‑based admin dashboard (private)
* [ ] Automated tests & CI/CD pipeline

## 👤 Authors

**Devency Agency**  
🌐 [https://devency.net](https://devency.net)  
✉️ [info@devency.net](mailto:info@devency.net)  

## 🏷️ Badges

![GitHub stars](https://img.shields.io/github/stars/devency-agency/shortyy)
![MIT License](https://img.shields.io/badge/license-MIT-blue)

*Thank you for exploring our source‑available project!* 🚀
