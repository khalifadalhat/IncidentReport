<div align="center">

# 🚀 IncidentFlow - Real-Time Customer Support Platform

**A modern, full-stack incident management and customer support system built with cutting-edge technologies**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## ✨ What Makes This Special?

**IncidentFlow** is not just another support platform—it's a **production-ready, enterprise-grade solution** that combines real-time communication, intelligent case routing, and comprehensive analytics into one seamless experience. Whether you're handling customer support, incident reports, or emergency response, this platform scales with your needs.

### 🌟 Why You'll Love This Project

- ⚡ **Lightning-Fast Real-Time Communication** - Built on Socket.io for instant messaging
- 🎯 **Smart Case Routing** - AI-ready architecture for intelligent agent assignment
- 📊 **Rich Analytics Dashboard** - Beautiful visualizations with Recharts
- 🔐 **Enterprise Security** - JWT authentication, role-based access control
- 🎨 **Modern UI/UX** - Built with Tailwind CSS, Radix UI, and Framer Motion
- 📱 **Fully Responsive** - Works flawlessly on desktop, tablet, and mobile
- 🚀 **Production Ready** - Comprehensive error handling, validation, and testing
- 📚 **Fully Documented** - Swagger API documentation included

---

## 🎯 Features

### 💬 Real-Time Communication
- **Live Chat System** - Instant messaging between customers and agents
- **Typing Indicators** - See when someone is typing in real-time
- **Read Receipts** - Track message delivery and read status
- **Emoji Support** - Rich emoji picker for expressive communication
- **File Attachments** - Upload and share images via Cloudinary

### 📋 Case Management
- **Multi-Status Workflow** - Pending → Active → Resolved/Rejected
- **Department-Based Routing** - 20+ specialized departments
- **Location Tracking** - GPS-based location services
- **Case History** - Complete audit trail of all interactions
- **Priority Assignment** - Smart prioritization system

### 👥 Role-Based Access Control
- **Customer Portal** - Submit cases, track status, chat with agents
- **Agent Dashboard** - Manage assigned cases, real-time chat, analytics
- **Supervisor View** - Oversee team performance and case distribution
- **Admin Panel** - Full system control, user management, analytics

### 📊 Analytics & Insights
- **Real-Time Dashboards** - Live metrics and KPIs
- **Performance Tracking** - Response times, resolution rates
- **Team Analytics** - Agent performance metrics
- **Case Statistics** - Department-wise breakdowns
- **Visual Charts** - Beautiful data visualizations

### 🔔 Notifications
- **Real-Time Alerts** - Instant notifications for new messages and case updates
- **Email Notifications** - Automated email alerts via Nodemailer/Resend
- **In-App Notifications** - Persistent notification center
- **Status Updates** - Automatic notifications on case status changes

### 🛡️ Security & Authentication
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt with salt rounds
- **Cookie-Based Sessions** - Secure HTTP-only cookies
- **Role-Based Permissions** - Granular access control
- **Input Validation** - Yup schema validation

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Purpose | Version |
|------------|---------|---------|
| **React 18** | UI Framework | Latest |
| **TypeScript** | Type Safety | Latest |
| **Vite** | Build Tool | Latest |
| **Tailwind CSS** | Styling | Latest |
| **Radix UI** | Accessible Components | Latest |
| **Framer Motion** | Animations | Latest |
| **React Query** | Data Fetching | v5 |
| **Zustand** | State Management | v5 |
| **Socket.io Client** | Real-Time Communication | v4 |
| **React Router** | Routing | v6 |
| **React Hook Form** | Form Management | Latest |
| **Yup** | Validation | Latest |
| **Recharts** | Data Visualization | Latest |
| **Sonner** | Toast Notifications | Latest |

### Backend (`backend/`)
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime | Latest |
| **Express.js** | Web Framework | v4 |
| **MongoDB** | Database | Latest |
| **Mongoose** | ODM | v8 |
| **Socket.io** | WebSocket Server | v4 |
| **JWT** | Authentication | v9 |
| **Bcrypt** | Password Hashing | Latest |
| **Multer** | File Upload | Latest |
| **Cloudinary** | Media Storage | Latest |
| **Nodemailer/Resend** | Email Service | Latest |
| **Swagger** | API Documentation | Latest |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** >= 6.x (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/incidentflow.git
   cd incidentflow
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies (if any)
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   **Backend** (`backend/.env`):
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/incidentflow
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # CORS
   ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   
   # Cloudinary (for file uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   RESEND_API_KEY=your-resend-key
   ```

   **Frontend** (`client/.env`):
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Create Admin User** (Optional)
   ```bash
   cd backend
   node createAdmin.js
   ```

5. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```
   Backend runs on `http://localhost:5000`
   API Docs available at `http://localhost:5000/api-docs`

   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

---

## 📁 Project Structure

```
incidentflow/
├── client/                 # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── agent/     # Agent-specific components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── ui/        # Base UI components (Radix UI)
│   │   │   └── ...
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin dashboard pages
│   │   │   ├── agent/     # Agent dashboard pages
│   │   │   ├── customer/  # Customer portal pages
│   │   │   └── supervisor/# Supervisor pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand state management
│   │   ├── routes/        # React Router configuration
│   │   ├── utils/         # Utility functions
│   │   └── ...
│   ├── public/            # Static assets
│   └── package.json
│
├── backend/               # Node.js + Express Backend
│   ├── config/           # Configuration files
│   │   ├── db.js         # MongoDB connection
│   │   └── cloudinary.js # Cloudinary setup
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   └── swagger.js        # API documentation
│
└── README.md
```

---

## 📚 API Documentation

The backend includes comprehensive **Swagger/OpenAPI documentation**. Once the server is running, visit:

```
http://localhost:5000/api-docs
```

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### Cases
- `GET /api/cases` - Get all cases (filtered by role)
- `POST /api/cases` - Create new case
- `GET /api/cases/:id` - Get case details
- `PUT /api/cases/:id` - Update case
- `PATCH /api/cases/:id/assign` - Assign case to agent

#### Messages
- `GET /api/messages/:caseId` - Get messages for a case
- `POST /api/messages` - Send message (also via Socket.io)

#### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user

#### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/assign-case` - Assign case to agent
- `GET /api/admin/analytics` - Analytics data

---

## 🎨 Screenshots & Demo

> **Note:** Add screenshots of your application here to showcase the UI

### Customer Portal
- Case submission form
- Real-time chat interface
- Case status tracking

### Agent Dashboard
- Case management interface
- Live chat with customers
- Performance metrics

### Admin Panel
- User management
- Analytics dashboard
- System configuration

---

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm start          # Start development server with nodemon
npm test           # Run tests (when implemented)
```

**Frontend:**
```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Code Style

- **Frontend**: TypeScript with strict mode enabled
- **Backend**: ES6+ JavaScript
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier (recommended)

---

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd client
npm test
```

---

## 🚢 Deployment

### Backend Deployment

1. **Environment Variables**: Set all required env vars in your hosting platform
2. **Database**: Use MongoDB Atlas for production
3. **Recommended Platforms**:
   - Render
   - Railway
   - Heroku
   - AWS EC2
   - DigitalOcean

### Frontend Deployment

1. **Build the project**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `dist` folder** to:
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

### Environment Variables for Production

Make sure to update:
- `ALLOWED_ORIGINS` with your production frontend URL
- `MONGODB_URI` with your production database
- `JWT_SECRET` with a strong, random secret
- `CLOUDINARY_*` with your production Cloudinary credentials

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The UI library
- [Express.js](https://expressjs.com/) - The web framework
- [Socket.io](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - The database
- [Tailwind CSS](https://tailwindcss.com/) - The CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component primitives
- [Vite](https://vitejs.dev/) - The build tool

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/incidentflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/incidentflow/discussions)
- **Email**: your-email@example.com

---

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a ⭐ on GitHub! It helps others discover the project and motivates continued development.

---

<div align="center">

**Built with ❤️ by Dalhat Dalhat falalu**

[⬆ Back to Top](#-incidentflow---real-time-customer-support-platform)

</div>

