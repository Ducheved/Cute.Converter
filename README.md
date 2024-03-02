# Cute.Converter Σ(°△°|||)︴

| VERSION 0.0.11

This repository is a work in progress and does not contain a finished product. It is the foundation for a future image converter that currently works with the following endpoint:

```
http://localhost:33250/api/v1/images/process?format=png&optimize=true&resize={"height":220}&quality=20
```

You can use the following curl command to interact with the endpoint:

```bash
curl --location --globoff 'http://localhost:33250/api/v1/images/process?format=png&optimize=true&resize={%22height%22%3A220}&quality=20' \
--form 'image=@"/V:/test.webp"'
```

Here's a breakdown of the parameters:

- `format=png`: Specifies the output format of the image.
- `optimize=true`: Tells the server to optimize the image.
- `resize={%22height%22%3A220}`: Tells the server to resize the image to a height of 220 pixels. The width will be adjusted to maintain the aspect ratio.
- `quality=20`: Sets the quality of the output image to 20 (out of 100).
- `--form 'image=@"/V:/test.webp"'`: Specifies the form data to be sent. The `@` symbol tells curl to upload a file, and `"/V:/test.webp"` is the file path of the image to be processed.

## Current Functionality

The current implementation provides the following features:

- **File Type Validation**: Validates the incoming file to ensure it is an image. Currently supports 'png', 'jpg', 'jpeg', 'webp', 'tiff', and 'gif' formats.
- **Image Processing**: Uses the Sharp library to process the image. Can change the format, optimize, resize, and adjust the quality of the image based on the parameters provided in the request.
- **Metadata Generation**: Generates metadata for both the input and output images, including size, dimensions, format, and quality.

Please note that this is a work in progress and additional features will be added in the future.


## Author

This project is created by [Ducheved](https://github.com/Ducheved). For any issues, please report [here](https://github.com/Ducheved/Cute.Converter/issues).

## License

This project is licensed under the MIT License. 

｡･ﾟ･(ﾉД`)ヽ(￣ω￣ )
