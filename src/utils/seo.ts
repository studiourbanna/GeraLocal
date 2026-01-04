export const updateMetaTags = (title: string, description: string, image?: string) => {
  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description);
  if (image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);
  }
};