# 🔋 HybridCare Pro - Diagnóstico Profesional para Vehículos Híbridos

![Version](https://img.shields.io/badge/version-2.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-PWA-orange)

## 📱 Descripción

HybridCare Pro es una aplicación profesional de diagnóstico para vehículos híbridos que se conecta vía Bluetooth al adaptador OBD2 ELM327. Ofrece análisis en tiempo real, detección de fallos, comandos de voz, seguimiento GPS y mucho más.

### ✨ Características principales

- 🔌 **Conexión OBD2** - Conecta con adaptadores ELM327 vía Bluetooth
- 📊 **Datos en tiempo real** - RPM, velocidad, temperaturas, voltajes
- ⚠️ **Diagnóstico de fallos** - Base de datos con 50+ códigos DTC
- 🔮 **Análisis predictivo** - Detección temprana de problemas
- 🎤 **Comandos de voz** - Control manos libres
- 🗺️ **Seguimiento GPS** - Registro de rutas y cálculo de ahorro
- 📈 **Gráficos interactivos** - Visualización de tendencias
- 💾 **Almacenamiento local** - Funciona sin internet
- 🌙 **Tema oscuro/claro** - Personalización visual
- 📤 **Exportación de datos** - Backup en formato JSON

## 🚀 Instalación rápida

### Opción 1: Instalación directa (recomendada)

1. Descarga todos los archivos en tu dispositivo
2. Abre `index.html` en Chrome
3. Toca los 3 puntos → "Instalar aplicación"
4. Confirma la instalación

### Opción 2: Servidor local

```bash
# Python 3
python -m http.server 8080

# Node.js
npx http-server -p 8080