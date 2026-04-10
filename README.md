Cursor Rules (.cursor/rules/\*.mdc)

Regla 1: core-interaction.mdc — Tu filosofía de interacción (siempre activa)
Este es el archivo más importante. Define CÓMO quieres que la IA interactúe contigo. Al estar siempre activo, eliminas la necesidad de repetir estas instrucciones en cada chat.

Regla 2: project-stack.mdc — Contexto técnico del proyecto (siempre activa)
Esta regla le ahorra a la IA tener que "descubrir" tu stack en cada conversación. Sin ella, la IA gasta tokens explorando package.json, tsconfig.json, la estructura de carpetas, etc.

Regla 3: react-gsap-patterns.mdc — Patrones técnicos específicos (solo en .tsx)

.cursorignore
Cada archivo indexado puede ser incluido como contexto, consumiendo tokens. .cursorignore funciona exactamente como .gitignore pero para la indexación de Cursor. Los archivos ignorados no se incluyen en el índice semántico, lo que reduce el contexto que la IA necesita procesar.

Hábitos de uso eficiente
Estos no son archivos, sino prácticas que te ahorrarán tokens significativamente:

1. Usa Ask mode vs Agent mode estratégicamente
   Ask mode (donde estás ahora): Para preguntas conceptuales, entender código, planificar. Consume menos porque la IA no ejecuta herramientas.
   Agent mode: Para implementar cambios concretos. Consume más porque la IA lee/escribe archivos.
   Regla práctica: Pregunta primero en Ask, implementa después en Agent.

2. Conversaciones cortas y enfocadas
   Cada mensaje en una conversación larga re-envía TODO el historial previo. Cuando cambies de tema o tarea, inicia un chat nuevo. Piensa en cada conversación como una "unidad de trabajo" enfocada.

3. Sé específico en tus prompts
   En lugar de: "Mejora el hero section" (la IA debe explorar, adivinar, proponer muchas cosas)

Mejor: "En Hero-Section.tsx, la animación de entrada del título con GSAP hace un fade-in. Quiero que además haga un slide-up de 30px. Explícame cómo funciona la propiedad y de GSAP antes de implementar."

4. Referencia archivos con @
   Cuando mencionas @components/sections/Hero-Section.tsx en tu prompt, Cursor adjunta ese archivo directamente en lugar de que la IA lo busque. Esto ahorra las herramientas de búsqueda/lectura.

5. Modelos según la tarea
   Cursor permite elegir el modelo. Para tareas simples (renombrar, ajustes de estilo), un modelo más rápido/barato es suficiente. Reserva modelos más potentes para arquitectura o problemas complejos.
