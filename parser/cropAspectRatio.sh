#!/bin/sh
# Caution, this will overwrite the original file.

IMAGE=$1
ASPECT_RATIO=$2

if [ -z $IMAGE ]; then
	echo "Image not found. Please specify an image."
	exit
fi

if [ -z $ASPECT_RATIO ]; then
	echo "Please specify an aspect ratio."
	exit
fi

IMAGE_WIDTH=`identify -format "%[fx:w]" $IMAGE`
IMAGE_HEIGHT=`identify -format "%[fx:h]" $IMAGE`

echo "$IMAGE_WIDTH x $IMAGE_HEIGHT"

OLD_RATIO=$(echo "$IMAGE_WIDTH/$IMAGE_HEIGHT * 100000000" |bc -l)
OLD_RATIO=${OLD_RATIO%.*}

ASPECT_RATIO=$(echo "$ASPECT_RATIO * 100000000" |bc -l)
ASPECT_RATIO=${ASPECT_RATIO%.*}

if [ ${ASPECT_RATIO%.*} -gt ${OLD_RATIO%.*} ]; then
	IMAGE_HEIGHT=$(echo "$IMAGE_WIDTH/$ASPECT_RATIO * 100000000" |bc -l)
	IMAGE_HEIGHT=${IMAGE_HEIGHT%.*}
else
	IMAGE_WIDTH=$(echo "$IMAGE_HEIGHT * $ASPECT_RATIO / 100000000" |bc -l)
	IMAGE_WIDTH=${IMAGE_WIDTH%.*}
fi

echo "Cropping $IMAGE to aspect ratio $ASPECT_RATIO. New size: $IMAGE_WIDTH x $IMAGE_HEIGHT"

convert $IMAGE -gravity Center -crop "$IMAGE_WIDTH"x"$IMAGE_HEIGHT"+0+0 +repage $IMAGE
