# Los 12 vectores de Noise (grad3)

Son los gradientes predefinidos del algoritmo de Perlin. No son valores aleatorios — son una elección deliberada de Ken Perlin.

Cada vector apunta hacia una de las 12 aristas de un cubo unitario. Imaginá un cubo centrado en el origen: tiene 12 aristas. Cada vector tiene exactamente dos componentes que son +1 o -1, y una que es 0. Esto produce vectores distribuidos uniformemente en las direcciones del espacio, lo que evita artefactos visuales (patrones repetitivos indeseados) en el ruido generado.

¿Por qué no simplemente vectores aleatorios? Porque Ken Perlin descubrió que usar este conjunto fijo de 12 vectores:

- Evita la formación de patrones cuadrados (artefactos de grid)
- Es computacionalmente más barato
- Produce resultados visualmente más suaves y orgánicos

En 2D (que es lo que usa este código), solo importan los componentes x e y, así que efectivamente tenés vectores como (1,1), (-1,1), (1,-1), (-1,-1), (1,0), (-1,0), (0,1), (0,-1) — 8 direcciones en el plano.

# p — La tabla de permutación

Esta es la tabla de permutación de Perlin, y es históricamente famosa. Es exactamente la misma tabla publicada por Ken Perlin en su paper original. Contiene los números del 0 al 255, pero en un orden pseudo-aleatorio fijo.

Su propósito es funcionar como una función hash barata: dado un par de coordenadas enteras (X, Y), podés buscar en esta tabla para obtener un índice "aleatorio" pero determinista (siempre da el mismo resultado para la misma entrada). Esto es lo que hace al Perlin Noise reproducible: para las mismas coordenadas siempre obtenés el mismo valor de ruido.

¿Por qué 256 valores (0-255)? Porque 256 = 2^8, lo que permite usar operaciones bitwise eficientes (& 255) como módulo 256.

# Operaciones internas del metodo Seed

(|) bitwise OR.
(^) bitwise XOR.
(&) bitwise AND.
(~) bitwise NOT.
(>>) bitwise right shift.
(<<) bitwise left shift.
(>>>) bitwise right shift zero fill.
(<<<) bitwise left shift zero fill.

if (seed > 0 && seed < 1) seed \*= 65536; Si el seed es un decimal entre 0 y 1 (como 0.5 o Math.random()), lo escala a un entero más grande. 65536 = 2^16, así que convierte por ejemplo 0.5 en 32768. Esto es para que valores decimales pequeños no se pierdan al truncar a entero.

seed = Math.floor(seed); Redondea hacia abajo para obtener un entero.

if (seed < 256) seed |= seed << 8; Si el seed ocupa menos de 8 bits (es decir, es menor a 256), esta operación copia los bits bajos a la posición alta. seed << 8 desplaza los bits 8 posiciones a la izquierda, y |= hace un OR con el original. Ejemplo: si seed = 42 (binario: 00101010), entonces seed << 8 = 00101010_00000000, y el resultado es 00101010_00101010. Esto asegura que tanto el byte alto como el byte bajo del seed tengan información útil, porque más adelante se usa seed & 255 (byte bajo) y (seed >> 8) & 255 (byte alto).

i & 1 verifica si i es impar. Es equivalente a i % 2 !== 0.
Si i es impar: aplica XOR entre p[i] y el byte bajo del seed (seed & 255).
Si i es par: aplica XOR entre p[i] y el byte alto del seed ((seed >> 8) & 255).
XOR (^) mezcla los bits del valor original de la tabla con los del seed, produciendo una nueva permutación que depende de la semilla. Así, diferentes seeds producen diferentes tablas de permutación, y por lo tanto diferentes patrones de ruido.

this.perm[i] = this.perm[i + 256] = v; Llena la tabla de permutación de 512 con el valor calculado, duplicándolo (posición i y i + 256).

this.gradP[i] = this.gradP[i + 256] = this.grad3[v % 12]; Pre-calcula qué gradiente corresponde a cada posición. v % 12 porque hay 12 gradientes en grad3.

#fade(t) — La curva de suavizado

Esta es la función de suavizado quintic (polinomio de grado 5) de Perlin: (6t^5 - 15t^4 + 10t^3).

Si expandís la expresión:

t _ 6 - 15 → 6t - 15
t _ (6t - 15) → 6t² - 15t
(6t² - 15t) + 10 → 6t² - 15t + 10
t³ \* (6t² - 15t + 10) → 6t⁵ - 15t⁴ + 10t³

¿Para qué sirve? Cuando interpolás entre dos valores de ruido, no querés una transición lineal (se vería "angular"). Esta función:

En t=0 devuelve 0
En t=1 devuelve 1
Su primera derivada es 0 en ambos extremos
Su segunda derivada también es 0 en ambos extremos
Esto garantiza una transición ultra-suave. La versión original de Perlin (1983) usaba (3t^2 - 2t^3) (cúbica), pero esa tenía discontinuidades en la segunda derivada, lo que causaba artefactos visuales. La versión "improved" (2002) usa este polinomio quintic.

Si venís de GLSL, smoothstep() usa la versión cúbica. Esta es una versión "mejor que smoothstep".

# perlin2(x, y) — El corazón del algoritmo

- Paso 1: Encontrar la celda del grid
  Imaginá una cuadrícula infinita. El punto (x, y) cae dentro de alguna celda. X, Y son las coordenadas enteras de la esquina inferior-izquierda de esa celda. Luego, x e y se convierten en las coordenadas fraccionales dentro de la celda (valores entre 0 y 1).

& 255 es equivalente a % 256 pero más rápido — envuelve las coordenadas para que siempre estén en rango de la tabla.

- Paso 2: Calcular la contribución de cada esquina
  La celda tiene 4 esquinas. Para cada una:

Se obtiene un gradiente pseudo-aleatorio de la tabla (usando la tabla de permutación como hash).
Se calcula el producto punto entre ese gradiente y el vector desde esa esquina hacia el punto de evaluación.
Pensalo así: cada esquina "empuja" el valor en cierta dirección (definida por su gradiente). El producto punto dice "cuánto influye esa esquina sobre el punto actual".

- Paso 3: Interpolar
  Se hace una interpolación bilineal suavizada:

Interpola entre las dos esquinas inferiores (n00 ↔ n10) usando fade(x).
Interpola entre las dos esquinas superiores (n01 ↔ n11) usando fade(x).
Interpola entre esos dos resultados usando fade(y).
El resultado es un valor suave entre aproximadamente -1 y 1 que varía de forma orgánica y continua.

# El componente Waves — Inicialización

Todo se guarda en useRef en lugar de useState porque estas variables se leen y escriben dentro del animation loop (60+ veces por segundo). Usar useState causaría re-renders en cada frame, lo cual sería desastroso para el rendimiento. Los refs son mutables sin triggear re-renders.

noiseRef: instancia del generador de ruido, con seed 2 (podría ser cualquier número, simplemente define qué patrón se genera).
linesRef: array de arrays de puntos — cada sub-array es una línea vertical.
mouseRef: estado del cursor inicializado con x: -10 (fuera de pantalla) y set: false.

# El primer useEffect - configRef.current

Este efecto simplemente sincroniza las props de React con el ref de configuración. Cuando alguna prop cambia, actualiza configRef.current. Esto permite que el animation loop (que lee de configRef) obtenga los valores actualizados sin necesidad de reiniciar la animación.

# Semilla y razonamiento decimal.

Por qué solo si es decimal (estrictamente: entre 0 y 1)
Si alguien pasa un entero grande, por ejemplo 42 o 1337, ya es una semilla “completa”: el resto del método (Math.floor, XOR con bytes, etc.) puede usarla tal cual.

Si en cambio pasa 0.37, y hacés enseguida Math.floor(seed) (como hace la línea siguiente), obtenés 0. Toda la variación entre 0.01, 0.37 y 0.99** se pierde** y todas esas semillas acaban comportándose igual. Por eso, cuando el valor “parece” un float en (0, 1)`, lo convierten antes a un entero con rango útil.

La condición seed > 0 && seed < 1 es una heurística: “esto huele a Math.random() / fracción, no a un entero de semilla”. No multiplican si seed es 0 (se queda en 0) ni si es ≥ 1 (asumen que ya es un entero o escala que el autor quiso usar a mano).

Por qué un número tan alto: 65536
65536 es 2¹⁶. En el método seed de esta implementación, la semilla entera se usa sobre todo a través de dos bytes:

byte bajo: seed & 255 (8 bits)
byte alto: (seed >> 8) & 255 (otros 8 bits)
Eso son 16 bits de información en total (valores de 0 a 65535 como espacio razonable para mezclar la tabla).

Si tomás un número en (0, 1) y lo multiplicás por 65536 y luego hacés Math.floor, estás repartiendo ese decimal continuo en muchos enteros distintos dentro de ese rango de 16 bits, de modo que los dos bytes reciban variedad y el XOR con this.p[i] no quede casi siempre igual.

No es que “tenga que ser enorme” en sentido absoluto: es grande en relación a 0–1 para mapear ese intervalo al rango entero que luego el algoritmo parte en dos bytes. Podrías usar otro factor si cambiaras cómo se mezcla la semilla; en esta librería, 65536 encaja con el diseño de 16 bits.
