<!-- HERO BANNER -->
<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,50:1D4ED8,100:0EA5E9&height=210&section=header&text=ANTARIN&fontSize=58&fontColor=FFFFFF&fontAlignY=38&desc=Campus%20Ride-Hailing%20(Anjem)%20%26%20Personal%20Shopper%20(Jastip)%20Web%20MVP&descAlignY=63&descSize=16&animation=fadeIn" width="100%" alt="ANTARIN Banner" />
</div>

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-Frontend-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Status](https://img.shields.io/badge/Status-Interactive_MVP-2563EB?style=for-the-badge)](#status--roadmap)

<br />

**[Live Demo](antarin-web-eight.vercel.app)** · **[Workflow Diagram](#how-it-works)** · **[Local Setup](#getting-started)** · **[Report Issue](https://github.com/abdulgani89/antarin-frontend/issues)**

</div>

---

> [!NOTE]
> **Prototype Mode:** This repository hosts the interactive frontend MVP for **ANTARIN**, designed for the Universitas Negeri Semarang (UNNES) student ecosystem. Core booking flows run with structured mock data while backend API and payment webhook integrations are staged in the roadmap.

## Interface Showcase

<div align="center">
  <table>
    <tr>
      <td align="center"><b>1. Home & Service Picker</b></td>
      <td align="center"><b>2. Split Jastip Order Form</b></td>
      <td align="center"><b>3. Driver & Receipt Flow</b></td>
    </tr>
    <tr>
      <td align="center">
        <img src="./docs/screen-home.png" width="230" alt="ANTARIN Home Screen" />
      </td>
      <td align="center">
        <img src="./docs/screen-jastip.png" width="230" alt="ANTARIN Jastip Screen" />
      </td>
      <td align="center">
        <img src="./docs/screen-driver.png" width="230" alt="ANTARIN Driver Screen" />
      </td>
    </tr>
  </table>
  <sub><i>Mobile-first views captured in responsive viewport (390×844)</i></sub>
</div>

---

## Why ANTARIN?

Campus errands and rides around university areas are typically coordinated through messy group chats—leading to unclear fares, unverified drivers, and disputes over shopping totals.

> [!TIP]
> **Key Product & Architectural Decisions**
> - **Two-Step Jastip Reconciliation:** Customers submit an *estimated item price* upfront; drivers upload the purchase receipt and input the *actual fixed price* to eliminate price disputes.
> - **Zero Customer E-Wallet Balance:** Keeps the MVP lean and avoids ledger/regulatory overhead by using direct **Dynamic QRIS** and cash settlements.
> - **Campus Trust Guardrails:** Designed around UNNES Google SSO & Student ID (KTM) driver verification, online/offline driver toggles, and a **Rp150.000** per-order Jastip cap to limit financial risk.

---

## How It Works

```mermaid
flowchart TD
    A["👤 Customer Opens ANTARIN"] --> B{"Select Service"}
    B -- "🛵 Anjem (Campus Ride)" --> C["Enter Pickup & Drop-off Points"]
    B -- "🛒 Jastip (Personal Shopper)" --> D["Enter Item List & Estimated Price<br/>(Max. Rp150.000 Cap)"]
    C --> E["Driver Matching<br/>(Auto / Manual Pick)"]
    D --> F["Driver Matching<br/>(Auto / Manual Pick)"]
    E --> G["Driver Completes Ride"]
    F --> H["Driver Purchases Item, Uploads Receipt<br/>& Inputs Actual Fixed Price"]
    G --> I["💳 Direct Settlement<br/>Dynamic QRIS / Cash"]
    H --> I
    I --> J["✅ Order Completed & Rating"]
```

---

## Core Modules & Roles

| Role | Key Capabilities |
| :--- | :--- |
| **Customer** | Book **Anjem** or **Jastip**, choose auto/manual driver matching, track estimated vs. final itemized cost, and submit post-order reviews. |
| **Driver** | Toggle online/offline availability, accept campus requests, upload shopping receipts with fixed pricing, and monitor earnings (min. withdrawal Rp20.000). |
| **Admin** | Review and approve student driver registrations (KTM verification) and oversee operational workflows. |

---

## Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,tailwind,vercel,postgres,prisma&theme=dark" alt="Tech Stack Icons" />
</div>

- **Frontend (Implemented):** Next.js (App Router), React, Tailwind CSS
- **Deployment:** Vercel
- **Companion Backend Architecture (Planned):** PostgreSQL & Prisma (`users`, `orders`, `reviews`)

---

## Getting Started

```bash
# 1. Clone the repository
git clone [https://github.com/abdulgani89/antarin-frontend.git](https://github.com/abdulgani89/antarin-frontend.git)
cd antarin-frontend

# 2. Install dependencies
npm install

# 3. Copy environment variables (if applicable)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

Open `http://localhost:3000` in your browser (enable Chrome DevTools Mobile View for the intended experience).

<details>
<summary><b>📂 Click to view Project Structure</b></summary>

```text
antarin-frontend/
├── docs/               # Mobile UI screenshots for README showcase
├── public/             # Static icons, logos, and compressed assets
├── src/
│   ├── app/            # Next.js App Router pages (customer, driver, admin)
│   ├── components/     # Reusable UI components
│   └── data/           # Mock data and service configuration
├── .env.example        # Environment variable template
└── README.md
```

</details>

---

## Status & Roadmap

- [x] Mobile-first UI prototype for **Anjem** and **Jastip** flows
- [x] Split Jastip pricing flow (estimated price → receipt upload & actual price)
- [x] Driver status toggle & Admin approval interface
- [ ] Connect frontend to PostgreSQL/Prisma REST API
- [ ] Integrate UNNES Google SSO & Dynamic QRIS payment webhook

---

## Author

<div align="center">

**Muhamad Abdul Gani**

[![GitHub](https://img.shields.io/badge/GitHub-abdulgani89-181717?style=flat-square&logo=github)](https://github.com/abdulgani89)
[![Live Project](https://img.shields.io/badge/Other_Project-Gamasrent-2563EB?style=flat-square&logo=vercel)](https://gamasrent.vercel.app)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0EA5E9,50:1D4ED8,100:0F172A&height=100&section=footer" width="100%" alt="Footer Wave" />

</div>
