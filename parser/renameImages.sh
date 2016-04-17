#!/bin/sh

for f in `find . | grep .JPG`; do
	echo "Renaming:"
	echo "$f to ${f%%.JPG}.jpg"
	mv $f "${f%%.JPG}.jpg"
done

echo "Done!"
