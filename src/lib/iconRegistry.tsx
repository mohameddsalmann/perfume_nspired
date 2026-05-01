'use client';

import React from 'react';
import {
  User, UserCircle, Sparkles, Flower2, Sun, Leaf, Snowflake, Calendar,
  Wind, Gauge, Zap, Citrus, Cookie, Trees, Flame, Gem, Circle, Shirt,
  Sprout, Apple, Search, X, Check, ChevronLeft, Heart, Star, ChevronDown,
  Droplets, Cherry, Nut, Coffee, Wine, Sparkle, Flower,
  TreePine, CloudRain, CloudSun, CloudSnow,
  Thermometer, Palette, Music, Shield, Crown, Diamond, Feather,
  Frown, Smile, Meh, ThumbsUp, ThumbsDown, Ban, AlertTriangle,
  Banana, Moon, Waves, Mountain, Cigarette, Beer, Grape,
  HelpCircle, CircleDot, Squirrel, LeafyGreen
} from 'lucide-react';

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string; className?: string }>;

const iconMap: Record<string, IconComponent> = {
  // Quiz step option icons
  User,
  UserCircle,
  Sparkles,
  Flower2,
  Sun,
  Leaf,
  Snowflake,
  Calendar,
  Wind,
  Gauge,
  Zap,

  // Note category icons
  Citrus,
  Cookie,
  Trees,
  Flame,
  Gem,
  Circle,
  Shirt,
  Sprout,
  Apple,

  // UI chrome icons
  Search,
  X,
  Check,
  ChevronLeft,
  ChevronDown,
  Heart,
  Star,

  // Note-specific icons
  Droplets,
  Cherry,
  Nut,
  Coffee,
  Wine,
  Sparkle,
  Flower,
  TreePine,
  CloudRain,
  CloudSun,
  CloudSnow,
  Thermometer,
  Palette,
  Music,
  Shield,
  Crown,
  Diamond,
  Feather,
  Frown,
  Smile,
  Meh,
  ThumbsUp,
  ThumbsDown,
  Ban,
  AlertTriangle,
  Banana,
  Moon,
  Waves,
  Mountain,
  Cigarette,
  Beer,
  Grape,
  HelpCircle,
  CircleDot,
  Squirrel,
  LeafyGreen,
};

export function getIcon(name: string): IconComponent {
  return iconMap[name] || HelpCircle;
}

interface RenderIconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function RenderIcon({ name, size = 28, strokeWidth = 1.5, className }: RenderIconProps) {
  const Icon = getIcon(name);
  return React.createElement(Icon, { size, strokeWidth, className });
}

export default iconMap;
