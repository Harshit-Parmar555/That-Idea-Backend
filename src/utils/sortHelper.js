// sort helper function
export const getSortOption = (sortBy) => {
  if (sortBy === "newest") return { createdAt: -1 };
  if (sortBy === "oldest") return { createdAt: 1 };
  return null; // for "popular" or default
};
