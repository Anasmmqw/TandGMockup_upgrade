/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  hasSleeveOption?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  products: Product[];
}

export const COMPANIES = [
  "T&G",
  "Phoenix",
  "Tsunami",
  "U",
  "Classy"
];

export const CATEGORIES: Category[] = [
  {
    id: "tshirts",
    name: "التيشرتات",
    icon: "Shirt",
    products: [
      { id: "polo-long", name: "قميص بولو بكم", hasSleeveOption: true },
      { id: "polo-half", name: "بولو نص كم", hasSleeveOption: true },
      { id: "milton", name: "ميلتون", hasSleeveOption: true },
      { id: "round-long", name: "راوند بكم", hasSleeveOption: true },
      { id: "round-half", name: "راوند نص كم", hasSleeveOption: true },
      { id: "round-milton", name: "راوند ميلتون", hasSleeveOption: true }
    ]
  },
  {
    id: "pants",
    name: "البنطلونات",
    icon: "UtilityPole",
    products: [
      { id: "classic", name: "بنطلون كلاسيك" },
      { id: "chef-pants", name: "بنطلون شيف أورك" },
      { id: "milton-pants", name: "بنطلون ميلتون" },
      { id: "jeans", name: "بنطلون جينز" }
    ]
  },
  {
    id: "jackets",
    name: "جواكيت وهودي",
    icon: "Grape",
    products: [
      { id: "jacket", name: "جاكيت" },
      { id: "chef-jacket", name: "جاكيت شيف" },
      { id: "sweatshirt", name: "سويتشرت" },
      { id: "hoodie", name: "هودي" },
      { id: "oversize-hoodie", name: "هودي أوفر سايز" }
    ]
  },
  {
    id: "shirts",
    name: "القمصان",
    icon: "Shirt",
    products: [
      { id: "shirt", name: "قميص" }
    ]
  },
  {
    id: "vests",
    name: "الفيست",
    icon: "Tally1",
    products: [
      { id: "vest", name: "فيست" },
      { id: "safety-vest", name: "فيست أمان" },
      { id: "engineer-vest", name: "فيست مهندسين" },
      { id: "worker-vest", name: "فيست عمال" }
    ]
  },
  {
    id: "worker",
    name: "يونيفورم عمال",
    icon: "HardHat",
    products: [
      { id: "overall", name: "أفرول عمال" },
      { id: "worker-suit", name: "بدل عمال" },
      { id: "cleaner", name: "عمال النظافة" }
    ]
  },
  {
    id: "chef",
    name: "يونيفورم شيف",
    icon: "ChefHat",
    products: [
      { id: "chef-jacket-2", name: "جاكيت الشيف" },
      { id: "chef-pants-2", name: "شيف بانت" },
      { id: "chef-cap", name: "شيف كاب" },
      { id: "chef-set", name: "طقم شيف" }
    ]
  },
  {
    id: "medical",
    name: "يونيفورم طبي",
    icon: "Stethoscope",
    products: [
      { id: "lab-coat", name: "بالطو" },
      { id: "scrub", name: "سكراب" }
    ]
  },
  {
    id: "sets",
    name: "أطقم إكسسوارات",
    icon: "Baby",
    products: [
      { id: "boys-set", name: "أولاد" },
      { id: "girls-set", name: "بنات" }
    ]
  },
  {
    id: "accessories",
    name: "ملحقات",
    icon: "DraftingCompass",
    products: [
      { id: "cap", name: "كاب" },
      { id: "apron", name: "مريلة" }
    ]
  },
  {
    id: "extra",
    name: "ملابس إضافية",
    icon: "Cloudy",
    products: [
      { id: "pullover", name: "بلوفر" }
    ]
  }
];
