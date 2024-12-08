#!/bin/bash

# Obtener la IP dinámica actual
CURRENT_IP=$(hostname -I | awk '{print $1}')

# Directorio donde están los archivos a modificar
TARGET_DIR="/usr/share/nginx/html"

# Buscar y reemplazar en todos los archivos que mencionen la IP antigua
OLD_IP="192.168.1.135"

echo "Reemplazando todas las referencias de $OLD_IP por $CURRENT_IP en los archivos del directorio $TARGET_DIR..."

# Reemplazar en los archivos
find "$TARGET_DIR" -type f -exec sed -i "s/$OLD_IP/$CURRENT_IP/g" {} +

echo "Referencias actualizadas correctamente."
