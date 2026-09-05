import { GeocodingResponse, GeocodingResult, OpenMeteoResponse, WeatherData, DailyForecastDay } from '../types';
import { getWeatherCondition } from '../utils/weatherCodes';

export class CityNotFoundError extends Error {
  constructor(cityName: string) {
    super(`City "${cityName}" not found — please check spelling or try another city`);
    this.name = 'CityNotFoundError';
  }
}

/**
 * Generates alternative search candidates to handle common user search formats
 * such as "Washington DC", "Washington, DC", "London, UK", "New York, NY", etc.
 */
function getCandidateQueries(input: string): string[] {
  const candidates: string[] = [];
  const trimmed = input.trim();
  if (!trimmed) return candidates;

  const pushUnique = (q: string) => {
    const clean = q.trim().replace(/,+$/, '');
    if (clean && !candidates.includes(clean)) {
      candidates.push(clean);
    }
  };

  // 1. Direct "DC" to "D.C." normalization (Open-Meteo stores Washington as "Washington D.C.")
  const dcFixed = trimmed.replace(/\bDC\b/gi, 'D.C.');
  if (dcFixed !== trimmed) {
    pushUnique(dcFixed);
  }

  // 2. Exact trimmed query as typed by the user
  pushUnique(trimmed);

  // 3. Comma-separated query (e.g., "Washington, DC", "London, UK", "Paris, France")
  if (trimmed.includes(',')) {
    const cityOnly = trimmed.split(',')[0].trim();
    pushUnique(cityOnly);

    const cityOnlyDc = cityOnly.replace(/\bDC\b/gi, 'D.C.');
    if (cityOnlyDc !== cityOnly) {
      pushUnique(cityOnlyDc);
    }
  }

  // 4. Strip common trailing country/state suffixes (e.g., "Washington DC" -> "Washington")
  const suffixCleaned = trimmed.replace(/\s+(DC|D\.C\.|UK|USA|US)$/i, '').trim();
  pushUnique(suffixCleaned);

  return candidates;
}

/**
 * Extracts possible region/state/country hints from queries like "Washington DC" or "London, UK"
 */
function extractLocationHints(input: string): string[] {
  const trimmed = input.trim();
  const hints: string[] = [];

  if (/\bDC\b/i.test(trimmed) || /\bD\.C\.\b/i.test(trimmed)) {
    hints.push('district of columbia', 'dc', 'd.c.');
  }

  if (trimmed.includes(',')) {
    const part = trimmed.split(',')[1].trim().toLowerCase();
    if (part) hints.push(part);
  }

  return hints;
}

/**
 * Fetch autofill recommendations as the user types a city, neighborhood, borough, or locality
 */
export async function getCityAutofillSuggestions(
  query: string,
  count: number = 7
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const candidates = getCandidateQueries(trimmed);
  const results: GeocodingResult[] = [];
  const seenIds = new Set<number>();

  for (const candidate of candidates) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        candidate
      )}&count=${count}&language=en&format=json`;

      const response = await fetch(url);
      if (!response.ok) continue;

      const data: GeocodingResponse = await response.json();
      if (data.results && data.results.length > 0) {
        for (const r of data.results) {
          if (!seenIds.has(r.id)) {
            seenIds.add(r.id);
            results.push(r);
          }
          if (results.length >= count) break;
        }
      }
      if (results.length >= count) break;
    } catch {
      // Ignore transient fetch/abort issues during typing
    }
  }

  return results;
}

export async function searchCityGeocoding(cityName: string): Promise<GeocodingResult> {
  const trimmed = cityName.trim();
  if (!trimmed) {
    throw new Error('Please enter a city name');
  }

  const candidates = getCandidateQueries(trimmed);
  const hints = extractLocationHints(trimmed);

  let lastError: Error | null = null;

  for (const candidate of candidates) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        candidate
      )}&count=10&language=en&format=json`;

      const response = await fetch(url);
      if (!response.ok) {
        lastError = new Error(`Geocoding service error (${response.status})`);
        continue;
      }

      const data: GeocodingResponse = await response.json();
      if (data.results && data.results.length > 0) {
        // If the user provided location hints (e.g. DC or a state/country after a comma),
        // look for a matching candidate in the results
        if (hints.length > 0) {
          const matched = data.results.find((r) => {
            const country = (r.country || '').toLowerCase();
            const countryCode = (r.country_code || '').toLowerCase();
            const admin1 = (r.admin1 || '').toLowerCase();
            const name = (r.name || '').toLowerCase();

            return hints.some(
              (h) =>
                country.includes(h) ||
                countryCode === h ||
                admin1.includes(h) ||
                name.includes(h)
            );
          });

          if (matched) {
            return matched;
          }
        }

        // Return highest-ranked result
        return data.results[0];
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        lastError = err;
      }
    }
  }

  if (lastError && !(lastError instanceof CityNotFoundError)) {
    // If it was a network error across all attempts
    throw lastError;
  }

  throw new CityNotFoundError(trimmed);
}

export async function fetchCityWeather(cityResult: GeocodingResult): Promise<WeatherData> {
  const { latitude, longitude, name, country, admin1, timezone = 'auto' } = cityResult;

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=${encodeURIComponent(
    timezone || 'auto'
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather service error (${response.status})`);
  }

  const rawData: OpenMeteoResponse = await response.json();

  if (!rawData.current || !rawData.daily || !rawData.daily.time) {
    throw new Error('Incomplete weather data received from Open-Meteo');
  }

  const days: DailyForecastDay[] = rawData.daily.time.map((dateStr, index) => {
    // Parse date safely with timezone consideration
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

    const isToday = index === 0;
    const dayName = isToday
      ? 'Today'
      : dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

    const weatherCode = rawData.daily.weather_code[index] ?? 0;
    const conditionInfo = getWeatherCondition(weatherCode);

    return {
      date: dateStr,
      dayName,
      formattedDate,
      weatherCode,
      tempMax: rawData.daily.temperature_2m_max[index] ?? 0,
      tempMin: rawData.daily.temperature_2m_min[index] ?? 0,
      precipitationProbability: rawData.daily.precipitation_probability_max[index] ?? 0,
      condition: conditionInfo.label,
      isToday,
    };
  });

  const currentWeatherCode = rawData.current.weather_code ?? 0;
  const currentCondition = getWeatherCondition(currentWeatherCode);

  return {
    city: name,
    country,
    admin1,
    latitude,
    longitude,
    timezone: rawData.timezone,
    current: {
      temperature: rawData.current.temperature_2m ?? 0,
      humidity: rawData.current.relative_humidity_2m ?? 0,
      windSpeed: rawData.current.wind_speed_10m ?? 0,
      weatherCode: currentWeatherCode,
      condition: currentCondition.label,
      time: rawData.current.time,
    },
    daily: days,
  };
}

export async function fetchWeatherByCityName(cityName: string): Promise<WeatherData> {
  const geo = await searchCityGeocoding(cityName);
  return fetchCityWeather(geo);
}
