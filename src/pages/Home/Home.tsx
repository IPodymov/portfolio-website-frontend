import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { githubApi } from '../../api/github';
import type { GitHubUser, GitHubRepo } from '../../types';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';
import './Home.css';

const Home: React.FC = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, reposData] = await Promise.all([
          githubApi.getUser(),
          githubApi.getRepos(),
        ]);
        setUser(userData);
        // Sort repos by stars and take top 3
        const sortedRepos = reposData
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 3);
        setRepos(sortedRepos);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-screen">Загрузка...</div>;

  return (
    <div className="home-container">
      {/* Hero Section */}
      {user && (
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Привет, я <span className="text-accent">{user.name || user.login}</span>
              </h1>
              <h2 className="hero-subtitle">Full-Stack Developer</h2>
              <p className="hero-uvp">
                Помогаю компаниям строить масштабируемые веб-приложения с современным стеком и
                чистой архитектурой. Увеличиваю продажи и улучшаю пользовательский опыт через
                качественный код.
              </p>
              <div className="hero-actions">
                <Link to="/contacts" className="btn btn-primary btn-lg">
                  Связаться со мной
                </Link>
                <a href="#projects" className="btn btn-outline btn-lg">
                  Мои проекты
                </a>
              </div>
            </div>
            <div className="hero-image">
              <img src={user.avatar_url} alt={user.login} className="avatar-large" />
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section className="skills-section">
        <h2 className="section-title">Мои навыки</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <div className="skill-icon"><AutoAwesomeIcon fontSize="inherit" /></div>
            <h3>Frontend</h3>
            <p>React, Vue, TypeScript, Tailwind, HTML5, CSS3</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><StorageIcon fontSize="inherit" /></div>
            <h3>Backend</h3>
            <p>Node.js, NestJS, Python, FastAPI, PostgreSQL</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon"><BuildIcon fontSize="inherit" /></div>
            <h3>Tools</h3>
            <p>Docker, Git, CI/CD, Webpack, Vite, Linux</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <h2 className="section-title">Избранные проекты</h2>
        <div className="projects-grid">
          {repos.map((repo) => (
            <div key={repo.id} className="project-card">
              <div className="project-header">
                <h3>{repo.name}</h3>
                <span className="project-lang">{repo.language}</span>
              </div>
              <p className="project-desc">
                {repo.description || 'Описание проекта в разработке...'}
              </p>
              <div className="project-footer">
                <div className="project-stats">
                  <span><StarIcon fontSize="small" style={{ verticalAlign: 'text-bottom' }} /> {repo.stargazers_count}</span>
                </div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent">
                  Посмотреть код &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <a
            href={user?.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline">
            Посмотреть все на GitHub
          </a>
        </div>
      </section>

      {/* Social Proof / Reviews Teaser */}
      <section className="reviews-teaser-section">
        <div className="reviews-teaser-content">
          <h2>Что говорят клиенты</h2>
          <p>Доверие — основа успешного сотрудничества. Посмотрите отзывы о моей работе.</p>
          <Link to="/reviews" className="btn btn-primary">
            Читать отзывы
          </Link>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="quick-contact-section">
        <h2>Готовы начать проект?</h2>
        <p>Напишите мне, и мы обсудим детали вашего будущего приложения.</p>
        <div className="contact-links">
          <a href="mailto:podymovv55@gmail.com" className="contact-link">
            📧 podymovv55@gmail.com
          </a>
          <Link to="/contacts" className="contact-link">
            📱 Форма связи
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
