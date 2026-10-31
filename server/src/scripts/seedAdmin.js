require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Missing MONGODB_URI in environment variables');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed Administrator
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'AdminSecurePassword123!';

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({
        name: 'Alex Rivera (Lead Engineer)',
        email: adminEmail,
        password: adminPassword,
      });
      console.log(`[Seed] Created initial Admin: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Sample Projects if empty
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.create([
        {
          title: 'Distributed Cloud Event Streamer',
          description:
            'A high-throughput message streaming platform built with Node.js and Redis, processing real-time telemetry events with under 15ms latency.',
          technologies: ['Node.js', 'Express', 'Redis', 'Docker', 'MongoDB'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com',
          imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
          featured: true,
          order: 1,
        },
        {
          title: 'Algorithmic Trading Dashboard',
          description:
            'Interactive analytics platform providing real-time financial chartings, automated backtesting indicators, and risk factor notifications.',
          technologies: ['React', 'Tailwind CSS', 'Chart.js', 'Node.js', 'WebSockets'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
          featured: true,
          order: 2,
        },
        {
          title: 'Enterprise Headless Content Engine',
          description:
            'A scalable content management system utilizing atomic architecture, custom markdown processors, and granular JWT-based permissions.',
          technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind CSS'],
          githubUrl: 'https://github.com',
          liveUrl: 'https://example.com',
          imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          featured: false,
          order: 3,
        },
      ]);
      console.log('[Seed] Populated initial projects.');
    }

    // 3. Seed Sample Blogs if empty
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      await BlogPost.create([
        {
          title: 'Architecting Resilient RESTful APIs with Node and Express',
          slug: 'architecting-resilient-restful-apis-with-node-and-express',
          excerpt:
            'A deep dive into graceful error handling, structured logging, defensive input validation, and connection pool reliability in production microservices.',
          content: `Building scalable web applications demands more than just writing route handlers. In production systems, software engineers must account for unexpected failures, network timeouts, and resource contention.

### 1. Defensive Input Validation
Never trust client input. Always sanitize request parameters and payloads using standard schema validators or rigorous model guards before hitting domain services.

### 2. Centralized Error Pipelines
Implement an Express global error handling middleware that differentiates between operational errors (400, 404, 401) and unhandled programmer bugs (500), masking raw database tracebacks in client responses.

### 3. Graceful Connection Management
When running across containerized environments or serverless platforms like Vercel, keep database connection states cached to prevent connection exhaustion.`,
          coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
          author: 'Alex Rivera',
          category: 'Backend',
          tags: ['Node.js', 'Express', 'Architecture', 'REST'],
          isPublished: true,
          publishedAt: new Date(),
        },
        {
          title: 'Mastering Modern Dark Theme Typography and Tailwind UI',
          slug: 'mastering-modern-dark-theme-typography-and-tailwind-ui',
          excerpt:
            'How to balance contrast ratios, font hierarchies, and slate undertones to craft immersive and eye-friendly dark mode developer interfaces.',
          content: `High contrast does not mean using pure black (#000000) and pure white (#FFFFFF). In fact, pure contrast causes extreme eye strain during extended work periods.

### The Power of Slate and Zinc
Modern visual design relies on rich dark tones such as slate-900 or zinc-950. These shades give depth to UI cards, borders, and input surfaces while allowing brand accent colors to stand out.

### Micro-Interactions Matter
Hover states, smooth button border transitions, and subtle glows enhance digital tactile feedback without overwhelming visitor attention.`,
          coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
          author: 'Alex Rivera',
          category: 'Frontend',
          tags: ['React', 'TailwindCSS', 'UI/UX', 'Design'],
          isPublished: true,
          publishedAt: new Date(),
        },
      ]);
      console.log('[Seed] Populated initial blog posts.');
    }

    console.log('[Seed] Completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error]: ${error.message}`);
    process.exit(1);
  }
};

seedData();