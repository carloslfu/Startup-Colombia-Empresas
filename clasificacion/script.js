// Script para procesar la norma y pasarla a JSON
/* Estructura del CIIU resultado
  - Sección
    - División
      - Subdivisión
        - Actividad
*/

var fs = require('fs')

var archivo = './CIIU.txt'

fs.readFile(archivo, 'utf8', (err, txt) => {
  if (err) throw err
  console.log('OK: ' + archivo)
  var resultado = procesarDatos(txt)
  fs.unlink('./CIIU.json', err => {
    fs.writeFile('./CIIU.json', resultado, { flag: 'wx' }, err => {
      if (err) throw err
      console.log('Guardado en archivo CIIU.json')
    })
  })

})

// recibe texto, retorna JSON en forma de texto
function procesarDatos (txt) {
  var lineas = txt.split('\n')
  var seccion = ''
  var division = ''
  var subdivision = ''
  var actividad = ''
  var res = {}, parts

  for (var i = 0, linea; linea = lineas[i]; i++) {
    parts = linea.split(' ')
    if (parts[0] === 'Sección') {
      seccion = parts[1].slice(0, -1)
      parts.shift()
      parts.shift()
      res[seccion] = { titulo: parts.join(' '), divisiones: {} }
    } else if (parts[0] === 'División') {
      division = parts[1].slice(0, -1)
      parts.shift()
      parts.shift()
      res[seccion].divisiones[division] = { titulo: parts.join(' '), subdivisiones: {} }
    } else {
      if (parts[0].length === 3) {
        subdivision = parts[0]
        parts.shift()
        res[seccion].divisiones[division].subdivisiones[subdivision] = { titulo: parts.join(' '), actividades: {} }
      } else {
        actividad = parts[0]
        parts.shift()
        res[seccion].divisiones[division].subdivisiones[subdivision].actividades[actividad] = parts.join(' ')
      }
    }
  }

  return JSON.stringify(res, null, 2) + '\n'
}
