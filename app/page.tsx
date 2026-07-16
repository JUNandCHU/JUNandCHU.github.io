"use client";

import { useEffect, useMemo, useState } from "react";
import { about, categories, entries, type Entry } from "@/content/posts";
import { siteText } from "@/content/site";

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function Home() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selected, setSelected] = useState<Entry | null>(null);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setSearchOpen(true);
      }
      if (event.key === "Escape") { setSearchOpen(false); setSelected(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => { document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);

  const visibleEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const categoryMatches = filter === "All" || entry.category === filter;
      const textMatches = !needle || [entry.title, entry.dek, ...entry.tags].join(" ").toLowerCase().includes(needle);
      return categoryMatches && textMatches;
    });
  }, [filter, query]);

  const toggleSaved = (id: number) => {
    setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="홈으로"><span>{siteText.brandShort}</span><i /><small>{siteText.brandName}</small></a>
        <nav aria-label="주요 메뉴">
          <a href="#notes">Notes</a><a href="#now">Now</a>
          <button className="text-button" onClick={() => setSelected(about)}>About</button>
        </nav>
        <div className="header-tools">
          <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="검색 열기"><span>Search</span><kbd>⌘ K</kbd></button>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="색상 모드 변경"><span className="theme-dot" /></button>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="hero-kicker"><span>{siteText.issue}</span><span>{siteText.edition}</span><span>{siteText.year}</span></div>
        <h1><em>{siteText.heroAccent}</em><br />{siteText.heroMain}</h1>
        <div className="hero-foot">
          <p>{siteText.heroDescription}<br />{siteText.heroDescriptionSecond}</p>
          <a href="#notes" className="round-link" aria-label="글 목록으로 이동">↓</a>
        </div>
        <div className="orbital-mark" aria-hidden="true"><span>RESEARCH · FICTION · MARGINALIA ·</span><b>F</b></div>
      </section>

      <section className="ticker" aria-label="현재 관심사">
        <span>CURRENTLY THINKING ABOUT</span>
        <div>{siteText.ticker.map((item) => <span key={item}>{item} <i>✳</i> </span>)}</div>
      </section>

      <section id="notes" className="notes-section">
        <div className="section-heading">
          <div><span className="eyebrow">01 / THE NOTEBOOK</span><h2>Latest notes</h2></div>
          <p>{siteText.notebookDescription}</p>
        </div>
        <div className="filter-row">
          <div className="filters" role="tablist" aria-label="글 분류">
            {categories.map((category) => (
              <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>
            ))}
          </div>
          <span>{String(visibleEntries.length).padStart(2, "0")} ENTRIES</span>
        </div>
        <div className="entry-list">
          {visibleEntries.map((entry, index) => (
            <article className="entry" key={entry.id}>
              <button className="entry-main" onClick={() => setSelected(entry)}>
                <div className="entry-index">{String(index + 1).padStart(2, "0")}</div>
                <div className={"entry-mark mark-" + entry.category.toLowerCase()}><span>{entry.mark}</span></div>
                <div className="entry-copy">
                  <div className="entry-meta"><span>{entry.category}</span><span>{entry.date}</span><span>{entry.read}</span></div>
                  <h3>{entry.title}</h3><p>{entry.dek}</p>
                  <div className="tag-row">{entry.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
                </div>
                <div className="entry-arrow"><Arrow /></div>
              </button>
              <button className={"save-button " + (saved.includes(entry.id) ? "saved" : "")} onClick={() => toggleSaved(entry.id)} aria-label={saved.includes(entry.id) ? "저장 취소" : "글 저장"}>{saved.includes(entry.id) ? "◆" : "◇"}</button>
            </article>
          ))}
          {visibleEntries.length === 0 && <div className="empty-state">아직 이 단어에 해당하는 노트가 없습니다.</div>}
        </div>
      </section>

      <section id="now" className="now-section">
        <div className="now-title"><span className="eyebrow">02 / NOW</span><h2>On the desk</h2></div>
        <div className="now-grid">
          <div className="now-card featured">
            <span className="card-number">A</span>
            <div><small>RESEARCH QUESTION</small><h3>{siteText.nowQuestion}</h3></div>
            <div className="diagram" aria-hidden="true"><span /><span /><span /></div>
          </div>
          <div className="now-card">
            <span className="card-number">B</span><small>READING</small>
            <h3>{siteText.nowReading}</h3>
            <p>{siteText.nowReadingNote}</p>
          </div>
          <div className="now-card accent">
            <span className="card-number">C</span><small>WRITING</small>
            <h3>{siteText.nowWriting}</h3><p>{siteText.nowWritingStatus}</p>
            <div className="progress"><span /></div>
          </div>
        </div>
      </section>

      <section className="quote-section">
        <span>✳</span><blockquote>“{siteText.quote}”</blockquote><p>— FIELD NOTE, {siteText.year}</p>
      </section>

      <footer>
        <div className="footer-name"><span>{siteText.footerName}</span><small>{siteText.footerRole}</small></div>
        <div className="footer-links"><button onClick={() => setSelected(about)}>About <Arrow /></button><a href="#top">Top ↑</a></div>
        <p>{siteText.copyright}</p>
      </footer>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="사이트 검색" onMouseDown={() => setSearchOpen(false)}>
          <div className="search-box" onMouseDown={(event) => event.stopPropagation()}>
            <div className="search-label"><span>SEARCH THE NOTEBOOK</span><button onClick={() => setSearchOpen(false)}>ESC</button></div>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="제목, 주제, 키워드…" />
            <div className="search-results">
              {visibleEntries.slice(0, 4).map((entry) => (
                <button key={entry.id} onClick={() => { setSelected(entry); setSearchOpen(false); }}>
                  <span>{entry.category}</span><strong>{entry.title}</strong><Arrow />
                </button>
              ))}
              {visibleEntries.length === 0 && <p>검색 결과가 없습니다.</p>}
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="reader-overlay" role="dialog" aria-modal="true" onMouseDown={() => setSelected(null)}>
          <article className="reader" onMouseDown={(event) => event.stopPropagation()}>
            <button className="reader-close" onClick={() => setSelected(null)}>CLOSE <span>×</span></button>
            <div className="reader-head">
              <div className="entry-meta"><span>{selected.category}</span><span>{selected.date}</span><span>{selected.read}</span></div>
              <h2>{selected.title}</h2><p>{selected.dek}</p>
            </div>
            <div className="reader-body">
              <div className="reader-mark">{selected.mark}</div>
              <div>{selected.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
            <div className="reader-foot">
              <div className="tag-row">{selected.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
              <button onClick={() => setSelected(null)}>Back to notes ↓</button>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}
