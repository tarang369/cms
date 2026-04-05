import brand from "./brand";
import catalogEntry from "./catalogEntry";
import category from "./category";
import grandchildCategory from "./grandchildCategory";
import seoFields from "./seoFields";
import siteSettings from "./siteSettings";
import subcategory from "./subcategory";
import whatsappLead from "./whatsappLead";

export const schemaTypes = [
  seoFields,
  siteSettings,
  whatsappLead,
  category,
  subcategory,
  grandchildCategory,
  brand,
  catalogEntry,
];
