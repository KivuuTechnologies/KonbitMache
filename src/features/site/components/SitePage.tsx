import type { SitePageContent } from '../content';

export function SitePage({ content }: { content: SitePageContent }) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-fey">KonbitMache</p>
      <h1 className="mt-2 text-[clamp(2rem,6vw,2.75rem)] font-extrabold tracking-tight">{content.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted">{content.subtitle}</p>
      <div className="mt-10 space-y-10">
        {content.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-7 text-muted">{paragraph}</p>
            ))}
            {section.list ? (
              <ul className="mt-4 space-y-2">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fey" aria-hidden="true" />
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
