import { Entity } from './Base';
import { Product } from './Product';

export interface FavoritesTabProps extends Entity {
  favoriteProducts: Product[];
  loading: boolean;
}