#!/bin/sh

# Mac OSX installation
# brew install ffmpeg --with-libvpx

FORCE=false
ROOT_DIR="."

for i in "$@"
do
case $i in
    -f|--force)
    	FORCE=true
    ;;
    *)
		ROOT_DIR=$i
    ;;
esac
done

for f in `find $ROOT_DIR | grep .mp4`; do
	if [[ $FORCE = true || ! -e "${f%%.mp4}.webm" ]]; then
		echo "Converting: $(basename $f) to $(basename ${f%%.mp4}.webm)"
		ffmpeg -i $f -c:v libvpx -crf 4 -b:v 1500K -y -strict -2 "${f%%.mp4}.webm"
	fi
done

echo "Done!"
