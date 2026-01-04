import React, { useEffect, useState } from 'react';
import { githubApi } from '../../api/github';
import type { GitHubUser, GitHubRepo } from '../../types';
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
        setRepos(reposData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  // Calculate stats
  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
  const languages = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      {user && (
        <div className="home-hero">
          <div className="home-hero-left">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="home-avatar"
            />
            <h1 className="home-name">{user.name || user.login}</h1>
            <p className="home-status">Software Engineer | Full-Stack Developer</p>
            <p className="home-summary">
              Я инженер-программист с опытом разработки полнофункциональных веб-приложений. 
              Специализируюсь на создании масштабируемых backend-систем и интуитивных 
              пользовательских интерфейсов.
            </p>
            <div className="home-profile-link">
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary">
                GitHub Profile
              </a>
            </div>
          </div>
          
          <div className="home-hero-right">
            <h2>Fullstack Developer</h2>
            <p className="home-description">
              Создаю современные веб-приложения с чистым кодом и элегантной архитектурой.
            </p>
            <div className="home-priorities">
              <h3>Мои приоритеты:</h3>
              <ul>
                <li><strong>API-First Development</strong> — проектирование надёжных и производительных API</li>
                <li><strong>Modern Frontend</strong> — создание отзывчивых SPA с современными фреймворками</li>
                <li><strong>DevOps & Automation</strong> — контейнеризация и автоматизация процессов разработки</li>
                <li><strong>Clean Code</strong> — читаемый, поддерживаемый и хорошо протестированный код</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <h2>Статистика разработки</h2>
      <div className="home-stats-grid">
        <div className="home-stat-card">
          <h3>Репозитории</h3>
          <p className="home-stat-value">
            {user?.public_repos}
          </p>
        </div>
        <div className="home-stat-card">
          <h3>Звезды</h3>
          <p className="home-stat-value">
            {totalStars}
          </p>
        </div>
        <div className="home-stat-card">
          <h3>Языки</h3>
          <ul className="home-languages-list">
            {Object.entries(languages).map(([lang, count]) => (
              <li key={lang} className="home-language-item">
                <span>{lang}</span>
                <span className="home-language-count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
