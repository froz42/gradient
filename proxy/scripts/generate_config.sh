#!/bin/bash

INPUT_FILE=$1
OUTPUT_FILE=$2

function usage {
    echo "Usage: $0 <input_file> <output_file>"
    exit 1
}

if [ -z "$INPUT_FILE" ]; then
    usage
fi

if [ -z "$OUTPUT_FILE" ]; then
    usage
fi

# substitute the variables in the input file with the format like {{VAR_NAME}} by environment variables

# get all the variables in the input file
VARS=$(grep -oE '\{\{[A-Z_]+\}\}' $INPUT_FILE | sort | uniq | sed -e 's/^{{//' -e 's/}}$//')

TMP_FILE=.tmp

# substitute the variables with the environment variables
error_not_set=0
cp $INPUT_FILE $TMP_FILE
for VAR in $VARS; do
    if [ -z "${!VAR}" ]; then
        echo "Error: $VAR is not set"
        error_not_set=1
    fi
    sed -i "s/{{$VAR}}/${!VAR}/g" $TMP_FILE
done

if [ $error_not_set -eq 1 ]; then
    rm -f $TMP_FILE
    exit 1
fi

mv $TMP_FILE $OUTPUT_FILE
