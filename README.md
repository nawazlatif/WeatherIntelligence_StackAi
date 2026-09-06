# Weather Intelligence App

A single-page Weather Intelligence web app built with React + Vite (TypeScript). Users search for a city, view current weather and a 7-day forecast with charts, and receive simple planning recommendations. Weather data comes from the free public **Open-Meteo API** (no API key required).

🌐 **Live Application**: [https://weatherintelligence-8mu.pages.dev/](https://weatherintelligence-8mu.pages.dev/)

---

## Features

- **City Search with Geocoding**: Debounced global city and borough search with autocomplete, latitude/longitude resolution, and keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).
- **Current Weather Hero**: Temperature, apparent ("feels like") temperature, humidity, wind speed, condition indicator, and local timezone.
- **7-Day Forecast Cards**: Daily high/low ranges, condition icons, precipitation probability badges, and visual temperature distribution bars.
- **Temperature Trend Chart**: Interactive 7-day temperature curve visualization powered by Recharts with custom tooltips.
- **Weather Intelligence Engine**: Actionable, rule-based outdoor planning recommendations (e.g., cycling, park outings, heat/freeze alerts, rain warnings).
- **Unit Conversion**: Seamless instant toggle between Metric (°C, km/h) and Imperial (°F, mph).
- **Multi-Line Quick Select**: Responsive quick-select pills for major world cities that wrap gracefully on mobile and tablet screens without horizontal scrollbars.
- **Error, Empty & Loading States**: Clean skeleton loaders during data fetch, and helpful empty/error states (e.g., "city not found") with quick retry options.

---

## APIs Used

| API | Endpoint | Purpose |
|---|---|---|
| Open-Meteo Geocoding | `https://geocoding-api.open-meteo.com/v1/search` | Convert city name into latitude and longitude |
| Open-Meteo Forecast | `https://api.open-meteo.com/v1/forecast` | Fetch current weather and 7-day forecast |

No API keys, secrets, Gemini keys, or Firebase are used. All calls are client-side to Open-Meteo.

---

## Tech Stack

- **Framework**: React 19 + Vite 6 (TypeScript)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion
- **Networking**: Client-side `fetch` to Open-Meteo REST APIs
- **Build Output**: Static build output in `dist/`

---

## Local Setup

```bash
npm install
npm run dev      # start local dev server
npm run build    # produce production build in dist/
npm run preview  # preview the production build locally
npm run lint     # validate TypeScript types (tsc --noEmit)
```

---

## Build Settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` (or `/dist`) |
| Build system version | `3 (latest)` |
| Root directory | `/` |
| Environment variables | None |

---

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx      # Hero card with real-time conditions
│   │   ├── ErrorState.tsx              # Error messaging & fallback handling
│   │   ├── ForecastRow.tsx             # 7-day forecast breakdown cards
│   │   ├── Header.tsx                  # Search bar, autocomplete, quick select, unit switch
│   │   ├── LoadingSkeleton.tsx         # Animated loading skeleton indicators
│   │   ├── PlanningRecommendations.tsx # Weather intelligence advice engine
│   │   └── TemperatureChart.tsx        # 7-day temperature trends with Recharts
│   ├── services/
│   │   └── openMeteo.ts                # Client-side Open-Meteo API integrations
│   ├── utils/
│   │   ├── recommendations.ts          # Planning advice generation rules
│   │   └── weatherCodes.ts             # WMO weather code mappings & icons
│   ├── types.ts                        # TypeScript data types & interfaces
│   ├── index.css                       # Tailwind CSS styling
│   ├── App.tsx                         # Core application view & state manager
│   └── main.tsx                        # React application entry point
├── index.html                          # HTML template & meta tags
├── metadata.json                       # Application metadata
├── package.json                        # Dependencies & scripts
├── tsconfig.json                       # TypeScript compiler configuration
└── vite.config.ts                      # Vite configuration
```

---

## Deployment: AI Studio → GitHub → Cloudflare Pages

This application was developed in **Google AI Studio App Build**, connected to **GitHub**, and deployed to production on **Cloudflare Pages** from the connected repository.

### Step-by-Step Deployment Guide

1. **Build in Google AI Studio App Build**:
   - Generate, iterate, and verify the app (city search, current weather, forecast, charts, recommendations, error states).
2. **Connect to GitHub**:
   - Use AI Studio's direct GitHub connection to push the generated source code to the repository [`nawazlatif/WeatherIntelligence_StackAi`](https://github.com/nawazlatif/WeatherIntelligence_StackAi).
3. **Review the Repository**:
   - Confirm `package.json`, source files, framework configuration, and this `README.md` are committed to the `main` branch.
4. **Connect to Cloudflare Pages**:
   - In the Cloudflare dashboard, navigate to **Compute (Workers & Pages)** → **Pages** → **Create application** → **Connect to Git**.
   - Select the repository `nawazlatif/WeatherIntelligence_StackAi` and production branch `main`.
5. **Configure the Build Settings**:
   - **Framework preset**: None / Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Build system version**: `3 (latest)`
   - **Environment variables**: None required
6. **Deploy**:
   - Click **Save and Deploy**. Cloudflare Pages clones the repository, installs dependencies via `npm install`, runs `npm run build`, and distributes the static assets to Cloudflare's global edge network.
7. **Validate**:
   - Navigate to the assigned `pages.dev` URL and verify live meteorological data fetching and responsiveness.

---

## Production Deployment Details

| Field | Detail |
|---|---|
| **Live Production URL** | [https://weatherintelligence-8mu.pages.dev/](https://weatherintelligence-8mu.pages.dev/) |
| **Deployment URL** | `https://b85b1fa0.weatherintelligence-8mu.pages.dev` |
| **Deployment ID** | `b85b1fa0-212d-4d23-a526-7c220a8221a4` |
| **Repository** | `nawazlatif/WeatherIntelligence_StackAi` |
| **Branch & Commit** | `main` (`6d2de1c`) |
| **Status** | `Success` (55s duration) |
| **Build Tools** | Node.js `v22.16.0`, npm `10.9.2`, Vite `6.4.3` |

### Uploaded Assets (4 Files)

```
dist/
├── index.html                   (0.90 kB │ gzip: 0.41 kB)
└── assets/
    ├── index-CsMpJ6FN.css       (56.01 kB │ gzip: 8.82 kB)
    ├── index-DjiUV--w.js        (617.01 kB │ gzip: 184.40 kB)
    └── aistudio
```

---

<details>
<summary><strong>View Cloudflare Pages Deployment Log</strong></summary>

```text
2026-09-05T19:08:25.333443Z	Cloning repository...
2026-09-05T19:08:26.480272Z	From https://github.com/nawazlatif/WeatherIntelligence_StackAi
2026-09-05T19:08:26.480786Z	 * branch            6d2de1cd65be38db7967b0a546f58c73827b410e -> FETCH_HEAD
2026-09-05T19:08:26.480931Z	
2026-09-05T19:08:26.504804Z	HEAD is now at 6d2de1c docs: add project documentation and SPA redirects
2026-09-05T19:08:26.505273Z	
2026-09-05T19:08:26.557865Z	
2026-09-05T19:08:26.558236Z	Using v2 root directory strategy
2026-09-05T19:08:26.574124Z	Success: Finished cloning repository files
2026-09-05T19:08:28.305367Z	Checking for configuration in a Wrangler configuration file (BETA)
2026-09-05T19:08:28.305793Z	
2026-09-05T19:08:28.477046Z	No Wrangler configuration file found. Continuing.
2026-09-05T19:08:31.484439Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-09-05T19:08:31.485288Z	Installing project dependencies: npm install --progress=false
2026-09-05T19:08:52.926033Z	npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
2026-09-05T19:08:56.370958Z	
2026-09-05T19:08:56.372389Z	added 252 packages, and audited 253 packages in 23s
2026-09-05T19:08:56.372498Z	
2026-09-05T19:08:56.37258Z	35 packages are looking for funding
2026-09-05T19:08:56.372644Z	  run `npm fund` for details
2026-09-05T19:08:56.37873Z	
2026-09-05T19:08:56.378934Z	3 moderate severity vulnerabilities
2026-09-05T19:08:56.379023Z	
2026-09-05T19:08:56.379153Z	To address all issues, run:
2026-09-05T19:08:56.379202Z	  npm audit fix
2026-09-05T19:08:56.379236Z	
2026-09-05T19:08:56.379271Z	Run `npm audit` for details.
2026-09-05T19:08:56.46589Z	Executing user command: npm run build
2026-09-05T19:08:56.840397Z	
2026-09-05T19:08:56.840744Z	> react-example@0.0.0 build
2026-09-05T19:08:56.840992Z	> vite build
2026-09-05T19:08:56.841314Z	
2026-09-05T19:08:57.685267Z	vite v6.4.3 building for production...
2026-09-05T19:08:57.781976Z	transforming...
2026-09-05T19:09:03.123285Z	✓ 2270 modules transformed.
2026-09-05T19:09:03.870473Z	rendering chunks...
2026-09-05T19:09:03.886863Z	computing gzip size...
2026-09-05T19:09:03.914272Z	dist/index.html                   0.90 kB │ gzip:   0.41 kB
2026-09-05T19:09:03.914701Z	dist/assets/index-CsMpJ6FN.css   56.01 kB │ gzip:   8.82 kB
2026-09-05T19:09:03.914852Z	dist/assets/index-DjiUV--w.js   617.01 kB │ gzip: 184.40 kB
2026-09-05T19:09:03.915461Z	✓ built in 6.18s
2026-09-05T19:09:04.014283Z	Finished
2026-09-05T19:09:04.736946Z	Checking for configuration in a Wrangler configuration file (BETA)
2026-09-05T19:09:04.737398Z	No Wrangler configuration file found. Continuing.
2026-09-05T19:09:04.915206Z	Note: No functions dir at /functions found. Skipping.
2026-09-05T19:09:04.915329Z	Validating asset output directory
2026-09-05T19:09:06.282595Z	Deploying your site to Cloudflare's global network...
2026-09-05T19:09:09.637558Z	Uploading... (0/4)
2026-09-05T19:09:10.184995Z	Uploading... (1/4)
2026-09-05T19:09:10.244641Z	Uploading... (2/4)
2026-09-05T19:09:10.384564Z	Uploading... (4/4)
2026-09-05T19:09:10.385005Z	✨ Success! Uploaded 4 files (1.72 sec)
2026-09-05T19:09:10.908828Z	✨ Upload complete!
2026-09-05T19:09:12.140888Z	Success: Assets published!
2026-09-05T19:09:13.06003Z	Success: Your site was deployed!
```
</details>

---

## SPA Routing on Cloudflare Pages

Cloudflare Pages natively serves `dist/index.html` for single-page applications without requiring manual rewrite rules. No custom `_redirects` file is required, avoiding recursive loop warnings while preserving seamless client-side reloads.

---

## Validation Checklist

- [x] Search a valid city (e.g. **London**) — current weather and forecast display
- [x] Search a second valid city (e.g. **Chennai**) — location and forecast update
- [x] Search an invalid city — a "city not found" message appears
- [x] Refresh the browser — the app still loads
- [x] Resize the browser — the layout remains responsive and usable across all screen sizes

---

## Responsible AI and Data

Uses only public weather data from Open-Meteo. No client data, employee data, customer personal data, private API keys, or billing-enabled cloud services are used.
