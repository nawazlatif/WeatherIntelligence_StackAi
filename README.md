# Weather Intelligence App

A single-page Weather Intelligence web app built with React + Vite (TypeScript). Users search for a city, view current weather and a 7-day forecast with charts, and receive simple planning recommendations. Weather data comes from the free public **Open-Meteo API** (no API key required).

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
| Build output directory | `dist` |

---

## Project Structure

```
.
├── public/
│   └── _redirects               # SPA routing rule for Cloudflare Pages (refresh 404 fix)
├── src/
│   ├── components/
│   │   ├── CurrentWeatherCard.tsx  # Hero card with real-time conditions
│   │   ├── ErrorState.tsx          # Error messaging & fallback handling
│   │   ├── ForecastRow.tsx         # 7-day forecast breakdown cards
│   │   ├── Header.tsx              # Search bar, autocomplete, quick select, unit switch
│   │   ├── LoadingSkeleton.tsx     # Animated loading skeleton indicators
│   │   ├── PlanningRecommendations.tsx # Weather intelligence advice engine
│   │   └── TemperatureChart.tsx    # 7-day temperature trends with Recharts
│   ├── services/
│   │   └── openMeteo.ts            # Client-side Open-Meteo API integrations
│   ├── utils/
│   │   ├── recommendations.ts      # Planning advice generation rules
│   │   └── weatherCodes.ts         # WMO weather code mappings & icons
│   ├── types.ts                    # TypeScript data types & interfaces
│   ├── index.css                   # Tailwind CSS styling
│   ├── App.tsx                     # Core application view & state manager
│   └── main.tsx                    # Entry point
├── index.html                   # HTML template & meta tags
├── metadata.json                # Application metadata
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Vite configuration
```

---

## Deployment: AI Studio → GitHub → Cloudflare Pages

This app was built in **Google AI Studio App Build**, connected directly to **GitHub**, and deployed to **Cloudflare Pages** from the connected repository.

1. **Build in Google AI Studio App Build.** Generate and test the app (city search, current weather, forecast, charts, recommendations, error states).
2. **Connect to GitHub.** Use AI Studio's direct GitHub connection to push the generated source to an approved repository.
3. **Review the repository.** Confirm `package.json`, source files, framework config, and this README are present.
4. **Connect to Cloudflare Pages.** In Cloudflare, open **Workers & Pages** → create a new **Pages** project from the connected GitHub repository. Select the production branch (usually `main`).
5. **Configure the build.** Build command `npm run build`, build output directory `dist`.
6. **Deploy.** Run the Cloudflare Pages deployment and capture the build log.
7. **Validate.** Open the `pages.dev` URL and test the app in the browser.

### Live URL

```
https://<project-name>.pages.dev
```

---

## SPA Routing Note (refresh 404 fix)

Because this is a Vite single-page app, a direct refresh on a non-root path can return a 404 on Cloudflare Pages. A `public/_redirects` file is pre-configured in this repository containing:

```
/*    /index.html   200
```

When Vite builds the application, this file is automatically copied to `dist/_redirects` so Cloudflare Pages handles SPA client routes seamlessly.

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
