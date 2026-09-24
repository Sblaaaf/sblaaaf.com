# sblaaaf.com

Portfolio de Renaud Lourgouilloux (sblaaaf) : Next.js 16 (App Router), React Three Fiber, GSAP, Lenis, Tailwind CSS 4.

## Lancer le projet

```bash
# Node 22+
npm install
npm run dev   # http://localhost:3000
```

Variables d'environnement : voir `.env.example` (toutes optionnelles).

## Déploiement

Hébergé sur Vercel, connecté au dépôt GitHub :

- chaque push sur une branche crée un **Preview Deployment** (URL unique) ;
- chaque push sur la branche de production (`main`) met à jour le site en ligne.

## Scripts

| Commande            | Rôle                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | Serveur de dev                |
| `npm run build`     | Build de production           |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | Vérification TypeScript       |
| `npm test`          | Tests unitaires (Vitest)      |

## Architecture

```
src/
├─ app/                      Routes (Server Components par défaut)
│  ├─ layout.tsx             Monte UNE fois : CanvasRoot + SmoothScroll + header
│  ├─ page.tsx / info/       Contenu DOM des pages
│  └─ globals.css            Tokens Tailwind (@theme), grain, intro CSS
├─ components/
│  ├─ canvas/                Couche WebGL (client uniquement)
│  │  ├─ CanvasRoot.tsx      Conteneur fixe, chargement différé, pointeur
│  │  ├─ Scene.tsx           <Canvas> : dpr, gl, PerformanceMonitor
│  │  ├─ FrameDriver.tsx     Rend la scène depuis le ticker GSAP
│  │  └─ objects/            Objets 3D (NoiseBlob + shaders)
│  └─ dom/                   Couche HTML (SmoothScroll, header, textes animés)
├─ lib/
│  ├─ gsap.ts                Enregistrement unique des plugins GSAP
│  ├─ frame-state.ts         État partagé DOM → WebGL, hors React
│  ├─ math.ts                damp / clamp / toNdc (+ tests)
│  └─ hooks/
└─ config/site.ts            Identité + palette partagée CSS/WebGL
```

Boucle de rendu unique : `gsap.ticker` → Lenis (prioritaire) → tweens GSAP / ScrollTrigger → rendu R3F (`frameloop="never"` + `advance`).
