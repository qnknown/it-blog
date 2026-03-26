import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про нас",
  description:
    "Code IT — український блог про frontend, backend, DevOps, AI та кібербезпеку для розробників, які хочуть рости швидше.",
  openGraph: {
    title: "Про Code IT",
    description:
      "Хто ми, яку маємо редакційну політику, де з нами зв'язатися та де слідкувати за проєктом.",
    type: "website",
  },
};

const foundedAt = "17 березня 2026";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/codeit-ua" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/codeit-ua" },
  { label: "X (Twitter)", href: "https://x.com/codeit_ua" },
  { label: "Telegram", href: "https://t.me/codeit_ua" },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-14 border-b-2 border-zinc-200/60 pb-12 dark:border-zinc-800/60">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-(--accent-light) px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-600 dark:bg-(--accent)/10">
          <span className="h-2 w-2 rounded-full bg-cyan-600" />
          Про проєкт
        </span>
        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          Code IT
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed font-medium text-zinc-600 dark:text-zinc-400">
          Незалежний український блог для розробників і технічних команд. Пишемо практично:
          від архітектури, frontend та backend до DevOps, AI та безпеки.
        </p>
      </header>

      <div className="grid gap-12">
        <section className="grid gap-8 border-b border-zinc-200/70 pb-12 dark:border-zinc-800/70 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Для кого блог
            </h2>
            <ul className="mt-5 space-y-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />Розробники junior/middle/senior, які хочуть системно рости.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />Тімліди та інженери, що ухвалюють технічні рішення.</li>
              <li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-600" />Студенти й світчери, яким потрібна зрозуміла технічна база.</li>
            </ul>
          </div>
          <div className="md:border-l md:border-zinc-200/70 md:pl-8 dark:md:border-zinc-800/70">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Дата заснування
            </h2>
            <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {foundedAt}
            </p>
            <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              Почали як невеликий технічний майданчик із фокусом на якісний контент українською.
              Сьогодні Code IT охоплює ключові теми сучасної розробки та інженерної культури.
            </p>
          </div>
        </section>

        <section className="border-b border-zinc-200/70 pb-12 dark:border-zinc-800/70">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Редакційна політика
          </h2>
          <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <p className="border-l-2 border-cyan-600/40 pl-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-zinc-100">Практичність:</strong> публікуємо
              матеріали, які можна застосувати в роботі сьогодні.
            </p>
            <p className="border-l-2 border-cyan-600/40 pl-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-zinc-100">Прозорість:</strong> даємо
              контекст, джерела та обмеження рішень, а не лише &quot;кращу практику&quot;.
            </p>
            <p className="border-l-2 border-cyan-600/40 pl-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-zinc-100">Якість:</strong> редагуємо тексти,
              перевіряємо технічну коректність і регулярно оновлюємо застарілі статті.
            </p>
            <p className="border-l-2 border-cyan-600/40 pl-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              <strong className="text-zinc-900 dark:text-zinc-100">Етичність:</strong> не публікуємо
              маніпулятивний контент і позначаємо партнерські матеріали окремо.
            </p>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Контакти
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              Для партнерств, питань по контенту або пропозицій тем пиши на:
            </p>
            <a
              href="mailto:hello@codeit.ua"
              className="mt-4 inline-flex border-b-2 border-cyan-600 pb-1 text-lg font-bold tracking-tight text-cyan-600 transition hover:opacity-80"
            >
              hello@codeit.ua
            </a>
          </div>
          <div className="md:border-l md:border-zinc-200/70 md:pl-8 dark:md:border-zinc-800/70">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              Соцмережі
            </h2>
            <ul className="mt-4 grid gap-3 text-base font-semibold">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-zinc-700 transition hover:text-cyan-600 dark:text-zinc-300"
                  >
                    {item.label}
                    <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
