import React from 'react';
import { Link } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import BuildIcon from '@mui/icons-material/Build';
import './About.css';

const TECH_STACK = {
  backend: {
    title: 'Backend',
    icon: <StorageIcon />,
    items: ['NestJS', 'Python', 'FastAPI', 'Django', 'TypeORM', 'JWT'],
  },
  frontend: {
    title: 'Frontend',
    icon: <WebIcon />,
    items: ['Vue.js', 'React', 'TypeScript', 'Vite', 'Pinia', 'MobX'],
  },
  databases: {
    title: 'Базы данных',
    icon: <CodeIcon />,
    items: ['PostgreSQL', 'TypeORM', 'Prisma', 'Redis'],
  },
  devops: {
    title: 'DevOps & Tools',
    icon: <BuildIcon />,
    items: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Nginx'],
  },
};

const FEATURED_PROJECTS = [
  {
    title: 'PD Projects',
    description: 'Платформа для учебных проектов с модерацией и управлением участниками',
    stack: ['NestJS', 'Vue 3', 'TypeORM', 'PostgreSQL'],
    links: {
      backend: 'https://github.com/IPodymov/pd-projects-backend',
      frontend: 'https://github.com/IPodymov/pd-projects-frontend',
    },
  },
  {
    title: 'Fakegram',
    description: 'Полнофункциональный клон Instagram с постами, историями и чатами',
    stack: ['NestJS', 'React', 'TypeScript', 'PostgreSQL'],
    links: {
      backend: 'https://github.com/IPodymov/fakegram-backend',
      frontend: 'https://github.com/IPodymov/fakegram-frontend',
    },
  },
  {
    title: 'Visualizer',
    description: 'Система визуализации данных с интерактивными графиками',
    stack: ['Python', 'FastAPI', 'Vue 3', 'TypeScript'],
    links: {
      backend: 'https://github.com/IPodymov/visuliser-backend',
      frontend: 'https://github.com/IPodymov/visualizer-front',
    },
  },
];

const PRIORITIES = [
  { emoji: '🎯', title: 'API-First Development', desc: 'Проектирование надёжных и производительных API' },
  { emoji: '⚡', title: 'Modern Frontend', desc: 'Создание отзывчивых SPA с современными фреймворками' },
  { emoji: '🐳', title: 'DevOps & Automation', desc: 'Контейнеризация и автоматизация процессов' },
  { emoji: '📐', title: 'Clean Code', desc: 'Читаемый, поддерживаемый код' },
];

const About: React.FC = () => {
  return (
    <div className="about">
      {/* Hero Section */}
      <section className="about__hero">
        <div className="about__hero-content">
          <img
            src="https://avatars.githubusercontent.com/u/245177356?v=4"
            alt="Ivan Podymov"
            className="about__avatar"
          />
          <div className="about__hero-text">
            <h1>Иван Подымов</h1>
            <p className="about__role">Software Engineer | Full-Stack Developer</p>
            <p className="about__tagline">
              Создаю современные веб-приложения с чистым кодом и элегантной архитектурой
            </p>
            <div className="about__location">
              <LocationOnIcon />
              <span>Москва</span>
            </div>
            <div className="about__socials">
              <a
                href="https://github.com/IPodymov"
                target="_blank"
                rel="noopener noreferrer"
                className="about__social-link"
              >
                <GitHubIcon />
                GitHub
              </a>
              <a
                href="https://t.me/ipodymov"
                target="_blank"
                rel="noopener noreferrer"
                className="about__social-link"
              >
                <TelegramIcon />
                Telegram
              </a>
              <a
                href="mailto:podymovv55@gmail.com"
                className="about__social-link"
              >
                <EmailIcon />
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about__section">
        <div className="about__container">
          <h2 className="section-title">🚀 О себе</h2>
          <div className="about__bio">
            <p>
              Я инженер-программист с опытом разработки полнофункциональных веб-приложений. 
              Специализируюсь на создании масштабируемых backend-систем и интуитивных 
              пользовательских интерфейсов.
            </p>
            <div className="about__code-block">
              <pre>
{`const ivan = {
  role: "Full-Stack Developer",
  code: ["Python", "TypeScript", "JavaScript"],
  focus: ["API Design", "Clean Architecture", "Performance"],
  passion: "Building robust and elegant solutions"
};`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Priorities Section */}
      <section className="about__section about__section--alt">
        <div className="about__container">
          <h2 className="section-title">💡 Мои приоритеты</h2>
          <div className="about__priorities-grid">
            {PRIORITIES.map((priority, index) => (
              <div key={index} className="priority-card">
                <span className="priority-card__emoji">{priority.emoji}</span>
                <h3>{priority.title}</h3>
                <p>{priority.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="about__section">
        <div className="about__container">
          <h2 className="section-title">🛠️ Технологический стек</h2>
          <div className="about__tech-grid">
            {Object.values(TECH_STACK).map((category, index) => (
              <div key={index} className="tech-card">
                <div className="tech-card__header">
                  {category.icon}
                  <h3>{category.title}</h3>
                </div>
                <div className="tech-card__items">
                  {category.items.map((item, i) => (
                    <span key={i} className="tech-tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="about__section about__section--alt">
        <div className="about__container">
          <h2 className="section-title">💼 Избранные проекты</h2>
          <div className="about__projects-grid">
            {FEATURED_PROJECTS.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-card__stack">
                  {project.stack.map((tech, i) => (
                    <span key={i} className="tech-tag tech-tag--small">{tech}</span>
                  ))}
                </div>
                <div className="project-card__links">
                  {project.links.backend && (
                    <a href={project.links.backend} target="_blank" rel="noopener noreferrer">
                      <GitHubIcon /> Backend
                    </a>
                  )}
                  {project.links.frontend && (
                    <a href={project.links.frontend} target="_blank" rel="noopener noreferrer">
                      <GitHubIcon /> Frontend
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote & CTA */}
      <section className="about__section about__section--quote">
        <div className="about__container">
          <blockquote className="about__quote">
            "Хороший код — это код, который легко читать, легко поддерживать и приятно изменять"
          </blockquote>
          <div className="about__cta">
            <p>Открыт для обсуждения проектов, идей и возможностей сотрудничества!</p>
            <Link to="/contacts" className="btn btn-primary btn-lg">
              Обсудить проект
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
