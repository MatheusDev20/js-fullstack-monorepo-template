#!/usr/bin/env bash
#########################################################
# Empacota a aplicação NestJS para deploy na Lambda.
#
# Por enquanto o script SÓ gera o artefato (.zip) — o Terraform ainda não é
# executado aqui. Quando o módulo estiver pronto, é só consumir o zip gerado
# em ${SERVICE_NAME}.zip (mesmo diretório deste script).
#
# Uso: ./deploy.sh
#########################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

SERVICE_NAME="server_nest_template"
ZIP_PATH="${SCRIPT_DIR}/${SERVICE_NAME}.zip"

if ! command -v zip >/dev/null 2>&1; then
  echo "❌ O comando 'zip' não foi encontrado. Instale-o antes de rodar o deploy."
  exit 1
fi

#############################################
# ----------------- Build ------------------ #
# O nest build (tsc) gera o dist/ preservando o metadata dos decorators; em
# seguida o esbuild empacota o dist/lambda.js num único dist-lambda/index.js.
#############################################

echo "📦 Gerando o bundle da Lambda..."
cd "${SERVER_ROOT}"
rm -rf dist dist-lambda "${ZIP_PATH}"
pnpm run build:lambda

#############################################
# ------------------ Zip ------------------- #
#############################################

echo "🗜️  Compactando o artefato..."
cd "${SERVER_ROOT}/dist-lambda"
zip -q -r "${ZIP_PATH}" index.js

echo "✅ Artefato gerado:"
ls -lh "${ZIP_PATH}"
