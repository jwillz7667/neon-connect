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

// Header Props as defined in .cursorrules
export interface HeaderProps {
  logo: {
    src: string;
    alt: 'NeonMeet.com';
    height: number;
    width: number;
  };
  navigation: {
    primary: Array<{
      label: 'ESCORTS' | 'MASSAGE' | 'AFFAIRS' | 'LIVE ESCORTS';
      path: string;
      isActive: boolean;
    }>;
    secondary: Array<{
      label: 'SEARCH' | 'POST AD';
      path: string;
      isHighlighted?: boolean;
    }>;
  };
  searchBar?: {
    placeholder: 'Search NeonMeet...';
    onSearch: (query: string) => void;
  };
}

// State Selection Grid Props
export interface StateGridProps {
  states: Array<{
    name: string;
    abbreviation: string;
    path: string;
    providerCount: number;
    isActive: boolean;
  }>;
  layout: 'grid' | 'list';
  onStateSelect: (stateId: string) => void;
} 