import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import { trackQuoteConversion } from './google-ads'

const officialOrigin = 'https://vauclairdemenagement.com'

type Route = '/' | '/particuliers' | '/entreprises' | '/services' | '/realisations' | '/a-propos' | '/devis' | '/contact' | '/cgv' | '/mentions-legales' | '/politique-confidentialite'

const seoByRoute: Record<Route, { title: string; description: string }> = {
  '/': { title: 'Vauclair Déménagement | Particuliers & Entreprises', description: 'Déménagement résidentiel et professionnel en France : emballage, protection du mobilier, transport, monte-meubles et garde-meubles. Devis gratuit.' },
  '/particuliers': { title: 'Déménagement Particulier | Maison, Appartement & Étudiant', description: 'Confiez votre déménagement particulier à Vauclair : appartement, maison, logement étudiant, emballage et protection du mobilier. Devis gratuit.' },
  '/entreprises': { title: 'Déménagement d’Entreprise | Bureau & Commerces', description: 'Vauclair organise le déménagement de vos bureaux, commerces et locaux professionnels avec rigueur pour limiter l’interruption de votre activité.' },
  '/services': { title: 'Services de Déménagement | Emballage & Transport', description: 'Emballage, déballage, transport, déménagement, garde-meubles et monte-meubles : découvrez les prestations sur mesure de Vauclair.' },
  '/realisations': { title: 'Réalisations de Déménagement | Vauclair', description: 'Découvrez les réalisations de Vauclair Déménagement : maisons, appartements, bureaux, emballage, protection du mobilier et transport.' },
  '/a-propos': { title: 'À propos de Vauclair | Notre Savoir-Faire', description: 'Découvrez l’expérience professionnelle de Vauclair Déménagement et ses engagements : écoute, respect du mobilier et organisation.' },
  '/devis': { title: 'Devis Gratuit Déménagement | Vauclair', description: 'Demandez votre devis gratuit de déménagement pour particulier ou entreprise. Recevez une estimation personnalisée selon votre projet.' },
  '/contact': { title: 'Contacter Vauclair Déménagement | Devis & Questions', description: 'Contactez Vauclair Déménagement par téléphone ou via le formulaire pour préparer votre déménagement et recevoir un devis gratuit.' },
  '/cgv': { title: 'Conditions générales de vente | Vauclair Déménagement', description: 'Consultez les conditions générales de vente de Vauclair Déménagement.' },
  '/mentions-legales': { title: 'Mentions légales | Vauclair Déménagement', description: 'Consultez les mentions légales de Vauclair Déménagement.' },
  '/politique-confidentialite': { title: 'Politique de confidentialité | Vauclair Déménagement', description: 'Consultez la politique de confidentialité de Vauclair Déménagement.' },
}

const services = [
  { icon: '⌂', title: 'Déménagement résidentiel', text: 'Studios, appartements et maisons, avec une organisation adaptée à votre volume et à vos délais.' },
  { icon: '▦', title: 'Déménagement professionnel', text: 'Bureaux, commerces et entreprises : une équipe coordonnée pour limiter l’interruption de votre activité.' },
  { icon: '▤', title: 'Emballage & déballage', text: 'Cartons, protection des objets fragiles, étiquetage et remise en place pièce par pièce.' },
  { icon: '▥', title: 'Garde-meubles sécurisé', text: 'Une solution souple pour stocker vos biens pendant une transition courte ou longue.' },
  { icon: '↥', title: 'Monte-meubles', text: 'Le matériel adapté aux accès difficiles et aux étages élevés, en toute sécurité.' },
  { icon: '✓', title: 'Formule sur mesure', text: 'Un accompagnement personnalisé selon votre budget, votre distance et votre niveau d’implication.' },
]

const featuredServices = [
  { icon: '⌂', title: 'Déménagement', text: 'Résidentiel ou professionnel, local ou longue distance. On s’adapte à votre projet.' },
  { icon: '▤', title: 'Emballage pro', text: 'Vos affaires sont emballées avec des matériaux adaptés et étiquetées pièce par pièce.' },
  { icon: '▦', title: 'Entreprises', text: 'Bureaux, commerces, locaux — intervention rapide, y compris en horaires décalés.' },
  { icon: '▥', title: 'Garde-meubles', text: 'Besoin de stocker ? Nos boxes sécurisés sont disponibles en court et long terme.' },
]

const formulas = [
  {
    name: 'Économique',
    badge: 'Essentiel',
    description: 'Vous emballez, on transporte.',
    features: ['Housse de protection pour matelas', 'Protection du mobilier sous housses et couvertures', 'Chargement et transport en camion', 'Remise en place du mobilier sans remontage'],
  },
  {
    name: 'Confort',
    badge: 'Recommandée',
    description: 'Le meilleur rapport qualité-prix.',
    features: ['Livraison de cartons et adhésifs', 'Emballage et déballage des objets fragiles', 'Démontage et remontage du mobilier', 'Mise en penderie des vêtements sur cintres', 'Housse de protection pour matelas', 'Protection du mobilier sous housses et couvertures', 'Chargement et transport en camion', 'Remise en place du mobilier dans chaque pièce'],
  },
  {
    name: 'Luxe',
    badge: 'Tout compris',
    description: 'On gère tout, de A à Z.',
    features: ['Livraison de cartons et adhésifs', 'Emballage et déballage des objets fragiles', 'Emballage intégral des objets non fragiles', 'Démontage et remontage du mobilier', 'Mise en penderie des vêtements sur cintres', 'Housse de protection pour matelas', 'Protection du mobilier sous housses et couvertures', 'Chargement et transport en camion', 'Remise en place du mobilier dans chaque pièce'],
  },
]

const navItems: { label: string; path: Route }[] = [
  { label: 'Accueil', path: '/' },
  { label: 'Particuliers', path: '/particuliers' },
  { label: 'Entreprises', path: '/entreprises' },
  { label: 'Prestations', path: '/services' },
  { label: 'Réalisations', path: '/realisations' },
  { label: 'À propos', path: '/a-propos' },
  { label: 'Contact', path: '/contact' },
]

function VauclairLogo() {
  return <img className="official-logo" src="/vauclair-logo.png" alt="Vauclair Déménagement - Depuis 1995" />
}

function isRoute(value: string): value is Route {
  return ['/', '/particuliers', '/entreprises', '/services', '/realisations', '/a-propos', '/devis', '/contact', '/cgv', '/mentions-legales', '/politique-confidentialite'].includes(value)
}

function App() {
  const [route, setRoute] = useState<Route>(() => {
    const path = window.location.pathname
    return isRoute(path) ? path : '/'
  })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onPopState = () => setRoute(isRoute(window.location.pathname) ? window.location.pathname : '/')
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const seo = seoByRoute[route]
    const canonicalUrl = `${officialOrigin}${route}`
    document.title = seo.title
    document.documentElement.lang = 'fr'

    const setMeta = (selector: string, attribute: 'name' | 'property', content: string) => {
      let meta = document.head.querySelector<HTMLMetaElement>(selector)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, selector.includes('og:') ? selector.replace('[property="', '').replace('"]', '') : selector.replace('[name="', '').replace('"]', ''))
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    setMeta('meta[name="description"]', 'name', seo.description)
    setMeta('meta[property="og:type"]', 'property', 'website')
    setMeta('meta[property="og:locale"]', 'property', 'fr_FR')
    setMeta('meta[property="og:title"]', 'property', seo.title)
    setMeta('meta[property="og:description"]', 'property', seo.description)
    setMeta('meta[property="og:url"]', 'property', canonicalUrl)
    setMeta('meta[property="og:image"]', 'property', `${officialOrigin}/vauclair-logo.png`)
    setMeta('meta[name="twitter:card"]', 'name', 'summary')
    setMeta('meta[name="twitter:title"]', 'name', seo.title)
    setMeta('meta[name="twitter:description"]', 'name', seo.description)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalUrl

    let structuredData = document.head.querySelector<HTMLScriptElement>('script[data-vauclair-schema]')
    if (!structuredData) {
      structuredData = document.createElement('script')
      structuredData.type = 'application/ld+json'
      structuredData.dataset.vauclairSchema = 'true'
      document.head.appendChild(structuredData)
    }
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MovingCompany',
      name: 'Vauclair Déménagement',
      description: seo.description,
      telephone: '+33780971094',
      image: `${officialOrigin}/vauclair-logo.png`,
      url: officialOrigin,
      areaServed: 'France',
      priceRange: 'Sur devis',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services de déménagement',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Déménagement résidentiel' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Déménagement professionnel' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Emballage et transport' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Garde-meubles' } },
        ],
      },
    })
  }, [route])

  const navigate = (path: Route) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    setMenuOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="announcement">VAUCLAIR DÉMÉNAGEMENT · DEVIS GRATUIT ET SANS ENGAGEMENT</div>
        <div className="container header-row">
          <button className="brand" onClick={() => navigate('/')} aria-label="Retour à l'accueil"><VauclairLogo /></button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu" aria-expanded={menuOpen}>☰</button>
          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
            {navItems.map((item) => (
              <button key={item.path} className={route === item.path ? 'active' : ''} aria-current={route === item.path ? 'page' : undefined} onClick={() => navigate(item.path)}>{item.label}</button>
            ))}
            <button className="nav-cta" onClick={() => navigate('/devis')}>Demander un devis <span>↗</span></button>
          </nav>
        </div>
      </header>

      <main>
        {route === '/' && <Home navigate={navigate} />}
        {route === '/particuliers' && <Particuliers navigate={navigate} />}
        {route === '/entreprises' && <Entreprises navigate={navigate} />}
        {route === '/services' && <Services navigate={navigate} />}
        {route === '/realisations' && <Realisations navigate={navigate} />}
        {route === '/a-propos' && <Company navigate={navigate} />}
        {route === '/devis' && <QuotePage />}
        {route === '/contact' && <Contact />}
        {route === '/cgv' && <LegalPage title="Conditions générales de vente" />}
        {route === '/mentions-legales' && <LegalPage title="Mentions légales" />}
        {route === '/politique-confidentialite' && <LegalPage title="Politique de confidentialité" />}
      </main>
      <Footer navigate={navigate} />
    </div>
  )
}

function Home({ navigate }: { navigate: (path: Route) => void }) {
  return <>
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Une expérience professionnelle acquise depuis 1995</p>
          <h1>Votre déménagement en toute <span>confiance.</span></h1>
          <p className="hero-lead">Vauclair Déménagement accompagne les particuliers et les professionnels avec sérieux, organisation et savoir-faire.</p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => navigate('/devis')}>Obtenir mon devis <span>→</span></button>
            <a className="phone-button" href="tel:+33780971094">Appeler le 07 80 97 10 94 <span>☎</span></a>
          </div>
          <div className="trust-row"><span className="trust-check">✓</span><span><strong>Devis gratuit et sans engagement</strong><br />Réponse personnalisée pour particuliers & entreprises</span></div>
        </div>
        <div className="hero-art" role="img" aria-label="Équipe Vauclair charge un camion de déménagement">
          <div className="sun-shape" />
          <div className="arch arch-one" /><div className="arch arch-two" />
          <div className="box box-one">V</div><div className="box box-two">V</div><div className="box box-three">V</div>
        </div>
      </div>
    </section>
    <section className="stats-strip"><div className="container stats-grid"><div><strong>1995</strong><span>expérience professionnelle</span></div><div><strong>01</strong><span>protection du mobilier</span></div><div><strong>02</strong><span>particuliers & familles</span></div><div><strong>03</strong><span>transferts d’entreprises</span></div></div></section>
    <section className="section container intro-section"><div className="section-label">01 / Notre approche</div><div><h2>Changer d’adresse,<br /><i>pas de sérénité.</i></h2><p className="section-text">Notre expérience professionnelle acquise depuis 1995 nous a appris l’essentiel : respecter vos biens, anticiper chaque étape et rester disponibles avant, pendant et après le déménagement.</p><button className="text-button" onClick={() => navigate('/a-propos')}>Découvrir Vauclair <span>↗</span></button></div></section>
    <section className="service-preview"><div className="container"><div className="section-heading"><div><div className="section-label">02 / Nos services</div><h2>Tout ce qu’il faut<br /><i>pour déménager serein.</i></h2></div><button className="text-button" onClick={() => navigate('/services')}>Toutes nos prestations <span>↗</span></button></div><div className="service-grid">{featuredServices.map((service) => <ServiceCard key={service.title} {...service} />)}</div></div></section>
    <section className="formula-section section"><div className="container"><div className="section-heading"><div><div className="section-label">03 / Nos formules</div><h2>Quelle formule pour<br /><i>votre déménagement ?</i></h2><p className="section-text">Du plus simple au tout compris : choisissez, on s’occupe du reste.</p></div></div><div className="formula-grid">{formulas.map((formula) => <article className={`formula-card formula-${formula.name.toLowerCase()}${formula.name === 'Confort' ? ' is-featured' : ''}`} key={formula.name}><div className="formula-top"><div><h3>{formula.name}</h3><span>{formula.badge}</span></div></div><p className="formula-description">{formula.description}</p><strong className="formula-price">Sur devis <small>gratuit</small></strong><ul>{formula.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button className="button button-dark" onClick={() => navigate('/devis')}>Demander un devis <span>→</span></button></article>)}</div></div></section>
    <section className="process-section container section"><div className="section-heading"><div><div className="section-label">04 / Notre méthode</div><h2>Simple, du premier<br /><i>appel aux dernières clés.</i></h2></div></div><div className="process-grid"><div><span>01</span><h3>On échange</h3><p>Nous écoutons votre projet et identifions vos besoins.</p></div><div><span>02</span><h3>On organise</h3><p>Vous recevez un devis clair et un planning précis.</p></div><div><span>03</span><h3>On s’occupe de tout</h3><p>Notre équipe prend le relais avec soin et efficacité.</p></div></div></section>
    <section className="trust-section"><div className="container"><div className="section-label">05 / Nos engagements</div><div className="trust-grid"><article><strong>01</strong><h3>Interlocuteur unique</h3><p>Un accompagnement clair avant, pendant et après votre déménagement.</p></article><article><strong>02</strong><h3>Protection des biens</h3><p>Des méthodes adaptées aux meubles, objets fragiles et accès difficiles.</p></article><article><strong>03</strong><h3>Organisation sur mesure</h3><p>Une prestation ajustée à votre volume, vos dates et votre budget.</p></article></div></div></section>
    <Faq />
    <section className="cta-section"><div className="container cta-inner"><div><p className="eyebrow">Parlons de votre projet</p><h2>Prêt à déménager<br /><i>sereinement ?</i></h2></div><div className="cta-actions"><button className="button button-light" onClick={() => navigate('/devis')}>Demander mon devis <span>→</span></button><a className="button button-outline-light" href="https://wa.me/33780971094" target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a></div></div></section>
    <div className="mobile-actions" aria-label="Actions de contact"><a href="tel:+33780971094">☎ Appeler</a><a href="https://wa.me/33780971094" target="_blank" rel="noreferrer">WhatsApp</a></div>
  </>
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const questions = [
    ['Combien coûte un déménagement ?', 'Le tarif dépend du volume, de la distance et de la formule choisie. Demandez votre devis gratuit pour une estimation personnalisée.'],
    ['Intervenez-vous partout en France ?', 'Oui, nous organisons des déménagements locaux et longue distance pour les particuliers comme pour les entreprises.'],
    ['Proposez-vous l’emballage des affaires ?', 'Oui. Selon la formule, nous pouvons protéger les objets fragiles ou prendre en charge l’emballage complet de votre logement.'],
  ]
  return <section className="faq-section container section"><div><div className="section-label">06 / Questions fréquentes</div><h2>Les réponses<br /><i>avant de partir.</i></h2></div><div className="faq-list">{questions.map(([question, answer], index) => <div className={open === index ? 'faq-item open' : 'faq-item'} key={question}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{question}</span><b>+</b></button>{open === index && <p>{answer}</p>}</div>)}</div></section>
}

function Services({ navigate }: { navigate: (path: Route) => void }) {
  return <PageHero eyebrow="Nos prestations" title={<>Des solutions<br /><i>pour chaque départ.</i></>} intro="Du premier échange à la livraison, nous adaptons chaque étape à votre situation pour que votre déménagement se déroule avec confiance." action={() => navigate('/devis')} actionLabel="Demander mon devis"><section className="container section services-page"><div className="service-grid service-grid-large">{services.map((service) => <ServiceCard key={service.title} {...service} />)}</div></section></PageHero>
}

function Particuliers({ navigate }: { navigate: (path: Route) => void }) {
  return <PageHero eyebrow="Déménagement de particuliers" title={<>Votre projet,<br /><i>notre attention.</i></>} intro="Appartement, maison ou logement étudiant : nous vous accompagnons avec une organisation claire, de la préparation des cartons à l’installation à destination." action={() => navigate('/devis')} actionLabel="Demander mon devis">
    <section className="container section detail-page">
      <div className="detail-photo photo-home" />
      <div className="detail-copy">
        <div className="section-label">Un accompagnement complet</div>
        <h2>Chaque meuble mérite <i>d’être protégé.</i></h2>
        <p>Préparation, emballage des objets fragiles, protection du mobilier, chargement, transport et déchargement : nous adaptons la prestation à votre besoin.</p>
        <div className="check-list"><span>✓ Protection du mobilier</span><span>✓ Préparation et emballage</span><span>✓ Chargement organisé</span><span>✓ Installation à destination selon la prestation</span></div>
        <button className="button button-dark" onClick={() => navigate('/devis')}>Parler de mon projet <span>→</span></button>
      </div>
    </section>
  </PageHero>
}

function Entreprises({ navigate }: { navigate: (path: Route) => void }) {
  return <PageHero eyebrow="Déménagement d’entreprises" title={<>Votre activité<br /><i>ne s’arrête pas.</i></>} intro="Transfert de bureaux, mobilier et matériel professionnel : une organisation rigoureuse pour réduire l’interruption de votre activité." action={() => navigate('/devis')} actionLabel="Devis entreprise">
    <section className="container section detail-page">
      <div className="detail-copy">
        <div className="section-label">Une organisation rigoureuse</div>
        <h2>Le soin du matériel,<br /><i>la maîtrise du planning.</i></h2>
        <p>Nous préparons le transfert avec vous et organisons les étapes selon vos contraintes. La protection des écrans, fauteuils, tables et cartons fait partie de notre méthode de travail.</p>
        <div className="check-list"><span>✓ Transfert de bureaux</span><span>✓ Protection du matériel informatique</span><span>✓ Mobilier professionnel</span><span>✓ Chargement et transport planifiés</span></div>
        <button className="button button-dark" onClick={() => navigate('/devis')}>Demander un devis entreprise <span>→</span></button>
      </div>
      <div className="detail-photo photo-office" />
    </section>
  </PageHero>
}

function Realisations({ navigate }: { navigate: (path: Route) => void }) {
  const photos = [['Maisons', 'photo-home'], ['Appartements', 'photo-boxes'], ['Bureaux', 'photo-office'], ['Protection du mobilier', 'photo-protection'], ['Chargement & transport', 'photo-truck'], ['Emballage', 'photo-packing']]
  return <PageHero eyebrow="Nos réalisations" title={<>Le soin du geste,<br /><i>en images.</i></>} intro="Galerie basée sur les images fournies par Vauclair Déménagement." action={() => navigate('/devis')} actionLabel="Demander un devis"><section className="container section gallery-grid">{photos.map(([label, className]) => <figure key={label} className={`gallery-card ${className}`}><figcaption>{label}</figcaption></figure>)}</section></PageHero>
}

function Company({ navigate }: { navigate: (path: Route) => void }) {
  return <PageHero eyebrow="À propos de Vauclair" title={<>Une expérience<br /><i>qui se transmet.</i></>} intro="Notre savoir-faire repose sur une expérience professionnelle acquise depuis 1995. Cette mention décrit notre expérience métier, et non la date de création juridique de la société." action={() => navigate('/contact')} actionLabel="Nous contacter"><section className="container values-grid section"><div><div className="section-label">Notre engagement</div><h2>Un travail soigné, <i>une relation de confiance.</i></h2></div><div className="value-list"><div><span>01</span><p><strong>Écoute</strong><br />Un interlocuteur disponible pour chaque question.</p></div><div><span>02</span><p><strong>Respect</strong><br />Vos biens sont préparés et manipulés avec attention.</p></div><div><span>03</span><p><strong>Organisation</strong><br />Des étapes lisibles et un accompagnement humain.</p></div></div></section></PageHero>
}

function PageHero({ eyebrow, title, intro, action, actionLabel, children }: { eyebrow: string; title: React.ReactNode; intro: string; action: () => void; actionLabel: string; children: React.ReactNode }) {
  return <><section className="page-hero"><div className="container page-hero-inner"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="hero-lead">{intro}</p><button className="button button-dark" onClick={action}>{actionLabel} <span>→</span></button></div></section>{children}</>
}

function ServiceCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return <article className="service-card"><div className="service-icon">{icon}</div><h3>{title}</h3><p>{text}</p><span className="card-arrow">↗</span></article>
}

function QuotePage() {
  return <section className="form-page"><div className="container form-layout"><div><p className="eyebrow">Votre projet</p><h1>Parlons de votre<br /><i>déménagement.</i></h1><p className="hero-lead">Quelques informations suffisent pour recevoir une estimation personnalisée et sans engagement.</p><div className="contact-aside"><strong>Une question ?</strong><a href="tel:+33780971094">07 80 97 10 94</a><p>Appelez ce numéro pour votre demande de devis.</p></div></div><QuoteForm /></div></section>
}

function Contact() {
  return <section className="form-page"><div className="container contact-layout"><div><p className="eyebrow">Nous contacter</p><h1>Un échange simple,<br /><i>un départ serein.</i></h1><p className="hero-lead">Notre équipe est disponible pour répondre à vos questions et vous guider dans votre projet.</p><div className="contact-details"><p><small>Téléphone devis</small><a href="tel:+33780971094">07 80 97 10 94</a></p></div></div><QuoteForm compact /></div></section>
}

function QuoteForm({ compact = false }: { compact?: boolean }) {
  const [values, setValues] = useState({ name: '', firstName: '', email: '', phone: '', from: '', to: '', date: '', projectType: 'Particulier', propertyType: '', floorFrom: '', floorTo: '', elevator: 'À préciser', volume: '', services: '', message: '', consent: false })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const update = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }))
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSending(true)
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      if (!response.ok) throw new Error('La demande n’a pas pu être envoyée.')
      trackQuoteConversion(`quote-${crypto.randomUUID()}`)
      setSent(true)
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Une erreur est survenue. Appelez-nous directement.')
    } finally {
      setSending(false)
    }
  }
  if (sent) return <div className="success-card"><span>✓</span><h2>Merci pour votre demande.</h2><p>Nous revenons vers vous rapidement avec une première estimation.</p><button className="text-button" onClick={() => setSent(false)}>Envoyer une autre demande ↗</button></div>
  return <form className="quote-form" onSubmit={submit}><div className="form-title">{compact ? 'Écrivez-nous' : 'Recevoir mon devis gratuit'}</div><div className="form-row"><label>Nom<input required value={values.name} onChange={(event) => update('name', event.target.value)} placeholder="Votre nom" /></label><label>Prénom<input value={values.firstName} onChange={(event) => update('firstName', event.target.value)} placeholder="Votre prénom" /></label></div><div className="form-row"><label>Email<input required type="email" value={values.email} onChange={(event) => update('email', event.target.value)} placeholder="vous@email.com" /></label><label>Téléphone<input required type="tel" value={values.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Votre téléphone" /></label></div><div className="form-row"><label>Ville de départ<input value={values.from} onChange={(event) => update('from', event.target.value)} placeholder="Ville de départ" /></label><label>Ville d’arrivée<input value={values.to} onChange={(event) => update('to', event.target.value)} placeholder="Ville d’arrivée" /></label></div><div className="form-row"><label>Date souhaitée<input type="date" value={values.date} onChange={(event) => update('date', event.target.value)} /></label><label>Type de projet<select value={values.projectType} onChange={(event) => update('projectType', event.target.value)}><option>Particulier</option><option>Professionnel</option></select></label></div><div className="form-row"><label>Logement / locaux<input value={values.propertyType} onChange={(event) => update('propertyType', event.target.value)} placeholder="Maison, appartement, bureaux..." /></label><label>Volume estimé<input value={values.volume} onChange={(event) => update('volume', event.target.value)} placeholder="Si connu" /></label></div><div className="form-row"><label>Étage départ<input value={values.floorFrom} onChange={(event) => update('floorFrom', event.target.value)} placeholder="RDC, 1er..." /></label><label>Étage arrivée<input value={values.floorTo} onChange={(event) => update('floorTo', event.target.value)} placeholder="RDC, 1er..." /></label></div><label>Ascenseur<select value={values.elevator} onChange={(event) => update('elevator', event.target.value)}><option>À préciser</option><option>Oui, au départ et à l’arrivée</option><option>Oui, au départ uniquement</option><option>Oui, à l’arrivée uniquement</option><option>Non</option></select></label><label>Prestations souhaitées<input value={values.services} onChange={(event) => update('services', event.target.value)} placeholder="Emballage, protection, transport..." /></label><label>Message complémentaire<textarea rows={compact ? 3 : 4} value={values.message} onChange={(event) => update('message', event.target.value)} placeholder="Parlez-nous de votre projet..." /></label><label className="consent"><input required type="checkbox" checked={values.consent} onChange={(event) => setValues((current) => ({ ...current, consent: event.target.checked }))} /> J’accepte que mes données soient utilisées pour répondre à ma demande.</label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" type="submit" disabled={sending}>{sending ? 'Envoi en cours…' : 'Demander mon devis gratuit'} {!sending && <span>→</span>}</button><small>Les champs sont traités uniquement pour votre demande. Le système de réception email reste à connecter.</small></form>
}

function LegalPage({ title }: { title: string }) {
  const isCgv = title === 'Conditions générales de vente'
  return <section className="legal-page container"><p className="eyebrow">Informations</p><h1>{title}</h1><div className="legal-copy">{isCgv ? <><h2>Objet</h2><p>Les présentes conditions encadrent les prestations de déménagement proposées par Vauclair Déménagement. Chaque prestation sera confirmée par un devis accepté par le client.</p><h2>Devis et règlement</h2><p>Le devis précisera le volume, les adresses, les dates, les prestations et le prix. Les conditions définitives seront complétées avant la mise en ligne.</p></> : title === 'Politique de confidentialité' ? <><h2>Données collectées</h2><p>Le formulaire recueille uniquement les informations nécessaires pour répondre à votre demande de devis ou de contact.</p><h2>Vos droits</h2><p>Les coordonnées de l’éditeur et les modalités d’exercice de vos droits seront ajoutées dès réception des informations légales définitives.</p></> : <><h2>Informations à compléter avant publication</h2><p><strong>VAUCLAIR DÉMÉNAGEMENT</strong><br />Adresse, SIRET, téléphone, email et représentant légal : à renseigner avec les informations officielles de l’entreprise.</p><p>Nous ne publions volontairement aucune information juridique inventée.</p><h2>Hébergement</h2><p>Hébergeur et adresse de l’hébergeur : à renseigner avant la mise en ligne.</p></>}</div></section>
}

function Footer({ navigate }: { navigate: (path: Route) => void }) {
  return <footer><div className="container footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('/')}><VauclairLogo /></button><p>Votre déménagement,<br />notre engagement.</p></div><div><h4>Navigation</h4>{navItems.slice(1, 6).map((item) => <button key={item.path} onClick={() => navigate(item.path)}>{item.label}</button>)}</div><div><h4>Devis & contact</h4><a href="tel:+33780971094">07 80 97 10 94</a></div></div><div className="container footer-bottom"><span>© 2026 Vauclair Déménagement</span><div><button onClick={() => navigate('/mentions-legales')}>Mentions légales</button><button onClick={() => navigate('/politique-confidentialite')}>Confidentialité</button><button onClick={() => navigate('/cgv')}>CGV</button></div></div></footer>
}

export default App
