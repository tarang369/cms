import brand from "./brand";
import catalogEntry from "./catalogEntry";
import category from "./category";
import grandchildCategory from "./grandchildCategory";
import seoFields from "./seoFields";
import siteSettings from "./siteSettings";
import subcategory from "./subcategory";

export const schemaTypes = [
  seoFields,
  siteSettings,
  category,
  subcategory,
  grandchildCategory,
  brand,
  catalogEntry,
];
