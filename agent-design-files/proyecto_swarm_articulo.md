# Proyecto S.W.A.R.M.
### Robótica logística autónoma, construida desde cero en Latinoamérica.

**IEEE Robotics & Automation Society — Capítulo Estudiantil, Universidad de los Andes**
[rasuniandes.org](https://rasuniandes.org) · RAS@uniandes.edu.co

---

## ¿Qué es SWARM?

**SWARM** (*Synchronized Warehouse Autonomous Robotics Management*) es un proyecto de investigación y desarrollo del capítulo estudiantil IEEE RAS de la Universidad de los Andes, orientado a construir una plataforma robótica autónoma con aplicabilidad industrial real.

El proyecto integra mecánica estructural, electrónica embebida y algoritmos de navegación avanzados para desarrollar robots capaces de operar de forma autónoma en entornos logísticos. Su arquitectura aborda los tres grandes retos de la robótica de almacén: navegación individual, mapeo del entorno y cooperación entre múltiples unidades.

Desde su primera iteración, SWARM ha evolucionado de forma iterativa y metodológica. Hoy, con el MK2 en manufactura y pruebas de navegación SLAM en curso sobre el MK1.5, el proyecto avanza con solidez hacia autonomía plena y colaboración multi-robot.

---

## Introducción

La integración de la robótica en la cadena logística moderna ya no es una tendencia emergente: es una ventaja competitiva consolidada. Empresas como Amazon, Ocado, Walmart y Alibaba han demostrado que los sistemas robóticos autónomos redefinen los estándares de eficiencia en centros de cumplimiento y distribución. En estos entornos, el paradigma ha cambiado: no son los operarios quienes se desplazan hacia el producto, sino la infraestructura robótica quien lo acerca a ellos.

En Latinoamérica, la investigación aplicada en este campo sigue siendo escasa. SWARM nace como respuesta a esa brecha: un esfuerzo académico riguroso, con orientación industrial real, que busca construir desde cero una plataforma robótica autónoma, replicable y documentada públicamente. Su objetivo último es sentar bases sólidas para la investigación en robótica avanzada en la región.

---

## Metodología — Tres fases

El proyecto se estructura en tres fases progresivas, donde cada etapa consolida las capacidades de la anterior.

### Fase I — Plataforma robótica base

Desarrollo de la arquitectura mecánica, electrónica y de software que sustenta todo el sistema. Esta fase priorizó construir una plataforma funcional y confiable para validar decisiones de diseño antes de avanzar hacia versiones más complejas.

### Fase II — Autonomía individual

Implementación de algoritmos SLAM (*Simultaneous Localization and Mapping*) y navegación visual con seguimiento de trayectorias, evasión de obstáculos e identificación de marcadores ArUco. El objetivo es que un único robot ejecute tareas autónomas del tipo *"trasládate de A a B con el objeto O"*, validadas en entornos universitarios e industriales piloto.

### Fase III — Colaboración multi-robot

Despliegue de múltiples unidades idénticas con control independiente, evasión conjunta de obstáculos, visualización remota de agentes y algoritmos de asignación de objetivos optimizados en tiempo real según las posiciones de cada unidad.

---

## Estado del proyecto

### MK1 — Primera iteración *(completada)*

El MK1 fue la prueba de concepto integral del proyecto. Su desarrollo permitió validar la arquitectura electrónica, el esquema de control y los principios de navegación básica, e identificar las limitaciones de diseño a corregir en versiones posteriores.

Esta versión demostró capacidad de recolección de datos ambientales mediante LiDAR, control remoto de movimiento y prevención de colisiones basada en distancia. Por decisión de diseño, el MK1 prescindió de sistema de carga útil y empleó materiales ligeros y de bajo costo, priorizando la velocidad de iteración sobre la robustez estructural.

---

### MK1.5 — Plataforma iterativa activa

El MK1.5 surgió como un ciclo adicional de validación entre el MK1 y el MK2, y su rol resultó más estratégico de lo inicialmente previsto. Esta plataforma fue el banco de pruebas donde se tomaron decisiones de diseño fundamentales para el MK2, entre ellas la migración del sistema de locomoción de omnidireccional a diferencial — cambio que mejora significativamente la confiabilidad mecánica y el control preciso bajo condiciones de carga.

Más allá de la forma y estructura, el MK1.5 ha funcionado como el portador iterativo del sistema nervioso del proyecto: cada subsistema de potencia, control y autonomía fue refinado y robustecido sobre esta plataforma antes de ser incorporado definitivamente al MK2. En la fase actual, el MK1.5 permanece activo como banco de pruebas para los algoritmos de navegación SLAM y simulaciones de autonomía, en paralelo con la construcción física del MK2.

---

### MK2 — En manufactura *(2026)*

El MK2 representa el salto cualitativo de SWARM hacia una plataforma con orientación industrial real. Su diseño completo — mecánico y electrónico — fue desarrollado entre enero y mayo de 2026. La manufactura inició en junio de 2026.

Las mejoras frente a versiones anteriores son sustanciales:

- **Capacidad de carga real**: diseñado para elevar hasta 60 kg y soportar cargas estáticas de aproximadamente 100 kg, habilitando tareas efectivas de manejo de materiales.
- **Mecanismo elevador tipo tijera**: integrado en un chasis estructural reforzado, concebido para operación sostenida bajo carga.
- **Electrónica rediseñada desde cero**: nuevas PCBs compactas que incorporan todas las lecciones aprendidas del MK1 y MK1.5 — estandarización de conectores, rutas de potencia optimizadas y validación experimental de capacidades eléctricas reales del sistema.
- **Arquitectura de software modular y documentada**: construida sobre ROS2, diseñada para facilitar la integración de nuevos módulos, la replicación del sistema y su mantenimiento a largo plazo.

El lanzamiento oficial del MK2, incluyendo la publicación de su repositorio, está previsto **antes de octubre de 2026**.

---

## Electrónica diseñada en casa

El sistema electrónico del MK2 está compuesto por tres tarjetas diseñadas íntegramente por el equipo SWARM: dos placas de potencia y una placa de control. Cada una es el resultado directo de las iteraciones anteriores del proyecto, incorporando las lecciones aprendidas del MK1 y el MK1.5 en un diseño más compacto, confiable y orientado a la carga industrial.

Sus especificaciones y capacidades completas serán publicadas junto al lanzamiento oficial del MK2.

<!-- IMAGEN: foto de las tres PCBs juntas o en grid. Reemplazar src con ruta real. -->
<!-- Sugerencia de layout: tres columnas, una por board, con caption debajo de cada una -->

| | | |
|:---:|:---:|:---:|
| ![Placa de potencia 1](img/pcb_power_1.jpg) | ![Placa de potencia 2](img/pcb_power_2.jpg) | ![Placa de control](img/pcb_control.jpg) |
| **Placa de potencia I** | **Placa de potencia II** | **Placa de control** |
| *Especificaciones por revelar* | *Especificaciones por revelar* | *Especificaciones por revelar* |

---

## MK2 — Próximamente

El diseño del MK2 está completo. Sus renders serán publicados como parte del lanzamiento oficial del proyecto, previsto antes de octubre de 2026.

<!-- IMAGEN PLACEHOLDER: render del MK2. Reemplazar con imagen real o usar un placeholder visual con el logo de SWARM -->
<!-- Sugerencia: imagen a ancho completo con overlay de texto "Próximamente · MK2 · 2026" -->

> **Próximamente** — Renders, especificaciones completas y repositorio público del MK2.

---

## Trabajo futuro

Una vez completado el MK2, el proyecto iniciará pruebas de navegación autónoma en entornos universitarios y escenarios piloto de tipo industrial, empleando mapeo SLAM completamente autónomo y navegación visual para la identificación y seguimiento de objetivos dentro del flujo logístico.

En paralelo, se prevé la fabricación de unidades adicionales del MK2 con el fin de desarrollar y validar algoritmos de consenso y cooperación multi-robot, consolidando las bases para la Fase III del proyecto y su eventual transferencia hacia aplicaciones industriales reales.

---

## Equipo

### Dirección

| Nombre | Cargo |
|---|---|
| Felipe Gutiérrez Apráez | Presidente |
| Sebastián David Cáceres Navarro | Vicepresidente |
| Daniel Andrés Munevar Quiñones | Líder de Proyecto |
| Pablo Sarmiento Tamayo | Líder Mecánica |
| Manuel Santiago Suaza Quiroga | Líder Electrónica |
| Fredy A. Chaparro Castro | Líder Software |
| Iván David Gómez Silva | Secretario |

---

### Mecánica

| Nombre | Iteración |
|---|---|
| Sebastián David Cáceres Navarro | MK1.5 · MK2 |
| Pablo Sarmiento Tamayo | MK2 |
| Santiago Hincapié Rueda | MK2 |
| Luis David Camero Hernández | MK2 |

---

### Electrónica

| Nombre | Iteración |
|---|---|
| Manuel Santiago Suaza Quiroga | MK1 · MK2 |
| Alicia Pineda Fory | MK2 |
| Juan David Prieto Garzón | MK2 |
| Santiago Valbuena Guzmán | MK2 |
| Ángela Verónica Bobadilla Beltrán | MK2 |
| Jesús Sandoval Santana | MK2 |
| Daniel Alejandro Castillo González | MK2 |
| Juan José Rincón Perico | MK2 |
| Samuel Luque Navia | MK2 |
| Johan Sebastián Castiblanco Galeano | MK2 |
| Alejandro Alvernia Liévano | MK2 |

---

### Software

| Nombre | Especialidad | Iteración |
|---|---|---|
| Daniel Andrés Munevar Quiñones | Arquitectura ROS | MK1 · MK2 |
| Fredy A. Chaparro Castro | Líder Software | MK2 |
| Andrés Felipe Ayala Mansilla | ROS2 · micro-ROS | MK1.5 · MK2 |
| Iván David Gómez Silva | ROS2 | MK2 |
| Juan Camilo Torres Mestra | Software general | MK2 |
| Alejandro Bernal López | Backend | MK2 |
| Nicolás Puerta | Software general | MK2 |

---

### Proyectos asociados

| Nombre | Proyecto | Cargo |
|---|---|---|
| Daniela Martínez Rincón | Chasky | Líder de Proyecto |

---

## Contacto

**IEEE RAS — Universidad de los Andes**
[rasuniandes.org](https://rasuniandes.org)
RAS@uniandes.edu.co

---

## Referencias

[1] E. Guizzo, "Kiva Systems: Three Engineers, Hundreds of Robots, One Warehouse," *IEEE Spectrum*, Jul. 2008. https://spectrum.ieee.org/three-engineers-hundreds-of-robots-one-warehouse

[2] A. Staff, "The story behind Amazon's next generation robot," *About Amazon*, Mar. 2019. https://www.aboutamazon.com/news/innovation-at-amazon/the-story-behind-amazons-next-generation-robot

---

*RAS Uniandes — Proyecto SWARM 2025–2026*
