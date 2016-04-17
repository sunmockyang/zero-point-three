#!/bin/bash

OUTPUT_DIR="upload"
COPY_RAW=(zeropointthree.html stylesheet.css img js libs content/images content/intro_videos)
IMAGE_MAXSIZE=1280
THUMBNAIL_MAXSIZE=720
POSTER_MAXSIZE=1280

echo "GENERATING UNDERGROUND WEBPAGE"

rm -rf $OUTPUT_DIR

mkdir -p $OUTPUT_DIR/content/sections

# Copy anything that doesn't need parsing
for copy in "${COPY_RAW[@]}"; do
	cp -r $copy $OUTPUT_DIR/$copy
done

mv $OUTPUT_DIR/zeropointthree.html $OUTPUT_DIR/index.html

# Parse Markdown files
ruby parser/compile_data.rb content/sections/*.md

cp content/sections/*.html $OUTPUT_DIR/content/sections/

# Parse image files, convert
while read image    
do
	FILE_NAME=$(basename $image)
	IMAGE_OUTPUT_DIR=$(dirname $OUTPUT_DIR/$image)

	echo "Copying and resizing: $FILE_NAME"
	mkdir -p $IMAGE_OUTPUT_DIR
	cp $image $IMAGE_OUTPUT_DIR
	convert $OUTPUT_DIR/$image -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -resize $IMAGE_MAXSIZE\> $OUTPUT_DIR/$image

	mkdir -p $(dirname $OUTPUT_DIR/$image)/thumbs
	convert $OUTPUT_DIR/$image -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -resize $THUMBNAIL_MAXSIZE\> $IMAGE_OUTPUT_DIR/thumbs/$FILE_NAME
done < parser/images.txt

# Parse video files
while read video    
do
	FILE_NAME=$(basename $video)
	WEBM_FILE_NAME="${FILE_NAME%.*}.webm"
	VIDEO_POSTER_NAME="${FILE_NAME%.*}.jpg"
	VIDEO_INPUT_DIR=$(dirname $video)
	VIDEO_OUTPUT_DIR=$(dirname $OUTPUT_DIR/$video)

	echo "Copying and converting: $FILE_NAME"
	mkdir -p $VIDEO_OUTPUT_DIR
	cp $VIDEO_INPUT_DIR/$VIDEO_POSTER_NAME $VIDEO_OUTPUT_DIR

	# Convert video posters
	convert $VIDEO_OUTPUT_DIR/$VIDEO_POSTER_NAME -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -resize $POSTER_MAXSIZE\> $VIDEO_OUTPUT_DIR/$VIDEO_POSTER_NAME

	# Convert videos to webm
	ffmpeg -i $video -threads 0 -nostdin -c:v libvpx -crf 4 -b:v 1500K -y -strict -2 "$VIDEO_OUTPUT_DIR/$WEBM_FILE_NAME"
	ffmpeg -i $video -threads 0 -nostdin -movflags faststart -vcodec h264 -y -acodec aac -strict -2 "$VIDEO_OUTPUT_DIR/$FILE_NAME"
done < parser/videos.txt

