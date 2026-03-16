export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;   // current price in paisa
  mrp: number;     // original price in paisa
  image: string;
  images?: string[];
  sizes: string[];
  rating?: number;   // 0..5
  reviews?: number;  // count
  badge?: string;    // e.g. "BEST SELLER" or "BUY 3 @1099"
  bestPriceNote?: string; // e.g. "Best price ₹329"
  aboutItems?: string[];
  reviewsCount?: number;
  customersSay?: { text: string; reviewer: string; image: string }[];
  replacementPolicy?: string;
  freeDelivery?: boolean;
  technicalDetails?: { label: string; value: string }[];
  recommendation?: string;
  inStock?: boolean;
  colors?: string[];
  subCategory?: string;
  imageUrl?: string;
  status?: string;
  appPrice?: number;
  relatedProducts?: any[];
};

const p = (rs: number) => rs * 100;

export const products: Product[] = [
  {
    id: "tee-white",
    name: "Crisp White Tee",
    slug: "crisp-white-tee",
    description: "Clean look. Breathable fabric for everyday wear.",
    price: p(549),
    mrp: p(1199),
    image: "https://images.unsplash.com/photo-1589902860314-e910697dea18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1589902860314-e910697dea18?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687"
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviews: 195,
    badge: "TRENDING",
    bestPriceNote: "Best price ₹499"
  },
  {
    id: "tee-black",
    name: "Classic Black Tee",
    slug: "classic-black-tee",
    description: "Timeless. Essential black tee for any wardrobe.",
    price: p(499),
    mrp: p(999),
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      "https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687"
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 230,
    badge: "BEST SELLER",
    bestPriceNote: "Best price ₹449"
  },
  {
    id: "tee-blue",
    name: "Royal Blue Tee",
    slug: "royal-blue-tee",
    description: "Vibrant. Stand out with this bold royal blue.",
    price: p(549),
    mrp: p(1199),
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687"
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 142,
    badge: "NEW",
    bestPriceNote: "Best price ₹499"
  },

];
