#!/bin/bash

OUTPUT_DIR="upload"
COPY_RAW=(zeropointthree.html stylesheet.css img js libs)
COPY_CONTENT_RAW=(content/images content/intro_videos)
IMAGE_MAXSIZE=1280
THUMBNAIL_MAXSIZE=720
POSTER_MAXSIZE=1280
THUMBNAIL_ASPECT_RATIO=$(echo "3/2" |bc -l)
VIDEO_ASPECT_RATIO=$(echo "16/9" |bc -l)

echo "GENERATING UNDERGROUND WEBPAGE"

rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR/content/sections

# SASS PARSING
sass scss/stylesheet.scss stylesheet.css

# Copy anything that doesn't need parsing
for copy in "${COPY_RAW[@]}"; do
	cp -r $copy $OUTPUT_DIR
done
for copy in "${COPY_CONTENT_RAW[@]}"; do
	cp -r $copy $OUTPUT_DIR/content
done
mv $OUTPUT_DIR/zeropointthree.html $OUTPUT_DIR/index.html

# Parse and copy Markdown files
ruby parser/compile_data.rb content/sections/*.md
cp content/sections/*.html $OUTPUT_DIR/content/sections/

# Parse image files, convert
IMAGES=()
while read line; do IMAGES+=($line); done <  parser/images.txt

for image in "${IMAGES[@]}"; do
	FILE_NAME=$(basename $image)
	IMAGE_OUTPUT_DIR=$(dirname $OUTPUT_DIR/$image)
	IMAGE_COMPRESS_FLAGS="-strip -interlace Plane -quality 85%"

	# Add a blur if the image is less than 100kB
	if [ $(wc -c <"$image") -gt 100000 ]; then
		IMAGE_COMPRESS_FLAGS="$IMAGE_COMPRESS_FLAGS -gaussian-blur 0.02"
	fi

	echo "Copying and resizing: $FILE_NAME"
	mkdir -p $IMAGE_OUTPUT_DIR
	convert $image $IMAGE_COMPRESS_FLAGS -resize $IMAGE_MAXSIZE\> $OUTPUT_DIR/$image

	# Create thumbnails at 3/2 aspect ratio
	mkdir -p $IMAGE_OUTPUT_DIR/thumbs
	convert $image -strip -interlace Plane $IMAGE_COMPRESS_FLAGS -quality 85% -resize $THUMBNAIL_MAXSIZE\> $IMAGE_OUTPUT_DIR/thumbs/$FILE_NAME
	./parser/cropAspectRatio.sh $IMAGE_OUTPUT_DIR/thumbs/$FILE_NAME $THUMBNAIL_ASPECT_RATIO
done


# Parse video files
VIDEOS=()
while read line; do VIDEOS+=($line); done <  parser/videos.txt
VIDEOS+=("content/intro_videos/F_Intro_Christian1.mp4")
VIDEOS+=("content/intro_videos/F_Intro_Muslim2.mp4")

for video in "${VIDEOS[@]}"; do
	FILE_NAME=$(basename $video)
	WEBM_FILE_NAME="${FILE_NAME%.*}.webm"
	VIDEO_POSTER_NAME="${FILE_NAME%.*}.jpg"
	VIDEO_INPUT_DIR=$(dirname $video)
	VIDEO_OUTPUT_DIR=$(dirname $OUTPUT_DIR/$video)

	echo "Copying and converting: $FILE_NAME"
	mkdir -p $VIDEO_OUTPUT_DIR

	# Convert video posters
	convert $VIDEO_INPUT_DIR/$VIDEO_POSTER_NAME -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -resize $POSTER_MAXSIZE\> $VIDEO_OUTPUT_DIR/$VIDEO_POSTER_NAME
	./parser/cropAspectRatio.sh $VIDEO_OUTPUT_DIR/$VIDEO_POSTER_NAME $VIDEO_ASPECT_RATIO

	# Convert videos to webm
	ffmpeg -i $video -threads 0 -nostdin -movflags faststart -vcodec h264 -y -acodec aac -strict -2 "$VIDEO_OUTPUT_DIR/$FILE_NAME"
	ffmpeg -i $video -threads 0 -nostdin -c:v libvpx -crf 4 -b:v 1500K -y -strict -2 "$VIDEO_OUTPUT_DIR/$WEBM_FILE_NAME"
done

