/*
  MONTH-BY-MONTH CHAPTERS — the only file you edit to change the timeline.

  Each chapter:
    id           unique number
    chapter      small label above the title
    title        chapter title
    month        e.g. "1st Month"
    date         optional free text, e.g. "12 Nov 2025" (leave "" to hide)
    description  1-2 warm sentences
    image        main photo path (served from /public)
    images       OPTIONAL extra photos for this chapter: ["/photos/months/3a.jpg", ...]
    position     OPTIONAL focal point for cropping, e.g. "50% 30%"
    caption      OPTIONAL text shown in the full-screen viewer

  To add photos: drop the file into /public/photos/months/ and change `image`.
  A missing file never crashes the page — an elegant placeholder is shown instead.
*/
export const MEMORIES = [
  { id: 1, chapter: "CHAPTER 01", title: "The Beginning", month: "1st Month", date: "",
    description: "Everything was new — the light, the quiet, and the first soft days of getting to know you.",
    image: "/photos/1st-month.jpeg", images: [], position: "50% 40%" },
  { id: 2, chapter: "CHAPTER 02", title: "First Smiles", month: "2nd Month", date: "",
    description: "A tiny smile, and suddenly the whole house felt brighter than it ever had before.",
    image: "/photos/2nd-month.jpeg", images: [], position: "50% 40%" },
  { id: 3, chapter: "CHAPTER 03", title: "Little Discoveries", month: "3rd Month", date: "",
    description: "Hands, voices, faces, sounds — every ordinary thing became a small wonder.",
    image: "/photos/3rd-month.jpeg", images: [], position: "50% 40%" },
  { id: 4, chapter: "CHAPTER 04", title: "Bright Eyes", month: "4th Month", date: "",
    description: "Curious eyes followed every light, every smile, every one of us.",
    image: "/photos/4th-month.jpeg", images: [], position: "50% 35%" },
  { id: 5, chapter: "CHAPTER 05", title: "Growing Stronger", month: "5th Month", date: "",
    description: "Stronger each day, and a little more himself with every passing week.",
    image: "/photos/5th-month.jpeg", images: [], position: "50% 40%" },
  { id: 6, chapter: "CHAPTER 06", title: "Halfway to One", month: "6th Month", date: "",
    description: "Six months of love, laughter and sleepy cuddles — halfway to a whole year.",
    image: "/photos/6th-month.jpeg", images: [], position: "50% 40%" },
  { id: 7, chapter: "CHAPTER 07", title: "Little Explorer", month: "7th Month", date: "",
    description: "The world got bigger, and so did his curiosity about every corner of it.",
    image: "/photos/7th-month.jpeg", images: [], position: "50% 40%" },
  { id: 8, chapter: "CHAPTER 08", title: "The Sound of Joy", month: "8th Month", date: "",
    description: "Giggles that filled the room and made every tired day worth it.",
    image: "/photos/8th-month.jpeg", images: [], position: "50% 40%" },
  { id: 9, chapter: "CHAPTER 09", title: "Reaching Higher", month: "9th Month", date: "",
    description: "Always reaching for something new — a toy, a hand, the next big moment.",
    image: "/photos/9th-month.jpeg", images: [], position: "50% 40%" },
  { id: 10, chapter: "CHAPTER 10", title: "New Adventures", month: "10th Month", date: "",
    description: "Every day brought another little adventure, and we followed wherever he led.",
    image: "/photos/10th-month.jpeg", images: [], position: "50% 40%" },
  { id: 11, chapter: "CHAPTER 11", title: "Almost One", month: "11th Month", date: "",
    description: "So close to a whole year, and still so many sweet moments we want to hold on to.",
    image: "/photos/11th-month.jpeg", images: [], position: "50% 40%" },
  { id: 12, chapter: "CHAPTER 12", title: "One Whole Year", month: "12th Month", date: "",
    description: "One year of Jambu. One year of wonder, and a lifetime of love still ahead.",
    image: "/photos/12th-month.jpeg", images: [], position: "50% 40%" },
    
];
