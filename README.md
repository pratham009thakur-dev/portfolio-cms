# Full-Stack Portfolio with Integrated Blog & Headless CMS

A production-grade developer portfolio with a dynamic blogging system and secure CMS dashboard, built for the **Codec Technologies Internship**. Engineered using React, Vite, Node.js, Express, MongoDB Atlas, and Tailwind CSS.

---

## 1. Features

### Public Portfolio
- **Hero / Intro**: Headline, developer bio, resume download, GitHub & LinkedIn links.
- **About & Education**: Professional career overview, core engineering focus areas.
- **Skills Grid**: Organized technical categories (Frontend, Backend, Databases, Cloud tooling).
- **Projects Showcase**: Dynamic projects retrieved from MongoDB with live tags, GitHub repos, and demo URLs.
- **Experience Timeline**: Career history with roles and responsibilities.
- **Contact Pipeline**: Validated contact form that saves inquiries to MongoDB with instant toast feedback.
- **Engineering Blog**: Public articles with search, category filtering, reading views, and tags.

### Administrator CMS Dashboard
- **JWT Authentication**: Password hashing with bcrypt, protected route middleware.
- **Dashboard Overview**: In-depth statistics for articles, active projects, and unread inquiries.
- **Blog Engine**: Full CRUD with slug generation, Markdown editor, and instant publish/unpublish toggling.
- **Project Manager**: Add, edit, reorder, or delete portfolio projects displayed on the frontend.
- **Inbound Message Center**: Read, mark as read, and delete contact inquiries.

---

## 2. Technology Stack

- **Frontend**: React.js 18, Vite, React Router 6, Tailwind CSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas via Mongoose ODM
- **Security**: JSON Web Tokens (JWT), bcrypt (12 salt rounds), CORS whitelist
- **Deployment**: Vercel (Frontend SPA + Serverless API Functions)

---

## 3. Local Installation & Development

### Prerequisites
- Node.js (v18.0.0 or later)
- npm (v9.0.0 or later)
- Free MongoDB Atlas cluster or local MongoDB instance

### Step 1: Clone Repository
```bash
git clone [https://github.com/your-username/portfolio-cms.git](https://github.com/pratham009-dev/portfolio-cms.git)
cd portfolio-cms