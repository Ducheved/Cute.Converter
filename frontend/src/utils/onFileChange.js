export function onFileChange(context, e) {
  if (e.target.files[0]) {
    context.selectedFile = e.target.files[0];
    context.fileName = context.selectedFile.name;
    context.imageUrl = URL.createObjectURL(context.selectedFile);
  }
  context.selectedFile = e.target.files[0];
  const img = new Image();
  const reader = new FileReader();
  reader.onload = (event) => {
    img.onload = () => {
      context.width = img.width;
      context.height = img.height;
      context.x = 0;
      context.y = 0;
      context.initImagePanzoom();
    };
    img.onerror = () => {
      context.errorModal.show = true;
      context.errorModal.message = 'Failed to load image';
    };
    img.src = event.target.result;
  };
  reader.onerror = () => {
    context.errorModal.show = true;
    context.errorModal.message = 'Failed to read file';
  };
  reader.readAsDataURL(context.selectedFile);
}
