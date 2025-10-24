# 🚀 AI Website Generator

An intelligent web application that leverages AI to generate, edit, and manage website projects with an interactive playground and powerful image manipulation tools.

## ✨ Features

### 🎨 AI-Powered Code Generation
- **Smart Chat Interface**: Generate complete websites using natural language prompts
- **Real-time Preview**: See your code changes instantly in an embedded preview
- **Code Editing**: Edit generated code with live preview updates
- **Multi-frame Projects**: Create and manage multiple pages/frames within a single project

### 🖼️ Advanced Image Management
- **ImageKit Integration**: Professional image hosting and CDN
- **AI Image Generation**: Generate images using Pollinations AI
- **Smart Transformations**:
  - Smart Crop: Intelligent image cropping
  - Resize: Flexible image resizing
  - Upscale: AI-powered image upscaling
  - Background Removal: Automatic background removal
- **Direct Upload**: Upload images directly to ImageKit CDN
- **Live Image Editing**: Select and modify images directly in the preview

### 📁 Project Management
- **Workspace Dashboard**: Organize all your projects in one place
- **Project Tree Navigation**: Expandable sidebar with projects and frames
- **Frame Management**: Create and switch between multiple frames per project
- **Auto-save**: Automatically save code changes to the database

### 🔐 Authentication & User Management
- **Clerk Authentication**: Secure sign-in/sign-up with Clerk
- **User Credits System**: Track user credits for AI operations
- **Email-based Permissions**: User-specific project access

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4
- **Component Library**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Form Management**: React Hook Form + Zod

### Backend
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Clerk
- **Image Processing**: ImageKit
- **AI Integration**: Pollinations AI, OpenAI

### Development Tools
- **Language**: TypeScript 5
- **Package Manager**: npm
- **Database Migrations**: Drizzle Kit

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/faial65/ai-website-generator.git
   cd ai-website-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   
   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # OpenAI (Optional)
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npx drizzle-kit generate
   
   # Push to database
   npx drizzle-kit push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
ai-website-generator/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── api/                 # API routes
│   │   ├── projects/        # Project CRUD operations
│   │   ├── frames/          # Frame management
│   │   ├── users/           # User operations
│   │   └── imagekit/        # Image upload/transform endpoints
│   ├── playground/          # Code editor & preview
│   │   └── _components/
│   │       ├── ChatSection.tsx
│   │       ├── Design.tsx
│   │       ├── ImageSettingsSection.tsx
│   │       └── WebPageTools.tsx
│   ├── workspace/           # Project management dashboard
│   │   └── _components/
│   │       ├── AppSidebar.tsx
│   │       └── CreateProjectDialog.tsx
│   ├── _components/         # Shared components
│   │   ├── Header.tsx
│   │   └── Hero.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/                  # Shadcn UI components
├── config/
│   ├── db.ts               # Database connection
│   └── schema.ts           # Database schema
├── hooks/
│   └── use-mobile.ts
├── lib/
│   └── utils.ts            # Utility functions
├── public/                 # Static assets
├── drizzle/                # Database migrations
├── drizzle.config.ts
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## 🎯 Usage

### Creating a New Project

1. Navigate to the workspace at `/workspace`
2. Click the "**+Add New Project**" button in the sidebar
3. Enter a project name
4. Start coding in the playground!

### Generating Code with AI

1. Open a project in the playground
2. Use the chat interface to describe what you want
3. AI will generate the HTML/CSS/JS code
4. Preview appears automatically
5. Edit the code directly or use chat to refine

### Working with Images

1. **Select an image** in the preview to open image settings
2. **Upload**: Click "Upload Image" to upload from your device
3. **Generate AI**: Enter a prompt to generate an image with AI
4. **Transform**: Apply smart crop, resize, upscale, or remove background
5. **Style**: Adjust width, height, border radius, and object fit

### Saving Your Work

- Code is automatically saved to chat history
- Click the "**Save**" button in the toolbar to save to the frame
- All changes are persisted to the database

## 🗄️ Database Schema

### Users Table
- `id`: Auto-incrementing primary key
- `name`: User's full name
- `email`: Unique email address
- `credits`: Available AI credits (default: 5)

### Projects Table
- `id`: Auto-incrementing primary key
- `projectId`: Unique project identifier (UUID)
- `projectName`: Project name
- `createdBy`: User email (foreign key)
- `createAt`: Creation timestamp

### Frames Table
- `id`: Auto-incrementing primary key
- `frameId`: Unique frame identifier (UUID)
- `code`: HTML/CSS/JS code
- `projectId`: Project reference (foreign key)
- `createdAt`: Creation timestamp

### Chats Table
- `id`: Auto-incrementing primary key
- `chatMessage`: JSON array of chat messages
- `frameId`: Frame reference (foreign key)
- `projectId`: Project reference (foreign key)
- `createdAt`: Creation timestamp

## 🔑 API Endpoints

### Projects
- `GET /api/projects` - Fetch all user projects with frames
- `POST /api/projects/create` - Create a new project

### Frames
- `PUT /api/frames` - Update frame code

### Users
- `POST /api/users` - Create/update user

### ImageKit
- `POST /api/imagekit/upload` - Upload image to ImageKit
- `POST /api/imagekit/generate` - Generate AI image
- `POST /api/imagekit/transform` - Apply image transformations

## 🚧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Database Commands

```bash
# Generate migration files
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push

# Open Drizzle Studio (Database GUI)
npx drizzle-kit studio
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Clerk](https://clerk.com/) - Authentication
- [ImageKit](https://imagekit.io/) - Image CDN & processing
- [Pollinations AI](https://pollinations.ai/) - AI image generation
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📧 Contact

Faisal Ahmed - [@faial65](https://github.com/faial65)

Project Link: [https://github.com/faial65/ai-website-generator](https://github.com/faial65/ai-website-generator)

---

Made with ❤️ by Faisal Ahmed
