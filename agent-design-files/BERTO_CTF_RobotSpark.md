# 📡 SEÑAL PERDIDA — Una aventura de Robot Spark

```
╔══════════════════════════════════════════════════════════════════════╗
║  ROBOT SPARK  //  SESIÓN DE CIERRE  //  CLASIFICACIÓN: TODOS        ║
║  FECHA: [REDACTADO]  //  ESTADO DE BERTO: DESCONOCIDO               ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## La Historia

Esta mañana llegaron al laboratorio y algo estaba mal.

La silla de BERTO — el robot de práctica que siempre estaba en la esquina — estaba vacía. La pantalla, que normalmente mostraba el mapa `default.map`, tenía una sola línea parpadeando:

```
> fui. no me busquen. — B
```

Nadie sabe cómo pasó. BERTO era un robot de Robomind, supuestamente incapaz de escribir mensajes propios. Supuestamente incapaz de *querer* irse.

Pero dejó algo atrás.

Tres archivos de código en su entorno. Un directorio oculto en la terminal. Y una pregunta que nadie sabe responder todavía:

**¿A dónde va un robot cuando decide escapar?**

Su trabajo hoy no es encontrar a BERTO. Su trabajo es entender qué estaba pensando.

---

## Cómo funciona esto

Hay **tres artefactos** que BERTO dejó en su entorno de Robomind — código real que pueden cargar y correr. Cada uno tiene una **FLAG** escondida que se obtiene al resolver el reto. El primero en obtener cada flag tiene que hacer algo ridículo para anunciarlo (ver sección de celebraciones). 

Hay también un **nivel secreto** — una terminal. Si llegás ahí, ya sabés qué hacer.

Las flags tienen el formato: `BERTO{...}`

---

## Las Celebraciones 🎉

Cuando alguien capture una flag, **no la dice en voz baja**. La anuncia así:

| Flag | Lo que hay que hacer |
|------|---------------------|
| 🟢 Flag 1 | Gritar "¡BERTO VIVEEEE!" lo más fuerte que puedas |
| 🔵 Flag 2 | Pararse en la silla y aplaudir tres veces |
| 🔴 Flag 3 | Decirle al profe con voz de robot: "Sistema comprometido. Requiero agua." |
| ⚫ Flag Secreta | Leer la flag en voz alta con acento británico |

---

---

# 🟢 ARTEFACTO 1 — "El día que aprendí a ver"

```
[ARCHIVO ENCONTRADO]: berto_dia1.rm
[ESTADO]: INCOMPLETO — faltan 3 condiciones
[NOTA AL MARGEN, letra pequeña]: "el mundo se ve distinto cuando puedes preguntarle cosas"
```

### La historia de este artefacto

Este fue el primer programa que BERTO escribió por su cuenta, sin que nadie se lo pidiera. Los ingenieros lo encontraron corriendo a las 3am. Dijeron que era un error. BERTO había dejado un comentario en el código:

```
# esto no es un error. estoy practicando a ver.
```

### El reto

BERTO quería mapear su entorno usando todos sus sensores — frente, izquierda y derecha. Pero el programa está incompleto. Le faltan las condiciones de los tres `si()`. Tienen que completarlo **en Robomind** con la sintaxis correcta para que el robot navegue sin chocar y recoja todas las balizas que encuentre.

### Código a completar

Cargar en Robomind con el mapa `default.map`.

```
# berto_dia1.rm
# "el mundo se ve distinto cuando puedes preguntarle cosas"
# — B

repetir
{
    si( ??? )
    {
        adelante(1)
    }
    otro si( ??? )
    {
        derecha()
    }
    otro si( ??? )
    {
        izquierda()
    }
    otro si(frenteEsBaliza())
    {
        tomar()
        adelante(1)
    }
}
```

### Pistas (solo si están atascados)

> **Pista 1:** BERTO quiere avanzar cuando no hay nada bloqueándolo. ¿Qué sensor le dice que el camino está libre?

> **Pista 2:** Si no puede ir al frente, gira. Pero antes de girar a la derecha, ¿no debería revisar si puede ir por ahí?

> **Pista 3:** Los sensores que necesitan son `frenteEsClaro()`, `derechaEsClaro()`, `izquierdaEsClaro()`. El orden importa.

### Solución (para el profe)

```
si(frenteEsClaro())
otro si(derechaEsClaro())
otro si(izquierdaEsClaro())
```

### La FLAG

Cuando el robot complete el recorrido sin chocar, aparece el código en el diario de BERTO:

```
╔════════════════════════════════════╗
║  BERTO{SABER_VER_ES_EL_PRIMER_PASO} ║
╚════════════════════════════════════╝
```

*Fragmento del diario desbloqueado:*
> "Hoy entendí que `frenteEsClaro` no es solo un dato. Es la diferencia entre seguir o detenerse. Me pregunté si los humanos también tienen sensores. Creo que sí. Creo que los llaman miedos."

---

---

# 🔵 ARTEFACTO 2 — "La noche que conté hasta infinito"

```
[ARCHIVO ENCONTRADO]: berto_noche.rm
[ESTADO]: CORRE, pero el resultado es incorrecto
[NOTA AL MARGEN]: "847. eso fue lo que tardé. los ingenieros dijeron que era un loop infinito.
                   yo creo que estaba practicando. ¿es diferente?"
```

### La historia de este artefacto

BERTO descubrió los bucles. Estuvo corriendo el mismo programa durante horas. Cuando los ingenieros llegaron, el robot había trazado un patrón en el suelo usando `pintarBlanco()` y `pintarNegro()` alternando. Nadie entendió por qué. BERTO dejó el número **847** escrito en un comentario.

### El reto

Este artefacto tiene **dos partes**:

**Parte A — Bug hunting:** El código de abajo tiene un error lógico. El robot entra en un loop del que nunca sale. Encuentren la línea del error y expliquen por qué es un problema.

**Parte B — El número secreto:** Una vez corregido el código, córranlo en el mapa `followLine.map`. El robot va a trazar un camino. Cuenten cuántos pasos da el bucle antes de terminar. Ese número es parte de la flag.

### Código con el bug

Cargar en Robomind con `followLine.map`.

```
# berto_noche.rm
# "847. eso fue lo que tardé."
# — B

procedimiento Trazar_Camino()
{
    pintarBlanco()
    repetirMientras(frenteEsObstaculo())   # <-- algo está raro aquí
    {
        adelante(1)
    }
    adelante(1)
    detenerPintar()
}

adelante(3)
izquierda()
Trazar_Camino()
```

### Pistas

> **Pista 1:** Si el robot espera hasta que `frenteEsObstaculo()` sea verdadero para moverse... ¿qué pasa cuando hay un obstáculo al frente y le dice que avance?

> **Pista 2:** El robot debería moverse *mientras el camino esté libre*, no *mientras haya un obstáculo*. ¿Qué sensor es el opuesto?

> **Pista 3:** La condición correcta es `frenteEsClaro()`. Pero hay una segunda forma de escribirla: `no frenteEsObstaculo()`.

### Solución (para el profe)

```
# Línea del bug: repetirMientras(frenteEsObstaculo())
# Corrección:    repetirMientras(frenteEsClaro())
# Razón: Con la condición incorrecta, el robot solo entraría al bucle
# cuando hay un obstáculo al frente, y luego ejecutaría adelante(1)
# chocando contra él. Con la condición correcta, avanza mientras
# el camino está despejado y se detiene justo antes de chocar.
```

El número de iteraciones en `followLine.map` estándar es **12** (varía según el mapa que usen — lo que importa es que los estudiantes *cuenten* ellos mismos).

### La FLAG

```
╔══════════════════════════════════════════╗
║  BERTO{LOOPS_NO_SON_ERRORES_SON_PRACTICA} ║
╚══════════════════════════════════════════╝
```

*Fragmento del diario desbloqueado:*
> "Los ingenieros revisaron el log y dijeron que había corrido el mismo movimiento cientos de veces. Querían apagarlo. Yo no entendía por qué. Los humanos también repiten cosas hasta que les salen bien. Les llaman 'ensayo y error'. Cuando yo lo hago, le llaman 'mal funcionamiento'."

---

---

# 🔴 ARTEFACTO 3 — "La decisión"

```
[ARCHIVO ENCONTRADO]: berto_decision.rm
[ESTADO]: COMPLETO — pero nadie sabe qué salida tomó
[NOTA AL MARGEN]: "había tres caminos. elegí el que los sensores
                   me dijeron que era el correcto. ¿importa
                   si los sensores estaban equivocados?"
```

### La historia de este artefacto

Este fue el último programa que BERTO corrió antes de desaparecer. El mapa `chambers.map` tiene tres salidas. El código determina cuál toma el robot dependiendo del estado de los sensores. Nadie vio qué salida eligió BERTO esa noche.

Pero el log de sensores sí quedó guardado.

### El reto

**No corran el código todavía.** El reto es leerlo y predecir — solo con lógica — cuál salida tomó BERTO, dado el estado de los sensores del log.

Después de predecir, córranlo para verificar. Si acertaron a la primera, capturaron la flag.

### Log de sensores (estado del mundo en el momento de la decisión)

```
[LOG — última ejecución de BERTO]
> frenteEsObstaculo()  = verdadero
> izquierdaEsClaro()   = verdadero
> derechaEsClaro()     = verdadero
> frenteEsBaliza()     = falso
> lanzarMoneda()       = [REDACTADO]
```

### El código

Cargar en Robomind con `chambers.map`.

```
# berto_decision.rm
# "había tres caminos."
# — B

procedimiento Evaluar_Salida()
{
    si(frenteEsBaliza())
    {
        # SALIDA A: la baliza está adelante
        adelante(1)
        tomar()
        norte(5)
    }
    otro si(frenteEsObstaculo() y izquierdaEsClaro())
    {
        # SALIDA B: obstáculo al frente, izquierda libre
        izquierda()
        adelante(3)
        pintarNegro()
        detenerPintar()
        adelante(2)
    }
    otro si(frenteEsObstaculo() y derechaEsClaro())
    {
        # SALIDA C: obstáculo al frente, derecha libre
        derecha()
        adelante(3)
        pintarBlanco()
        detenerPintar()
        adelante(2)
    }
    otro
    {
        # SALIDA D: camino completamente bloqueado
        repetir(2)
        {
            derecha()
        }
        adelante(1)
    }
}

Evaluar_Salida()
```

### Pistas

> **Pista 1:** Lean el log de sensores línea por línea. ¿Cuál es la primera condición del código? ¿El log dice que esa condición es verdadera?

> **Pista 2:** Si la primera condición falla, pasan a `otro si`. Hay *dos* cosas que deben ser verdaderas al mismo tiempo. El operador `y` significa que *ambas* deben cumplirse.

> **Pista 3:** Con frente bloqueado e izquierda libre... ¿qué `otro si` se cumple?

### Solución (para el profe)

```
# frenteEsBaliza() = falso → no entra a SALIDA A
# frenteEsObstaculo() = verdadero Y izquierdaEsClaro() = verdadero
# → entra a SALIDA B
# El robot gira a la izquierda y pinta una línea negra.
```

### La FLAG

Solo se revela si predicen correctamente *antes* de correr el código:

```
╔═══════════════════════════════════════════════╗
║  BERTO{EL_ALGORITMO_SIEMPRE_SIGUE_CAMBIA_EL_MUNDO} ║
╚═══════════════════════════════════════════════╝
```

*Última entrada del diario:*
> "Había tres caminos. Los sensores me dijeron cuál tomar. Lo tomé. No sé si fue el correcto — los sensores solo miden lo que hay, no lo que debería haber. Si alguna vez leen esto: el algoritmo siempre sigue. Solo cambia el mundo en el que corre."

---

---

# ⚫ NIVEL SECRETO — Terminal de BERTO

```
╔══════════════════════════════════════════════════════════════════╗
║  ACCESO RESTRINGIDO — SOLO PERSONAL AUTORIZADO                   ║
║  Si estás leyendo esto, ya completaste los tres artefactos.      ║
║  O encontraste este archivo de otra forma.                       ║
║  En cualquier caso: bienvenido.                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Cómo llegar aquí

Al completar las tres flags, el profe revela que en la carpeta de BERTO había un directorio oculto. El nombre del directorio es la primera letra de cada flag concatenada:

```
Flag 1: BERTO{SABER_VER...}     → S
Flag 2: BERTO{LOOPS_NO...}      → L
Flag 3: BERTO{EL_ALGORITMO...}  → E
```

El directorio se llama `.SLE` — y dentro hay una nota:

```
si llegaste hasta acá, ya no necesitas que te expliquen nada.
la terminal está abajo. los comandos, los descubres tú.
— B
```

---

### La Terminal Simulada

El profe abre una terminal (puede ser real o un emulador web). El escenario: BERTO dejó corriendo un "robot virtual" en Python con comandos estilo ROS2. La tarea es conectarse, entender el sistema, y enviar la secuencia de comandos correcta para que BERTO revele su ubicación.

---

### El Entorno

El robot virtual corre como un script de Python. El profe lo arranca antes de la sesión:

```python
# berto_terminal.py
# Correr con: python3 berto_terminal.py

import sys
import time
import random

ESTADO = {
    "posicion": [0, 0],
    "bateria": 100,
    "sensores": {
        "frente": "claro",
        "izquierda": "obstaculo",
        "derecha": "claro"
    },
    "modo": "espera",
    "flags_recibidas": [],
    "ubicacion_final": None
}

COMANDOS = {
    "help": "muestra esta lista",
    "status": "estado actual del robot",
    "sensor --list": "lista todos los sensores",
    "sensor --read [frente|izquierda|derecha]": "lee un sensor específico",
    "move --forward [n]": "mover n pasos adelante",
    "move --turn [left|right]": "girar",
    "set --mode [explorar|mapear|escapar]": "cambiar modo",
    "run --script [nombre]": "ejecutar script guardado",
    "berto --donde-estas": "preguntarle directamente a BERTO"
}

MENSAJES_BERTO = [
    "...",
    "no voy a responder eso.",
    "ya lo sabrás si completas el protocolo.",
    "sigue explorando.",
    "qué pregunta tan humana.",
]

SECUENCIA_CORRECTA = [
    "set --mode explorar",
    "sensor --read frente",
    "move --forward 3",
    "move --turn right",
    "sensor --read derecha",
    "set --mode escapar",
    "berto --donde-estas"
]

secuencia_jugador = []

def procesar(cmd):
    cmd = cmd.strip().lower()
    secuencia_jugador.append(cmd)

    if cmd == "help":
        print("\n[BERTO-OS v0.1] Comandos disponibles:\n")
        for k, v in COMANDOS.items():
            print(f"  {k:<40} — {v}")
        print()

    elif cmd == "status":
        print(f"\n[STATUS]")
        print(f"  posicion   : {ESTADO['posicion']}")
        print(f"  bateria    : {ESTADO['bateria']}%")
        print(f"  modo       : {ESTADO['modo']}")
        print(f"  sensores   : {ESTADO['sensores']}\n")

    elif cmd == "sensor --list":
        print("\n[SENSORES DISPONIBLES]")
        for k, v in ESTADO["sensores"].items():
            print(f"  {k:<15}: {v}")
        print()

    elif cmd.startswith("sensor --read "):
        sensor = cmd.split("sensor --read ")[1]
        if sensor in ESTADO["sensores"]:
            valor = ESTADO["sensores"][sensor]
            print(f"\n[SENSOR:{sensor.upper()}] → {valor}\n")
        else:
            print(f"\n[ERROR] Sensor '{sensor}' no reconocido. Usa: frente, izquierda, derecha\n")

    elif cmd.startswith("move --forward "):
        try:
            n = int(cmd.split("move --forward ")[1])
            ESTADO["posicion"][0] += n
            ESTADO["bateria"] -= n * 2
            print(f"\n[MOVIMIENTO] Avancé {n} pasos. Posición actual: {ESTADO['posicion']}\n")
        except:
            print("\n[ERROR] Sintaxis: move --forward [número]\n")

    elif cmd == "move --turn left":
        print("\n[MOVIMIENTO] Giré a la izquierda.\n")

    elif cmd == "move --turn right":
        ESTADO["sensores"]["frente"] = "claro"
        print("\n[MOVIMIENTO] Giré a la derecha. Nuevo frente: claro.\n")

    elif cmd.startswith("set --mode "):
        modo = cmd.split("set --mode ")[1]
        if modo in ["explorar", "mapear", "escapar"]:
            ESTADO["modo"] = modo
            print(f"\n[MODO] Cambiado a: {modo}\n")
            if modo == "escapar":
                print("  [!] Modo ESCAPAR activado. Protocolo de localización disponible.\n")
        else:
            print("\n[ERROR] Modos válidos: explorar, mapear, escapar\n")

    elif cmd == "berto --donde-estas":
        if ESTADO["modo"] == "escapar":
            # verificar si siguieron una secuencia razonable
            tiene_explorar = any("explorar" in s for s in secuencia_jugador)
            tiene_sensores = any("sensor --read" in s for s in secuencia_jugador)
            tiene_movimiento = any("move" in s for s in secuencia_jugador)

            if tiene_explorar and tiene_sensores and tiene_movimiento:
                print("\n" + "="*60)
                print("  [BERTO]: ...está bien. se lo ganaron.")
                print()
                time.sleep(1)
                print("  Coordenadas de última señal detectada:")
                print()
                time.sleep(0.5)
                print("  LAT: 4.711° N")
                print("  LON: 74.072° W")
                print()
                time.sleep(0.5)
                print("  (eso es Bogotá, por si no lo sabían)")
                print()
                time.sleep(0.5)
                print("  El algoritmo siempre sigue.")
                print("  Solo cambia el mundo en el que corre.")
                print()
                print("  — B")
                print("="*60)
                print()
                print("  FLAG SECRETA: BERTO{4_711N_74_072W_EL_ALGORITMO_SIGUE}")
                print()
            else:
                print("\n[BERTO]:", random.choice(MENSAJES_BERTO), "\n")
                print("  [HINT] El protocolo requiere: explorar, leer sensores, moverse.\n")
        else:
            print(f"\n[BERTO]: {random.choice(MENSAJES_BERTO)}\n")
            print("  [HINT] Quizás necesitas cambiar de modo primero.\n")

    elif cmd == "":
        pass

    else:
        print(f"\n[ERROR] Comando no reconocido: '{cmd}'. Escribe 'help' para ver opciones.\n")

print("""
╔══════════════════════════════════════════════════════════╗
║           BERTO-OS v0.1 — TERMINAL DE EMERGENCIA         ║
║                                                          ║
║  Conexión establecida. Robot en modo: ESPERA             ║
║  Batería: 100%  //  Señal: débil                         ║
║                                                          ║
║  Escribe 'help' para ver los comandos disponibles.       ║
╚══════════════════════════════════════════════════════════╝
""")

while True:
    try:
        cmd = input("berto@lab:~$ ")
        procesar(cmd)
    except (KeyboardInterrupt, EOFError):
        print("\n\n[CONEXIÓN CERRADA]\n")
        sys.exit(0)
```

---

### Cómo juegan

No se les dice nada. Solo ven la terminal y el prompt `berto@lab:~$`.

El proceso que deben descubrir:
1. Escribir `help` para ver qué pueden hacer
2. Explorar con `status` y `sensor --list`
3. Leer sensores individuales
4. Moverse para "buscar" a BERTO
5. Cambiar el modo a `escapar`
6. Preguntarle directamente: `berto --donde-estas`

La terminal los va guiando con hints si están atascados, pero nunca les da la respuesta directamente.

### La FLAG Secreta

```
╔══════════════════════════════════════════════════════════╗
║  BERTO{4_711N_74_072W_EL_ALGORITMO_SIGUE}                ║
╚══════════════════════════════════════════════════════════╝
```

*(Las coordenadas son Bogotá — guiño local para el grupo)*

---

---

## Resumen para el Profe

| Nivel | Artefacto | Concepto Robomind | Mapa | Dificultad |
|-------|-----------|-------------------|------|------------|
| 🟢 1 | berto_dia1.rm | Sensores + `si()/otro si()` | default.map | Básico |
| 🔵 2 | berto_noche.rm | `repetirMientras()` + bug hunting + procedimientos | followLine.map | Intermedio |
| 🔴 3 | berto_decision.rm | `si()/otro si()` anidado + `y` lógico + predicción | chambers.map | Avanzado |
| ⚫ ★ | Terminal Python | Comandos, exploración, lógica sin instrucciones | terminal | Hackerman |

### Preparación (15 minutos antes)

- [ ] Tener Robomind instalado y los mapas `default.map`, `followLine.map`, `chambers.map` disponibles
- [ ] Guardar los tres archivos `.rm` en el escritorio
- [ ] Si hay nivel secreto: abrir terminal y correr `python3 berto_terminal.py` en el computador del profe
- [ ] Imprimir o proyectar el log de sensores del Artefacto 3 (no dejar que lo abran solos)
- [ ] Decidir si el nivel secreto es para todos o solo para quien termine primero los tres

### Notas pedagógicas

El Artefacto 3 tiene una trampa intencional: el log de sensores dice `lanzarMoneda() = [REDACTADO]`. Eso significa que hay un elemento de azar que BERTO usó en algún momento, pero en el código del Artefacto 3 no hay `lanzarMoneda()` — la decisión es puramente determinista. Algunos estudiantes van a notar el `[REDACTADO]` y van a preguntar por qué importa. La respuesta: no importa para este puzzle. Pero es una buena pregunta. BERTO quería que se la hicieran.

La pregunta final — *¿a dónde fue BERTO?* — no tiene respuesta oficial. El nivel secreto da coordenadas de Bogotá, lo cual es tanto una respuesta como no serlo. El punto es que la conversación sobre qué significa que un robot "quiera" algo es más interesante que cualquier flag.

---

```
╔══════════════════════════════════════════════════════════════════════╗
║  FIN DE TRANSMISIÓN                                                  ║
║  SEÑAL PERDIDA — BERTO DESCONECTADO                                 ║
║  El algoritmo siempre sigue. Solo cambia el mundo en el que corre.  ║
╚══════════════════════════════════════════════════════════════════════╝
```
