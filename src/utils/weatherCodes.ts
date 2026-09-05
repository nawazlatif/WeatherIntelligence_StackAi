import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  CloudHail,
  LucideIcon,
} from 'lucide-react';

export interface WeatherConditionInfo {
  label: string;
  description: string;
  icon: LucideIcon;
  themeColor: string; // for accent pills or badges
  bgGradient: string;
  iconColor: string;
}

export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: 'Sunny and clear conditions',
        icon: Sun,
        themeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        bgGradient: 'from-amber-500/10 via-slate-900 to-slate-950',
        iconColor: 'text-amber-400',
      };
    case 1:
      return {
        label: 'Mainly Clear',
        description: 'Mostly sunny with scattered skies',
        icon: CloudSun,
        themeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
        bgGradient: 'from-amber-400/10 via-slate-900 to-slate-950',
        iconColor: 'text-amber-300',
      };
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Mix of sun and clouds',
        icon: CloudSun,
        themeColor: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20',
        bgGradient: 'from-cyan-500/10 via-slate-900 to-slate-950',
        iconColor: 'text-cyan-400',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Thick cloud cover',
        icon: Cloud,
        themeColor: 'text-slate-300 bg-slate-800 border-slate-700',
        bgGradient: 'from-slate-700/20 via-slate-900 to-slate-950',
        iconColor: 'text-slate-400',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Fog and reduced visibility',
        icon: CloudFog,
        themeColor: 'text-teal-300 bg-teal-500/10 border-teal-500/20',
        bgGradient: 'from-teal-500/10 via-slate-900 to-slate-950',
        iconColor: 'text-teal-400',
      };
    case 51:
      return {
        label: 'Light Drizzle',
        description: 'Gentle mist and light drizzle',
        icon: CloudDrizzle,
        themeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        bgGradient: 'from-cyan-500/15 via-slate-900 to-slate-950',
        iconColor: 'text-cyan-400',
      };
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        description: 'Continuous damp drizzle',
        icon: CloudDrizzle,
        themeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        bgGradient: 'from-blue-500/15 via-slate-900 to-slate-950',
        iconColor: 'text-blue-400',
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Icy drizzle and slick surfaces',
        icon: CloudHail,
        themeColor: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/30',
        bgGradient: 'from-cyan-400/15 via-slate-900 to-slate-950',
        iconColor: 'text-cyan-300',
      };
    case 61:
      return {
        label: 'Light Rain',
        description: 'Intermittent light rain showers',
        icon: CloudRain,
        themeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        bgGradient: 'from-blue-600/15 via-slate-900 to-slate-950',
        iconColor: 'text-blue-400',
      };
    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady rain throughout the day',
        icon: CloudRain,
        themeColor: 'text-blue-300 bg-blue-600/20 border-blue-500/40',
        bgGradient: 'from-blue-600/20 via-slate-900 to-slate-950',
        iconColor: 'text-blue-400',
      };
    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Substantial downpours',
        icon: CloudRain,
        themeColor: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40',
        bgGradient: 'from-indigo-600/25 via-slate-900 to-slate-950',
        iconColor: 'text-indigo-400',
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Freezing rain, slick roads',
        icon: CloudHail,
        themeColor: 'text-cyan-200 bg-cyan-500/20 border-cyan-400/40',
        bgGradient: 'from-cyan-500/20 via-slate-900 to-slate-950',
        iconColor: 'text-cyan-300',
      };
    case 71:
      return {
        label: 'Light Snow',
        description: 'Gentle flurries and dustings',
        icon: Snowflake,
        themeColor: 'text-sky-300 bg-sky-500/15 border-sky-400/30',
        bgGradient: 'from-sky-500/15 via-slate-900 to-slate-950',
        iconColor: 'text-sky-300',
      };
    case 73:
    case 75:
      return {
        label: 'Snowfall',
        description: 'Accumulating snowfall',
        icon: CloudSnow,
        themeColor: 'text-indigo-200 bg-indigo-500/20 border-indigo-400/30',
        bgGradient: 'from-indigo-500/20 via-slate-900 to-slate-950',
        iconColor: 'text-indigo-300',
      };
    case 77:
      return {
        label: 'Snow Grains',
        description: 'Small frozen ice grains',
        icon: Snowflake,
        themeColor: 'text-sky-200 bg-sky-500/20 border-sky-400/30',
        bgGradient: 'from-sky-500/20 via-slate-900 to-slate-950',
        iconColor: 'text-sky-300',
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        description: 'Passing rain showers',
        icon: CloudRain,
        themeColor: 'text-blue-300 bg-blue-500/20 border-blue-400/30',
        bgGradient: 'from-blue-500/20 via-slate-900 to-slate-950',
        iconColor: 'text-blue-400',
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Sudden snowy squalls',
        icon: CloudSnow,
        themeColor: 'text-sky-200 bg-sky-600/20 border-sky-400/30',
        bgGradient: 'from-sky-600/20 via-slate-900 to-slate-950',
        iconColor: 'text-sky-300',
      };
    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Lightning and heavy downpours',
        icon: CloudLightning,
        themeColor: 'text-purple-300 bg-purple-500/20 border-purple-400/40',
        bgGradient: 'from-purple-600/25 via-slate-900 to-slate-950',
        iconColor: 'text-purple-400',
      };
    case 96:
    case 99:
      return {
        label: 'Severe Storm & Hail',
        description: 'Thunderstorm with hail activity',
        icon: CloudHail,
        themeColor: 'text-purple-200 bg-purple-600/25 border-purple-400/40',
        bgGradient: 'from-purple-700/30 via-slate-900 to-slate-950',
        iconColor: 'text-purple-300',
      };
    default:
      return {
        label: 'Partly Cloudy',
        description: 'Variable meteorological conditions',
        icon: CloudSun,
        themeColor: 'text-slate-300 bg-slate-800 border-slate-700',
        bgGradient: 'from-slate-800/40 via-slate-900 to-slate-950',
        iconColor: 'text-cyan-400',
      };
  }
}
