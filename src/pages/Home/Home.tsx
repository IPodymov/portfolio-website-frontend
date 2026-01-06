import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { githubApi } from '../../api/github';
import type { GitHubUser, GitHubRepo } from '../../types';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';
import './Home.css';

// DRY: Move data constants outside component
const TARGET_REPO_NAMES = [
  'visuliser-backend', 
  'pd-projects-backend',
  'visualizer-front',
  'pd-projects-frontend',
  'fakegram-frontend',
  'portfolio-website-frontend'
];

const CUSTOM_DESCRIPTIONS: Record<string, string> = {
  'visuliser-backend': 'Веб-приложение для визуализации и сравнения образовательных программ. Реализовано на Django + DRF. Поддерживает парсинг Excel, анализ компетенций и сравнение планов.',
  'pd-projects-backend': 'Бэкенд для системы управления проектами на NestJS и PostgreSQL. Реализована JWT авторизация, ролевая модель пользователей, управление учебными заведениями и фильтрация проектов.',
  'visualizer-front': 'Клиентская часть системы визуализации образовательных программ. Разработана на Vue.js. Обеспечивает интерфейс для загрузки планов и просмотра аналитики.',
  'pd-projects-frontend': 'Frontend для системы управления проектами. Написан на Vue.js. Реализует интерфейсы для студентов, преподавателей и администраторов.',
  'fakegram-frontend': 'Instagram-клон на React + TypeScript + Redux Toolkit. Реализованы лента постов, истории, лайки, комментарии и профили пользователей.',
  'portfolio-website-frontend': 'Этот сайт-портфолио. Разработан на React + Vite + TypeScript с использованием Material UI и адаптивной верстки.'
};

const SKILLS = [
    { icon: <AutoAwesomeIcon fontSize="inherit" />, title: 'Frontend', desc: 'React, Vue, TypeScript, Tailwind, HTML5, CSS3' },
    { icon: <StorageIcon fontSize="inherit" />, title: 'Backend', desc: 'Node.js, Python (Django, FastAPI), PostgreSQL, MongoDB' },
    { icon: <BuildIcon fontSize="inherit" />, title: 'Tools', desc: 'Git, Docker, VS Code, Webpack, Vite' },
    { icon: <StarIcon fontSize="inherit" />, title: 'Soft Skills', desc: 'Коммуникабельность, управление временем, решение проблем' },
];

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

        const filteredRepos = reposData.filter(repo => TARGET_REPO_NAMES.includes(repo.name));
        
        const displayRepos = filteredRepos.map(repo => ({
          ...repo,
          description: CUSTOM_DESCRIPTIONS[repo.name] || repo.description
        }));

        setRepos(displayRepos);
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
    <div className="home">
      {/* Hero Section */}
      {user && (
        <section className="home__hero">
          <div className="home__hero-content">
            <div className="home__hero-text">
              <h1 className="home__hero-title">
                Привет, я <span className="home__text-accent">{user.name || user.login}</span>
              </h1>
              <h2 className="home__hero-subtitle">Full-Stack Developer</h2>
              <p className="home__hero-uvp">
                Помогаю компаниям строить масштабируемые веб-приложения с современным стеком и
                чистой архитектурой. Увеличиваю продажи и улучшаю пользовательский опыт через
                качественный код.
              </p>
              <div className="home__hero-actions">
                <Link to="/contacts" className="btn btn-primary btn-lg">
                  Связаться со мной
                </Link>
                <a href="#projects" className="btn btn-outline btn-lg">
                  Мои проекты
                </a>
              </div>
            </div>
            <div className="home__hero-image">
              <img src={user.avatar_url} alt={user.login} className="home__avatar" />
            </div>
          </div>
        </section>
      )}

      {/* Skills Section */}
      <section className="home__skills">
        <h2 className="section-title">Мои навыки</h2>
        <div className="home__skills-list">
          {SKILLS.map((skill, index) => (
             <div className="skill-card" key={index}>
                <div className="skill-card__icon">{skill.icon}</div>
                <h3 className="skill-card__title">{skill.title}</h3>
                <p className="skill-card__description">{skill.desc}</p>
             </div>
          ))}
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="home__projects">
        <h2 className="section-title">Избранные проекты</h2>
        <div className="home__projects-grid">
            {repos.map((repo) => (
                <div key={repo.id} className="project-card">
                    <div className="project-card__header">
                        <h3 className="project-card__title">{repo.name}</h3>
                        {repo.language && (
                            <span className="project-card__lang">{repo.language}</span>
                        )}
                    </div>
                    <p className="project-card__description">{repo.description}</p>
                    <div className="project-card__footer">
                        <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="link-accent"
                        >
                            GitHub
                        </a>
                        {repo.homepage && (
                            <a 
                                href={repo.homepage} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="link-accent"
                            >
                                Demo
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Reviews Teaser */}
      <section className="home__reviews-teaser">
          <h2 className="home__reviews-title">Что говорят клиенты</h2>
          <p className="home__reviews-text">
            Почитайте отзывы от моих заказчиков и коллег, с которыми я работал над различными проектами.
          </p>
          <Link to="/reviews" className="home__reviews-button">
            Читать отзывы
          </Link>
      </section>

      {/* Quick Contact */}
      <section className="home__quick-contact">
        <h2 className="home__contact-title">Давайте работать вместе!</h2>
        <p className="home__contact-text">
          Ищете разработчика для вашего следующего проекта? Свяжитесь со мной любым удобным способом.
        </p>
        <div className="home__contact-links">
          <Link to="/contacts" className="home__contact-link">
            Написать сообщение
          </Link>
          <a href="mailto:ivan@example.com" className="home__contact-link">
            ivan@example.com
          </a>
          <a href="https://t.me/username" target="_blank" rel="noopener noreferrer" className="home__contact-link">
            Telegram
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
