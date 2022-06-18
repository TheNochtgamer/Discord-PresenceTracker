# Discord PresenceTracker

> Detecta cuando un miembro inicia un programa y hace un conteo del tiempo que lo mantiene abierto hasta que pasa el limite

## Instalacion

1. Clona el repositorio
2. Instala los paquetes requeridos con "`npm install`"
3. Añade el bot token al `config.json`
4. Añade el id del guild/discord donde el bot funcionara
5. Listo!

## Configuracion

- token: El bot token
- guildid: El id del servidor de discord
- trackgames: Es para los juegos/aplicaciones que el bot seguira (nombres en minuscula)
- limitmintickstoend: Es el limite en minutos que el usuario al pasarlo ejecute algo (modificable en el `playerClass.js`)
- limitmintickstoerased: Es el tiempo en minutos que pasan cuando el usuario cierra la aplicacion y termine borrando el contador
- tickertick: Son los segundos para que el bot actualice el contador