export function updateCropArea(context) {
  const data = context.$refs.cropper.getData();
  data.width = context.width;
  data.height = context.height;
  data.x = context.x;
  data.y = context.y;
  context.$refs.cropper.setData(data);
}

export function selectCrop(context) {
  context.cropSelected = true;
}

export function updateCroppedImage(context) {
  if (context.$refs.cropper) {
    context.$refs.cropper
      .getCroppedCanvas({
        width: context.width,
        height: context.height,
      })
      .toBlob((blob) => {
        const data = context.$refs.cropper.getData();
        context.croppedImage = blob;
        context.width = Math.round(context.$refs.cropper.getData().width);
        context.height = Math.round(context.$refs.cropper.getData().height);
        context.x = Math.round(data.x);
        context.y = Math.round(data.y);
      });
  }
}

export function cropImage(context) {
  if (context.$refs.cropper) {
    context.$refs.cropper
      .getCroppedCanvas({
        width: context.width,
        height: context.height,
      })
      .toBlob((blob) => {
        context.croppedImage = blob;
        context.width = Math.round(context.$refs.cropper.getData().width);
        context.height = Math.round(context.$refs.cropper.getData().height);
        context.showCropper = false;
      });
  }
}
