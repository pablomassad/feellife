#!/bin/bash
comment="$1"

git add .
git commit -m "$comment" 
git push ionic master