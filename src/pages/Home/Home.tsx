import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { githubStore } from '../../stores';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import StarIcon from '@mui/icons-material/Star';
import './Home.css';

const SKILLS = [
  {
    icon: <AutoAwesomeIcon fontSize="inherit" />,
    title: 'Frontend',
    desc: 'React, Vue, TypeScript, Tailwind, HTML5, CSS3',
  },
  {
    icon: <StorageIcon fontSize="inherit" />,
    title: 'Backend',
    desc: 'Node.js, Python (Django, FastAPI), PostgreSQL, MongoDB',
  },
  {
    icon: <BuildIcon fontSize="inherit" />,
    title: 'Tools',
    desc: 'Git, Docker, VS Code, Webpack, Vite',
  },
  {
    icon: <StarIcon fontSize="inherit" />,
    title: 'Soft Skills',
    desc: 'Коммуникабельность, управление временем, решение проблем',
  },
];

const Home: React.FC = observer(() => {
  useEffect(() => {
    githubStore.loadData();
  }, []);

  if (githubStore.isLoading) return <div className="loading-screen">Загрузка...</div>;

  const { user, displayRepos } = githubStore;

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
          {displayRepos.map((repo) => (
            <div key={repo.id} className="project-card">
              <div className="project-card__header">
                <h3 className="project-card__title">{repo.name}</h3>
                {repo.language && <span className="project-card__lang">{repo.language}</span>}
              </div>
              <p className="project-card__description">{repo.description}</p>
              <div className="project-card__footer">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-accent">
                  GitHub
                </a>
                {repo.homepage && (
                  <a
                    href={repo.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-accent">
                    Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="home__projects-more">
          <a
            href="https://github.com/IPodymov"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline">
            Смотреть все проекты на GitHub
          </a>
        </div>
      </section>

      {/* Reviews Teaser */}
      <section className="home__reviews-teaser">
        <h2 className="home__reviews-title">Что говорят клиенты</h2>
        <p className="home__reviews-text">
          Почитайте отзывы от моих заказчиков и коллег, с которыми я работал над различными
          проектами.
        </p>
        <Link to="/reviews" className="home__reviews-button">
          Читать отзывы
        </Link>
      </section>

      {/* Quick Contact */}
      <section className="home__quick-contact">
        <h2 className="home__contact-title">Давайте работать вместе!</h2>
        <p className="home__contact-text">
          Ищете разработчика для вашего следующего проекта? Свяжитесь со мной любым удобным
          способом.
        </p>
        <div className="home__contact-links">
          <Link to="/contacts" className="home__contact-link">
            Написать сообщение
          </Link>
          <a href="mailto:podymovv55@gmail.com" className="home__contact-link">
            podymovv55@gmail.com
          </a>
          <a
            href="https://t.me/ipodymov"
            target="_blank"
            rel="noopener noreferrer"
            className="home__contact-link">
            Telegram
          </a>
        </div>
      </section>
    </div>
  );
});

export default Home;
