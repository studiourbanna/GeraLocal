export interface StoreConfig {
  name: string;
  theme: 'light' | 'dark';
  accessibility: 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}