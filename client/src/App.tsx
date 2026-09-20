import "./App.css";
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not configured");
}

const getClickUrl = (sub1: "hero" | "products" | "bottom") => {
  const url = new URL("/click", apiUrl);

  url.searchParams.set("offer", "Dell");
  url.searchParams.set("sub1", sub1);

  return url.toString();
};

const benefits = [
  {
    number: "01",
    title: "Продуманный дизайн",
    description:
      "Современные устройства Dell сочетают практичность, аккуратный внешний вид и удобство ежедневного использования.",
  },
  {
    number: "02",
    title: "Для работы и дома",
    description:
      "Решения для повседневных задач, удалённой работы, учёбы, творчества и развлечений.",
  },
  {
    number: "03",
    title: "Широкий выбор",
    description:
      "Ноутбуки, настольные компьютеры, мониторы и аксессуары для разных сценариев использования.",
  },
];

function App() {
  return (
    <div className="page">
      <header className="header">
        <a className="logo" href="#" aria-label="Dell — главная">
          DELL
        </a>

        <nav className="navigation" aria-label="Основная навигация">
          <a href="#about">О Dell</a>
          <a href="#benefits">Преимущества</a>
          <a href="#products">Продукты</a>
        </nav>

        <a
          className="button button--small"
          href={getClickUrl("hero")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Смотреть решения
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero__content">
            <span className="eyebrow">Технологии для ваших задач</span>

            <h1>Откройте возможности Dell</h1>

            <p>
              Надёжные и современные устройства для продуктивной работы,
              творчества и повседневной жизни.
            </p>

            <div className="hero__actions">
              <a
                className="button"
                href={getClickUrl("hero")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Выбрать устройство
              </a>

              <a className="text-link" href="#about">
                Узнать больше <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <div className="laptop">
              <div className="laptop__screen">
                <div className="laptop__glow" />
                <span>DELL</span>
              </div>
              <div className="laptop__base" />
            </div>

            <div className="floating-card floating-card--top">
              <strong>Создано для продуктивности</strong>
              <span>Работайте в своём ритме</span>
            </div>

            <div className="floating-card floating-card--bottom">
              <strong>Современные решения</strong>
              <span>Для дома и бизнеса</span>
            </div>
          </div>
        </section>

        <section className="about section" id="about">
          <div>
            <span className="eyebrow">Dell Technologies</span>
            <h2>Технологии, которые помогают двигаться вперёд</h2>
          </div>

          <div className="about__text">
            <p>
              Dell создаёт компьютерные решения для самых разных задач — от
              ежедневной работы и обучения до профессиональных проектов.
            </p>
            <p>
              Практичный дизайн, современные технологии и разнообразие
              конфигураций позволяют подобрать устройство под индивидуальные
              потребности.
            </p>
          </div>
        </section>

        <section className="benefits section" id="benefits">
          <div className="section-heading">
            <span className="eyebrow">Почему Dell</span>
            <h2>Всё необходимое для комфортной работы</h2>
          </div>

          <div className="benefits__grid">
            {benefits.map((benefit) => (
              <article className="benefit-card" key={benefit.number}>
                <span className="benefit-card__number">{benefit.number}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="products section" id="products">
          <div className="products__content">
            <span className="eyebrow">Найдите своё устройство</span>
            <h2>Решения для каждого сценария</h2>
            <p>
              Изучите актуальный ассортимент ноутбуков, настольных компьютеров,
              мониторов и аксессуаров Dell.
            </p>

            <a
              className="button button--light"
              href={getClickUrl("products")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Перейти к предложениям
            </a>
          </div>

          <div className="products__list">
            <article>
              <span>01</span>
              <div>
                <h3>Для повседневных задач</h3>
                <p>Универсальные устройства для дома, учёбы и общения.</p>
              </div>
            </article>

            <article>
              <span>02</span>
              <div>
                <h3>Для продуктивной работы</h3>
                <p>Надёжные решения для офиса и удалённой работы.</p>
              </div>
            </article>

            <article>
              <span>03</span>
              <div>
                <h3>Для ярких впечатлений</h3>
                <p>Производительные устройства для творчества и развлечений.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="final-cta section">
          <span className="eyebrow">Готовы начать?</span>
          <h2>Выберите Dell для своих новых возможностей</h2>
          <p>
            Познакомьтесь с устройствами и найдите решение, которое подходит
            именно вам.
          </p>

          <a
            className="button"
            href={getClickUrl("bottom")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Посмотреть предложения
          </a>
        </section>
      </main>

      <footer className="footer">
        <a className="logo logo--footer" href="#" aria-label="Dell — главная">
          DELL
        </a>

        <p>
          Информационная страница. Dell и логотип Dell являются товарными
          знаками Dell Inc.
        </p>

        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;
