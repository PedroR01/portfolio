¿Hay que decir algo para que los agentes las usen?
En la mayoría de los casos, no. Si las reglas están en .cursor/rules/ con el frontmatter correcto (alwaysApply: true o globs acertados), Cursor las trata como reglas del proyecto y las tiene en cuenta en conversaciones nuevas en ese workspace.

Reglas con alwaysApply: true: suelen aplicarse sin que las cites en cada mensaje.
Reglas con globs: entran cuando trabajas con archivos que coinciden (por ejemplo \*_/_.tsx), no hace falta repetirlo en el prompt salvo que quieras forzar algo concreto.
Excepciones / buenas prácticas:

Si en Ajustes de Cursor → Rules (o el panel de reglas del proyecto) ves que alguna regla está desactivada o hay conflictos, ahí sí tendrías que activarlas o revisar.
Si quieres reforzar una regla en un mensaje concreto, puedes @ la regla o el archivo .mdc en el chat; eso no suele ser obligatorio para las alwaysApply, pero ayuda cuando el contexto es muy largo o la IA se desvía.
Los agentes (subagentes, tareas en background, etc.) dependen de cómo Cursor inyecte el contexto del proyecto en esa ejecución; en la práctica, lo razonable es asumir que usan las mismas reglas del proyecto cuando el agente corre dentro de ese repo. Si algún flujo no las respeta, el refuerzo con @ a la regla o un chat nuevo suele alinearlo.

¿Los cambios en las reglas afectan conversaciones ya iniciadas?
No hay una garantía al 100% públicamente documentada de que cada mensaje siguiente vuelva a “releer” el disco con las reglas actualizadas. Lo que sí es razonable en la práctica:

Situación --> Qué esperar
Cambias una regla y sigues en el mismo chat --> A veces el siguiente mensaje ya la refleja; a veces el hilo arrastra instrucciones o tono anteriores.
Quieres estar seguro --> Abre una conversación nueva después de cambios importantes en .mdc. Es la forma más fiable de que el estado del sistema coincida con el archivo actual.
Cambios grandes (reescribes filosofía, stack, eficiencia) --> Un chat nuevo evita mezclar el “viejo contrato” con el nuevo.
