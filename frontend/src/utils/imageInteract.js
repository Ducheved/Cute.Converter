export function initImagePanzoom(refs) {
  if (!refs.image) {
    return;
  }

  const imgContainer = refs.container;
  const img = refs.image;

  imgContainer.style.overflow = 'auto';
  imgContainer.style.display = 'flex';
  imgContainer.style.justifyContent = 'center';
  imgContainer.style.alignItems = 'flex-start';
  imgContainer.style.maxHeight = '50vh';
  img.style.cursor = 'all-scroll';
  img.style.transformOrigin = '0 0';
  img.style.transition = 'transform 0.35s';
  img.style.maxHeight = '100%';
  img.onwheel = zoomImage.bind(this, img, imgContainer);
  img.addEventListener('wheel', zoomImage.bind(this, img, imgContainer), {
    passive: false,
  });
}

export function zoomImage(img, imgContainer, e) {
  e.preventDefault();
  e.stopPropagation();

  const scale = e.deltaY < 0 ? 1.1 : 0.9;

  const transform = img.style.transform === '' ? 'scale(1)' : img.style.transform;
  const value = parseFloat(transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')));
  const newScale = Math.min(Math.max(1, value * scale), 3);

  img.style.transform = `scale(${newScale})`;
}

export function resetZoom(refs) {
  if (refs.image) {
    refs.image.style.transform = 'scale(1)';
  }
}
