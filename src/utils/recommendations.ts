import { WeatherData, PlanningRecommendation } from '../types';

export function generatePlanningRecommendations(
  data: WeatherData,
  isImperial: boolean = false
): PlanningRecommendation[] {
  const recommendations: PlanningRecommendation[] = [];
  const { current, daily } = data;

  const formatTemp = (celsius: number) => {
    if (isImperial) {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  // 1. Rain and Precipitation Analysis
  const rainyDays = daily.filter((d) => d.precipitationProbability >= 45 || [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(d.weatherCode));
  const todayForecast = daily[0];

  if (todayForecast && todayForecast.precipitationProbability >= 50) {
    recommendations.push({
      id: 'rain-today',
      category: 'rain',
      urgency: 'caution',
      title: 'Carry an umbrella today',
      description: `${todayForecast.precipitationProbability}% chance of precipitation with ${todayForecast.condition.toLowerCase()}. Keep rain gear handy.`,
    });
  } else if (rainyDays.length > 0) {
    const highestRainDay = [...daily].sort(
      (a, b) => b.precipitationProbability - a.precipitationProbability
    )[0];
    if (highestRainDay && highestRainDay.precipitationProbability >= 45) {
      recommendations.push({
        id: `rain-${highestRainDay.date}`,
        category: 'rain',
        urgency: 'caution',
        title: `Rain expected on ${highestRainDay.dayName}`,
        description: `High precipitation probability (${highestRainDay.precipitationProbability}%). Plan indoor commutes or pack rain protection for ${highestRainDay.dayName}.`,
      });
    }
  } else {
    recommendations.push({
      id: 'dry-spell',
      category: 'rain',
      urgency: 'positive',
      title: 'Dry days ahead',
      description: 'Minimal precipitation expected across the next 7 days. Perfect for car washes and outdoor commutes.',
    });
  }

  // 2. Temperature Fluctuations / Dressing
  const minTemps = daily.map((d) => d.tempMin);
  const maxTemps = daily.map((d) => d.tempMax);
  const lowestMin = Math.min(...minTemps);
  const highestMax = Math.max(...maxTemps);
  const coldestDay = daily.find((d) => d.tempMin === lowestMin);
  const hottestDay = daily.find((d) => d.tempMax === highestMax);

  const currentMax = todayForecast ? todayForecast.tempMax : current.temperature;
  const significantDropDay = daily.find((d, idx) => idx > 0 && currentMax - d.tempMax >= 5);

  if (lowestMin <= 4 && coldestDay) {
    recommendations.push({
      id: 'cold-snap',
      category: 'temperature',
      urgency: 'caution',
      title: 'Chilly conditions — bundle up',
      description: `Temperatures dipping to ${formatTemp(lowestMin)} on ${coldestDay.dayName}. Heavy coat, scarf, or thermal layers recommended in the morning.`,
    });
  } else if (significantDropDay) {
    recommendations.push({
      id: 'temp-drop',
      category: 'temperature',
      urgency: 'info',
      title: `Cooler turn starting ${significantDropDay.dayName}`,
      description: `Highs will drop to ${formatTemp(significantDropDay.tempMax)} compared to today's ${formatTemp(currentMax)}. Have an extra layer ready.`,
    });
  } else if (highestMax >= 28 && hottestDay) {
    recommendations.push({
      id: 'heat-caution',
      category: 'temperature',
      urgency: 'caution',
      title: `Warm peak on ${hottestDay.dayName}`,
      description: `Highs climbing to ${formatTemp(highestMax)}. Stay hydrated, seek shade at midday, and apply UV protection.`,
    });
  } else {
    recommendations.push({
      id: 'mild-temp',
      category: 'temperature',
      urgency: 'positive',
      title: 'Consistent seasonal temperatures',
      description: `Mild span with highs hovering around ${formatTemp(daily.reduce((acc, d) => acc + d.tempMax, 0) / daily.length)}. Light jacket weather.`,
    });
  }

  // 3. Outdoor & Weekend Suitability
  const weekendDays = daily.filter((d) => {
    const day = d.dayName.toLowerCase();
    return day === 'saturday' || day === 'sunday' || day === 'sat' || day === 'sun';
  });

  if (weekendDays.length > 0) {
    const weekendRainMax = Math.max(...weekendDays.map((d) => d.precipitationProbability));
    if (weekendRainMax <= 25) {
      recommendations.push({
        id: 'weekend-outdoor',
        category: 'outdoor',
        urgency: 'positive',
        title: 'Prime weather for weekend plans',
        description: `Clear conditions and low rain chance across the weekend. Ideal for cycling, park outings, or dining outdoors.`,
      });
    } else if (weekendRainMax >= 55) {
      recommendations.push({
        id: 'weekend-indoor',
        category: 'outdoor',
        urgency: 'info',
        title: 'Weekend shower probability',
        description: `Up to ${weekendRainMax}% precipitation risk this weekend. Have backup indoor options or rain gear ready.`,
      });
    }
  }

  // 4. Wind & Air / Sport Recommendation
  if (current.windSpeed >= 25) {
    recommendations.push({
      id: 'wind-alert',
      category: 'wind',
      urgency: 'caution',
      title: 'Gusty breeze today',
      description: `Wind speeds reaching ${Math.round(current.windSpeed)} km/h. Secure loose balcony items and anticipate resistance for outdoor cycling.`,
    });
  } else if (recommendations.length < 3) {
    // Find the sunniest / best day
    const bestDay = daily.find(
      (d) => [0, 1, 2].includes(d.weatherCode) && d.precipitationProbability < 20
    );
    if (bestDay && !bestDay.isToday) {
      recommendations.push({
        id: `best-${bestDay.date}`,
        category: 'outdoor',
        urgency: 'positive',
        title: `Best outdoor day: ${bestDay.dayName}`,
        description: `Sunny skies with highs of ${formatTemp(bestDay.tempMax)} and minimal rain threat (${bestDay.precipitationProbability}%). Great for travel or sports.`,
      });
    } else {
      recommendations.push({
        id: 'exercise-conditions',
        category: 'outdoor',
        urgency: 'positive',
        title: 'Good conditions for outdoor fitness',
        description: `Moderate winds and temperate air make mornings suitable for jogging, walking, and running.`,
      });
    }
  }

  // Guarantee 2 to 4 recommendations
  return recommendations.slice(0, 4);
}
