export type NavType = 'primary' | 'secondary';

export interface State {
  id: string;
  name: string;
  abbreviation: string;
  path: string;
  providerCount: number;
  isActive: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  navType: NavType;
  isActive: boolean;
  isHighlighted: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  providerCount: number;
  isActive: boolean;
} 