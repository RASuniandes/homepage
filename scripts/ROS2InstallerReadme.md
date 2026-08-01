# Instalador de ROS 2 — RAS Uniandes

Script único para dejar un equipo con **ROS 2** listo para trabajar: repositorio apt oficial, paquetes binarios, `colcon`, `rosdep`, workspace y entorno de shell configurado.

Detecta la versión de Ubuntu y elige la distro de ROS 2 correspondiente. Es **idempotente**: puedes correrlo varias veces sin romper nada.

> *siempre compartimos lo que sabemos*

---

## Instalación rápida

```bash
curl -fsSL https://<RAS-URL>/ros2-install.sh | bash
```

Eso instala la variante `desktop` de la distro que corresponda a tu Ubuntu, crea `~/ros2_ws` y engancha el entorno a tu `.bashrc`.

### Forma recomendada

Descarga, revisa y luego ejecuta. Nunca canalices a `bash` un script que no has leído — ni este:

```bash
curl -fsSL https://<RAS-URL>/ros2-install.sh -o ros2-install.sh
less ros2-install.sh          # revísalo
bash ros2-install.sh --help   # mira las opciones
bash ros2-install.sh
```

### Pasar opciones con cURL

Cuando canalizas a `bash`, las opciones van después de `-s --`:

```bash
curl -fsSL https://<RAS-URL>/ros2-install.sh | bash -s -- --variant desktop-full --with gazebo
```

---

## Compatibilidad

| Distro ROS 2 | Ubuntu | Fin de soporte |
|---|---|---|
| `humble` (Hawksbill) | 22.04 `jammy` | 2027-05 (LTS) |
| `jazzy` (Jalisco) | 24.04 `noble` | 2029-05 (LTS) |
| `kilted` (Kaiju) | 24.04 `noble` | 2026-12 (no-LTS) |
| `lyrical` (Luth) | 26.04 `resolute` | 2031-05 (LTS) |
| `rolling` | 26.04 `resolute` | rama de desarrollo |

Consulta la tabla en cualquier momento con `bash ros2-install.sh --list`.

**Arquitecturas:** `amd64` y `arm64` (incluye Raspberry Pi 4/5 con Ubuntu de 64 bits).

Si tu combinación Ubuntu/distro no coincide, el script se detiene. Puedes forzarla con `--force`, bajo tu propio riesgo: los paquetes probablemente no existan en el repositorio.

---

## Opciones

| Opción | Qué hace |
|---|---|
| `-d, --distro <nombre>` | `humble`, `jazzy`, `kilted`, `lyrical`, `rolling` o `auto` (por defecto) |
| `-v, --variant <nombre>` | `ros-base`, `desktop` (def.), `desktop-full`, `perception`, `simulation` |
| `-w, --workspace <ruta>` | Workspace colcon a crear (def. `~/ros2_ws`) |
| `--no-workspace` | No crea workspace |
| `-i, --domain-id <0-101>` | Valor de `ROS_DOMAIN_ID` (def. `0`) |
| `--localhost-only` | Restringe el descubrimiento DDS a la máquina local |
| `--with <a,b,c>` | Extras: `vscode`, `gazebo`, `terminator`, `tools`, `micro-ros` |
| `--shell <bash\|zsh\|both\|auto>` | Qué shell configurar (def. `auto`) |
| `--theme` | Tema oscuro + fondo de pantalla RAS (requiere escritorio) |
| `--upgrade` | Corre `apt upgrade` completo antes de instalar |
| `-y, --yes` | No pregunta nada |
| `--dry-run` | Muestra todo lo que haría, sin tocar el sistema |
| `--force` | Continúa aunque la plataforma no sea compatible |
| `--check` | Solo diagnostica una instalación existente |
| `--uninstall` | Desinstala ROS 2 y la configuración del script |
| `--list` | Lista las distros soportadas |
| `-h, --help` / `--version` | Ayuda / versión |

También puedes fijar valores por variable de entorno: `RAS_ROS_DISTRO`, `RAS_ROS_VARIANT`, `RAS_ROS_WS`, `RAS_ROS_DOMAIN_ID`.

### ¿Qué variante escojo?

| Variante | Contenido | Cuándo |
|---|---|---|
| `ros-base` | Sin GUI: comunicación, `ros2 cli`, TF | Robots, contenedores, servidores, SBC sin monitor |
| `desktop` | `ros-base` + RViz2, rqt, demos | **Uso general**, laptops de miembros |
| `desktop-full` | `desktop` + percepción y simulación | Estaciones de simulación |
| `perception` | Base + visión y point clouds | Nodos de percepción sin GUI |
| `simulation` | Base + herramientas de simulación | Nodos de simulación sin GUI |

---

## Recetas

**Laptop de un miembro nuevo (lo normal):**
```bash
curl -fsSL https://<RAS-URL>/ros2-install.sh | bash
```

**Taller o sala de cómputo** — cada asistente aislado, sin cruzar tópicos entre equipos:
```bash
curl -fsSL https://<RAS-URL>/ros2-install.sh | bash -s -- --localhost-only -y
```

**Raspberry Pi 5 o computador a bordo del robot** — sin GUI, más liviano:
```bash
bash ros2-install.sh --variant ros-base --with tools --domain-id 7
```

**Estación de simulación:**
```bash
bash ros2-install.sh --variant desktop-full --with gazebo,vscode
```

**Trabajo con micro-ROS (ORCA-Board, ESP32):**
```bash
bash ros2-install.sh --with micro-ros
cd ~/ros2_ws && rosdep install --from-paths src --ignore-src -r -y && colcon build
```

**Ver qué haría, sin ejecutar nada:**
```bash
bash ros2-install.sh --dry-run --variant desktop-full --with gazebo
```

---

## Qué le hace a tu sistema

Transparencia total — el script:

1. Instala utilidades base (`curl`, `git`, `build-essential`, `python3-pip`, …) y habilita el repositorio `universe`.
2. Genera un locale UTF-8 **solo si el actual no lo es**.
3. Añade el repositorio apt oficial de ROS 2 vía el paquete `ros2-apt-source`; si no existe para tu versión de Ubuntu, configura la llave y la fuente manualmente.
4. Instala `ros-<distro>-<variante>`, `ros-dev-tools`, `colcon`, `rosdep`, `vcstool`.
5. Inicializa `rosdep` (si hace falta) y corre `rosdep update`.
6. Crea el workspace con su carpeta `src/`.
7. Escribe **`~/.ras/ros2-env.sh`** con el entorno y los atajos, y añade un bloque delimitado a tu `.bashrc` (y `.zshrc` si existe) que solo lo carga.
8. Deja un log completo en `~/ras-ros2-install.log`.

**Lo que NO hace:** no corre `apt upgrade` (salvo `--upgrade`), no toca configuración fuera de los bloques marcados, no requiere ni guarda credenciales, no instala nada gráfico salvo que lo pidas con `--theme` o `--with vscode`.

Todo lo que agrega a tus archivos de shell queda entre marcas:

```bash
# >>> RAS ROS 2 >>>
[ -f "$HOME/.ras/ros2-env.sh" ] && . "$HOME/.ras/ros2-env.sh"
# <<< RAS ROS 2 <<<
```

---

## Después de instalar

Abre una **terminal nueva** (o `source ~/.ras/ros2-env.sh`) y comprueba:

```bash
ros2 run demo_nodes_cpp talker
# en otra terminal:
ros2 run demo_nodes_py listener
```

Si ves los mensajes pasar, quedó bien.

### Atajos que quedan disponibles

| Atajo | Equivale a |
|---|---|
| `cdws` | `cd $RAS_ROS_WS` |
| `cb` | `colcon build --symlink-install` |
| `cbp <pkg>` | `colcon build --symlink-install --packages-select <pkg>` |
| `ct` | `colcon test` + `colcon test-result --verbose` |
| `rosdeps` | `rosdep install` sobre el `src/` del workspace |
| `rossrc` / `wssrc` | Cargar ROS 2 / el overlay del workspace |
| `rosinfo` | Muestra `ROS_DISTRO` y `ROS_DOMAIN_ID` |

### Flujo de trabajo típico

```bash
cdws
git clone <repo-del-proyecto> src/mi_paquete
rosdeps          # resuelve dependencias declaradas en package.xml
cb               # compila
wssrc            # carga el overlay recién compilado
ros2 launch mi_paquete demo.launch.py
```

`~/.ras/ros2-env.sh` carga el overlay del workspace automáticamente en cada terminal nueva, siempre que ya lo hayas compilado al menos una vez.

---

## Diagnóstico

Antes que nada:

```bash
bash ros2-install.sh --check
```

| Síntoma | Causa probable / solución |
|---|---|
| `ros2: command not found` | La terminal es anterior a la instalación. Ábrela de nuevo o `source ~/.ras/ros2-env.sh`. |
| Ves los tópicos de otra persona | Comparten `ROS_DOMAIN_ID` en la misma red. Reinstala con `-i <número distinto>` o `--localhost-only`. |
| No ves los nodos de tu compañero | Al revés: distinto `ROS_DOMAIN_ID`, o alguno tiene `--localhost-only`. Verifica con `rosinfo` en ambos equipos. |
| Nodos que no se ven entre máquinas en Wi-Fi | Muchas redes universitarias bloquean multicast. Prueba con cable, o configura un discovery server. |
| `rosdep update` falla | Suele ser red/GitHub. Reintenta después: `rosdep update`. No es fatal para la instalación. |
| Errores de firma GPG en `apt update` | El repositorio quedó a medias. Corre el script otra vez; reinstala `ros2-apt-source`. |
| `E: Unable to locate package ros-...` | Ubuntu y distro de ROS no coinciden. `--list` para ver las combinaciones válidas. |
| El script se detiene en mitad de `apt` | Revisa `~/ras-ros2-install.log`: la causa real está ahí. |
| `colcon build` se queda sin memoria en Raspberry Pi | Limita los procesos: `colcon build --parallel-workers 1 --executor sequential`. |

### Desinstalar

```bash
bash ros2-install.sh --uninstall
```

Elimina los paquetes `ros-<distro>-*`, el archivo de entorno y los bloques del shell. **No borra tu workspace** — eso lo haces tú si quieres.

---

## Para el equipo que mantiene el script

- El script vive en un **gist propiedad de la cuenta de RAS**, no de una cuenta personal, para que no dependa de que su autor siga en el capítulo.
- La URL raw de un gist incluye el hash del commit. Para un enlace estable, publícalo sin el hash (`.../raw/ros2-install.sh`) o, mejor, sirve un redirect corto desde el sitio de RAS hacia el raw actual: así se puede actualizar el script sin cambiar la documentación ni los talleres.
- Al salir una nueva distro de ROS 2 basta con agregar una línea en `supported_codename()`, `distro_eol()` y `codename_to_distro()`.
- Antes de publicar un cambio: `bash -n ros2-install.sh`, luego `bash ros2-install.sh --dry-run` y una prueba real en una VM limpia.
- Sube `VERSION` en cada cambio publicado, para que los logs de los usuarios digan qué versión corrieron.

---

MIT · IEEE RAS Uniandes
