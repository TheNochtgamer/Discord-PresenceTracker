# Discord PresenceTracker

#### Detecta cuando un miembro inicia un programa y hace un conteo del tiempo que lo mantiene abierto hasta que se pasa del limite y ejecuta una funcion

## Instalacion

1. Clona el repositorio
2. Abre una ventana de **cmd** o **bash** dentro del directorio
3. Instala los paquetes requeridos con `npm install`
4. Reenombra el archivo [*example.env*](https://github.com/TheNochtgamer/Discord-PresenceTracker/blob/main/example.env) a *.env*
5. Añade el token del bot al archivo *.env*
6. Añade el id del guild donde el bot funcionara al archivo [*./src/config.json*](https://github.com/TheNochtgamer/Discord-PresenceTracker/blob/main/config.json)
7. Listo!

## Configuracion

> [*./src/config.json*](https://github.com/TheNochtgamer/Discord-PresenceTracker/blob/main/config.json)

- guildID: El id del servidor de discord
- trackgames: Un array de los juegos/aplicaciones que el bot buscara en los miembros
- limitMinTicksEnd: Es el limite que debera pasar el usuario con una aplicacion buscada para ejecutar algo
- limitMinTicksErase: Es el limite en minutos que pasan cuando el usuario cierra la aplicacion buscada y termine reiniciando el contador
- checkEverySeconds: Son los segundos para que el bot actualice el contador
- filteredRoles: Un array con los `ids` de los roles que quieras filtrar
- whitelistmode: Si deseas que los miembros con los roles `filtrados` que seleccionaste se no se tomen en cuenta al no tener ninguno `true` o no se tomen en cuenta al tener alguno de ellos `false`
- limitPerUser: Si un miembro sobrepasa el limite este ya no sera trackeado de nuevo
- alertPercent: Te alerta cuando un miembro esta a punto de superar cierto porcentaje **(0 para desactivar)**

## RunMe

> [*./src/runMe.js*](https://github.com/TheNochtgamer/Discord-PresenceTracker/blob/main/src/runMe.js)

### Es el archivo de funcion que se ejecuta una vez el miembro haya superado el limite de tiempo (El unico parametro es el mismo objeto de Player)