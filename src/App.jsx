import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import portrait from '../assets/portrait-color-web.jpg'
import brandImage from '../assets/project-brand.png'
import comicLianqi from '../assets/comic-lianqi-web.jpg'
import comicDaxia from '../assets/comic-daxia-web.jpg'
import TrueFocus from './components/TrueFocus/TrueFocus'

const ShapeBlur = lazy(() => import('./components/ShapeBlur/ShapeBlur'))
const publicAsset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

const Arrow = ({ diagonal = false }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={diagonal ? 'M5 19 19 5M8 5h11v11' : 'M5 12h14M14 6l6 6-6 6'} />
  </svg>
)

const strengths = [
  { no: '01', title: 'AI 视觉生成', en: 'AI VISUAL', text: '熟悉 Midjourney、Seedance、可灵、Grok 等工具，保持角色、场景与风格的一致性。' },
  { no: '02', title: '创意与叙事', en: 'STORYTELLING', text: '从脚本、分镜到镜头节奏，能把抽象卖点转化为适合传播的视觉故事。' },
  { no: '03', title: '品牌视觉', en: 'BRAND SYSTEM', text: '以策略为起点建立视觉语言，让画面既有记忆点，也服务于品牌表达与商业目标。' },
  { no: '04', title: '动态与后期', en: 'MOTION & EDIT', text: '掌握 Premiere Pro、After Effects、C4D 与剪映，完成从素材到成片的闭环交付。' },
]

const gameNames = [
  'Shine On, Bella: Merge & Love',
  'Shine On, Bella: Merge & Love',
  'Shine On, Bella: Merge & Love',
  'Pretty Boutique: Merge & Love',
  'Pretty Boutique: Merge & Love',
  'Pretty Boutique: Merge & Love',
]

const gameVideos = Array.from({ length: 6 }, (_, index) => ({
  src: publicAsset(`videos/game/${index + 1}.mp4`),
  no: String(index + 1).padStart(2, '0'),
  title: `Creative ${String(index + 1).padStart(2, '0')}`,
  gameName: gameNames[index],
  role: '创意脚本 / AI 视觉生成 / 剪辑包装',
  tools: 'Midjourney / Seedance / Premiere Pro',
  format: '海外竖屏游戏买量素材',
}))

const comicProjects = [
  {
    no: '01',
    title: '炼气 3000 层',
    subtitle: '开局收女帝为徒',
    badge: '腾讯精品漫剧',
    image: comicLianqi,
    video: publicAsset('videos/comic/daxia-zhenyaolu.mp4'),
    detail: '参与角色与场景视觉资产生成、镜头调整及成片剪辑。',
    meta: [
      { label: 'ROLE', value: '视觉资产 / 镜头生成 / 剪辑' },
      { label: 'STATUS', value: '商业化上线' },
    ],
  },
  {
    no: '02',
    title: '大夏镇妖录',
    subtitle: '黑猪传',
    badge: '腾讯精品漫剧',
    image: comicDaxia,
    video: publicAsset('videos/comic/lianqi-3000.mp4'),
    detail: '参与角色与场景视觉资产生成、镜头调整及成片剪辑。',
    meta: [
      { label: 'ROLE', value: '视觉资产 / 镜头生成 / 剪辑' },
      { label: 'STATUS', value: '商业化上线' },
    ],
  },
]

function OrbitVideo({ item, active }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) video.play().catch(() => {})
    else video.pause()
  }, [active])

  return (
    <video
      ref={videoRef}
      src={item.src}
      muted
      loop
      playsInline
      preload={active ? 'auto' : 'metadata'}
      draggable="false"
      onLoadedMetadata={(event) => {
        if (!active && event.currentTarget.duration > 0.12) event.currentTarget.currentTime = 0.12
      }}
    />
  )
}

function GameOrbit({ items, onPreview }) {
  const [rotation, setRotation] = useState(0)
  const drag = useRef({ active: false, moved: false, startX: 0, startRotation: 0 })
  const angleStep = 360 / items.length
  const frontIndex = ((Math.round(-rotation / angleStep) % items.length) + items.length) % items.length

  const startDrag = (event) => {
    drag.current = { active: true, moved: false, startX: event.clientX, startRotation: rotation }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!drag.current.active) return
    if (Math.abs(event.clientX - drag.current.startX) > 6) drag.current.moved = true
    setRotation(drag.current.startRotation + (event.clientX - drag.current.startX) * 0.24)
  }

  const endDrag = (event) => {
    drag.current.active = false
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <div
      className="game-orbit"
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={(event) => setRotation((value) => value - event.deltaY * 0.035)}
      aria-label="可拖动浏览的游戏买量视频"
      data-reveal
    >
      <div className="game-orbit-stage">
        {items.map((item, index) => {
          const angle = (index * angleStep + rotation) * (Math.PI / 180)
          const depth = Math.cos(angle)
          const x = Math.sin(angle) * 525
          const y = -depth * 28 + Math.abs(Math.sin(angle)) * 42
          const scale = 0.74 + ((depth + 1) / 2) * 0.3
          const isFront = index === frontIndex

          return (
            <article
              className={`orbit-card ${isFront ? 'is-front' : ''}`}
              key={item.src}
              onClick={() => {
                if (isFront && !drag.current.moved) {
                  onPreview({
                    ...item,
                    badge: '游戏买量广告',
                    title: item.gameName,
                    subtitle: item.title,
                    video: item.src,
                    detail: '海外 Merge 游戏投放素材 · 创意构思 / AI 生成 / 剪辑包装',
                    meta: [
                      { label: 'ROLE', value: item.role },
                      { label: 'TOOLS', value: item.tools },
                      { label: 'FORMAT', value: item.format },
                    ],
                  })
                }
              }}
              style={{
                '--orbit-x': `${x}px`,
                '--orbit-y': `${y}px`,
                '--orbit-z': `${depth * 280}px`,
                '--orbit-scale': scale,
                '--orbit-opacity': 0.36 + ((depth + 1) / 2) * 0.64,
                zIndex: Math.round((depth + 1) * 50),
              }}
            >
              <OrbitVideo item={item} active={isFront} />
              <div className="orbit-card-shade" />
              <span className="orbit-index">{item.no}</span>
              <div className="orbit-label">
                <span>GAME AD · {item.title}</span>
                <strong>{item.gameName}</strong>
                {isFront && <em>CLICK TO PREVIEW ↗</em>}
              </div>
            </article>
          )
        })}
      </div>
      <div className="orbit-guide">
        <span>按住拖动</span>
        <i><b /></i>
        <span>DRAG TO EXPLORE</span>
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [activePreview, setActivePreview] = useState(null)
  const [activeSection, setActiveSection] = useState('top')

  useEffect(() => {
    const items = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sectionIds = ['top', 'about', 'videos', 'comic']
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveSection(visible.target.id)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.15, 0.35] },
    )
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activePreview) return undefined
    const closeOnEscape = (event) => event.key === 'Escape' && setActivePreview(null)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activePreview])

  const go = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-media" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={brandImage}
            onCanPlay={() => setVideoReady(true)}
            className={videoReady ? 'is-ready' : ''}
          >
            <source src={publicAsset('hero-video.mp4')} type="video/mp4" />
          </video>
          <div className="hero-grid" />
          <div className="hero-shade" />
        </div>
        <div className="shape-blur-layer" aria-hidden="true">
          <Suspense fallback={null}>
            <ShapeBlur
              variation={0}
              pixelRatioProp={typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1}
              shapeSize={0.5}
              roundness={0.5}
              borderSize={0.05}
              circleSize={0.5}
              circleEdge={0.7}
            />
          </Suspense>
        </div>

        <nav className="nav shell">
          <button className="monogram" onClick={() => go('#top')} aria-label="回到顶部">
            <span>SONG</span> JIALE
          </button>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            <button className={activeSection === 'top' ? 'is-active' : ''} onClick={() => go('#top')}>首页</button>
            <button className={activeSection === 'about' ? 'is-active' : ''} onClick={() => go('#about')}>关于</button>
            <button className={activeSection === 'videos' ? 'is-active' : ''} onClick={() => go('#videos')}>游戏广告</button>
            <button className={activeSection === 'comic' ? 'is-active' : ''} onClick={() => go('#comic')}>AI漫剧</button>
          </div>
          <a className="nav-contact" href="mailto:2949026597@qq.com">
            CONTACT <Arrow diagonal />
          </a>
          <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开菜单">
            <span /><span />
          </button>
        </nav>

        <div className="hero-content shell">
          <div className="hero-copy">
            <div className="eyebrow"><span /> Portfolio · 2025 — 2026</div>
            <h1 className="hero-focus-title">
              <TrueFocus
                sentence="SONG JIALE|VISUAL × AI"
                separator="|"
                manualMode={false}
                blurAmount={2.4}
                borderColor="#35e5df"
                glowColor="rgba(53, 229, 223, 0.45)"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </h1>
            <p className="hero-intro">视觉设计师 / AI 设计师 / 品牌设计师。<br />用设计建立秩序，用 AI 拓展想象，让创意真正抵达用户。</p>
            <div className="hero-actions">
              <button className="hero-cta" onClick={() => go('#videos')}>VIEW SELECTED WORK <Arrow /></button>
              <a className="hero-resume" href={`${import.meta.env.BASE_URL}files/song-jiale-resume.pdf`} download="宋家乐-视觉AI设计师-简历.pdf">DOWNLOAD CV ↓</a>
            </div>
          </div>
          <div className="hero-index" aria-hidden="true">
            <strong>01</strong><span>02</span><span>03</span><span>04</span>
          </div>
          <div className="hero-foot">
            <article><span>01</span><div><strong>视觉设计</strong><p>从概念到完整视觉系统</p></div></article>
            <article><span>02</span><div><strong>AI 影像</strong><p>生成、控制与连续叙事</p></div></article>
            <article><span>03</span><div><strong>品牌表达</strong><p>让风格服务于商业目标</p></div></article>
          </div>
        </div>
      </section>

      <section className="about about-native" id="about">
        <div className="shell">
          <header className="section-head" data-reveal>
            <span>01 / ABOUT</span>
          </header>
          <div className="about-native-grid">
            <figure className="about-portrait" data-reveal>
              <img src={portrait} alt="宋家乐个人肖像" />
              <figcaption><span>SONG JIALE</span><span>2004 — NOW</span></figcaption>
            </figure>
            <div className="about-content" data-reveal>
              <h2>视觉 × AI<br /><i>完整内容生产力</i></h2>
              <p className="about-lead">数字媒体艺术背景，具备从脚本构思、分镜设计、AI 视觉资产生成，到剪辑包装的完整内容生产能力。关注创意表达，也关心平台节奏与商业结果。</p>
              <div className="about-contact">
                <a href="tel:17739450561"><span>PHONE</span><strong>177 3945 0561</strong></a>
                <a href="mailto:2949026597@qq.com"><span>EMAIL</span><strong>2949026597@qq.com</strong></a>
                <div><span>EDUCATION</span><strong>郑州西亚斯学院 · 数字媒体艺术本科 · 2023—至今</strong></div>
              </div>
            </div>
          </div>

          <div className="about-details">
            <div className="experience-list" data-reveal>
              <span className="detail-label">EXPERIENCE / 实习经历</span>
              <article><time>2026.05—08</time><div><h3>触宝科技 · AIGC 实习生</h3><p>参与海外 Merge 游戏广告与 AI 漫剧制作，累计参与 50+ 条买量广告素材。</p></div></article>
              <article><time>2026.03—05</time><div><h3>深圳裕达通途投资有限公司 · AI 编导实习生</h3><p>围绕 TikTok 短视频完成选题、脚本、画面生成、剪辑包装与发布。</p></div></article>
              <article><time>2025.06—08</time><div><h3>周口市云帆电子商务有限公司 · 直播中控实习生</h3><p>参与 10+ 场电商直播，产出 60+ 条直播切片，单条最高播放量 50 万+。</p></div></article>
            </div>
            <div className="about-side" data-reveal>
              <span className="detail-label">TOOLS / 核心工具</span>
              <div className="about-tools">
                {['ChatGPT', 'Codex', 'Gemini', 'Midjourney', 'Seedance', '可灵', 'Premiere Pro', 'After Effects', 'C4D', '剪映'].map(tool => <span key={tool}>{tool}</span>)}
              </div>
              <div className="about-stats">
                <div><strong>50<sup>+</sup></strong><span>游戏买量素材</span></div>
                <div><strong>02</strong><span>商业化 AI 漫剧</span></div>
                <div><strong>01</strong><span>全国一等奖</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="video-showcase section shell" id="videos">
        <header className="section-head" data-reveal>
          <span>02 / MOTION WORKS</span>
          <p>以高密度叙事、玩法展示和卖点包装，回应海外游戏投放场景。</p>
        </header>

        <div className="video-category game-category">
          <div className="video-category-head" data-reveal>
            <div>
              <span>GAME PERFORMANCE CREATIVE</span>
              <h2>游戏买量</h2>
              <div className="game-title-list">
                <span>Shine On, Bella: Merge &amp; Love</span>
                <span>Pretty Boutique: Merge &amp; Love</span>
              </div>
            </div>
            <p>围绕海外 Merge 类游戏核心卖点，以强情节开场、玩法展示和节奏化包装提升素材的信息效率与观看吸引力。</p>
          </div>
          <GameOrbit items={gameVideos} onPreview={setActivePreview} />
        </div>

      </section>

      <section className="comic-page section shell" id="comic">
        <header className="section-head" data-reveal>
          <span>03 / AI COMIC</span>
          <p>从视觉资产生成到连续镜头控制，探索生成式影像的叙事能力。</p>
        </header>
        <div className="comic-category">
          <div className="video-category-head" data-reveal>
            <div>
              <span>AI COMIC SERIES</span>
              <h2>AI 漫剧</h2>
            </div>
            <p>参与角色与场景视觉资产生成、镜头调整和成片剪辑。两部作品均已完成商业化上线。</p>
          </div>
          <div className="comic-project-grid">
            {comicProjects.map((project) => (
              <article className="comic-project-card" key={project.no} data-reveal>
                <div className="comic-poster">
                  <img src={project.image} alt={`${project.title}：${project.subtitle}海报`} />
                  <span className="comic-no">{project.no}</span>
                  <span className="comic-badge">{project.badge}</span>
                </div>
                <div className="comic-project-info">
                  <div>
                    <span>AI COMIC · 2026</span>
                    <h3>{project.title}</h3>
                    <p>{project.subtitle}</p>
                  </div>
                  <button type="button" onClick={() => setActivePreview(project)}>
                    点击预览 <i><Arrow diagonal /></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="award-work section shell" id="work">
        <header className="section-head" data-reveal>
          <span>04 / AWARD WORK</span>
          <p>以非遗文化传播与 AIGC 影像创作为核心的获奖作品。</p>
        </header>
        <div className="award-heading" data-reveal>
          <div>
            <span>NATIONAL FIRST PRIZE · 2026</span>
            <h2>醒狮<br /><i>入梦</i></h2>
          </div>
          <div className="award-copy">
            <p>以国家级非遗“醒狮”为创作核心，运用 AIGC 构建传统文化与幻想叙事交织的东方视觉短片。</p>
            <strong>从剧本策划到最终成片，全部由我一人独立完成。</strong>
          </div>
        </div>
        <div className="award-process" data-reveal aria-label="个人独立完成的制作流程">
          {['剧本策划', '视觉资产', '分镜设计', '视频生成', '剪辑包装'].map((step, index) => (
            <span key={step}><i>{String(index + 1).padStart(2, '0')}</i>{step}</span>
          ))}
        </div>
        <div className="award-case-meta" data-reveal>
          <div><span>ROLE / 个人职责</span><strong>独立创作 · 全流程完成</strong></div>
          <div><span>FORMAT / 项目形式</span><strong>AIGC 非遗视觉短片</strong></div>
          <div><span>RESULT / 项目成果</span><strong>全国总决赛一等奖</strong></div>
        </div>
        <div className="award-video" data-reveal>
          <video
            src={publicAsset('videos/award/heritage-award.mp4')}
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => { if (event.currentTarget.duration > 0.12) event.currentTarget.currentTime = 0.12 }}
          />
          <span className="award-mark">01 / AWARD FILM</span>
        </div>
      </section>

      <section className="ability section shell" id="ability">
        <header className="section-head" data-reveal>
          <span>05 / CAPABILITIES</span>
          <p>多种工具，一套完整的创意工作流。</p>
        </header>
        <div className="ability-heading" data-reveal>
          <h2>WHAT I<br /><i>BRING</i></h2>
          <p>从洞察、构思、生成到落地，<br />让创意在每个环节保持一致。</p>
        </div>
        <div className="ability-grid">
          {strengths.map((item) => (
            <article key={item.no} data-reveal>
              <span className="ability-no">{item.no}</span>
              <div className="ability-symbol"><span /><span /></div>
              <p className="ability-en">{item.en}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <div className="tool-marquee" aria-hidden="true">
          <div>CHATGPT · CODEX · GEMINI · MIDJOURNEY · SEEDANCE · KLING · GROK · PREMIERE · AFTER EFFECTS · C4D ·&nbsp;</div>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-glow" />
        <div className="shell contact-inner" data-reveal>
          <div className="eyebrow"><span /> Have a project in mind?</div>
          <h2>LET'S MAKE<br /><i>SOMETHING</i><br />MEANINGFUL.</h2>
          <a className="big-mail" href="mailto:2949026597@qq.com">
            <span>START A CONVERSATION</span>
            2949026597@qq.com
            <i><Arrow diagonal /></i>
          </a>
          <div className="footer-bottom">
            <span>© 2026 SONG JIALE</span>
            <span>VISUAL · AI · BRAND DESIGNER</span>
            <button onClick={() => go('#top')}>BACK TO TOP ↑</button>
          </div>
        </div>
      </footer>

      {activePreview && (
        <div className="preview-modal" role="dialog" aria-modal="true" aria-label={`${activePreview.title}视频预览`}>
          <button className="preview-backdrop" type="button" onClick={() => setActivePreview(null)} aria-label="关闭预览" />
          <div className="preview-dialog">
            <div className="preview-dialog-head">
              <div>
                <span>{activePreview.badge}</span>
                <strong>{activePreview.title} · {activePreview.subtitle}</strong>
                {activePreview.detail && <p>{activePreview.detail}</p>}
              </div>
              <button type="button" onClick={() => setActivePreview(null)}>关闭 ×</button>
            </div>
            {activePreview.meta && (
              <div className="preview-meta">
                {activePreview.meta.map(item => (
                  <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>
                ))}
              </div>
            )}
            <video src={activePreview.video} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </main>
  )
}

export default App
