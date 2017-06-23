// script para reorganizar datos cuando se ingresa uno nuevo (Mantenimiento de la lista)
var fs = require('fs')
var empresas = require('./datos.json')

// remover duplicados
var empresasNoDup = []
var repetido = false
for (var i = 0; empresa = empresas[i]; i++) {
  for (var j = 0; empresaComp = empresasNoDup[j]; j++) {
    if (empresa.nombre === empresaComp.nombre) { // no es la misma empresa
      repetido = true
    }
  }
  if (!repetido) {
    empresasNoDup.push(empresa)
  }
  repetido = false
}

// se organiza en orden alfabetico

empresasNoDupOrd = empresasNoDup.sort((a, b) => {
  if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) return -1
  if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) return 1
  return 0
})

var strGithub = ''

for (var i = 0, empresa; empresa = empresasNoDupOrd[i]; i++) {
strGithub += '\n\n## ' + (i + 1) + '. ' + empresa.nombre
  + (empresa.fanpage ? '\n- Fanpage Url: [' + empresa.fanpage + '](' + empresa.fanpage + ')' : '')
  + (empresa.webpage ? '\n- Página Web: [' + empresa.webpage + '](' + empresa.webpage + ')' : '')
  + (empresa.usuario ? '\n- Usuario: ' + empresa.usuario : '')
  + (empresa.perfil ? '\n- Usuario Url: [' + empresa.perfil + '](' + empresa.perfil + ')': '')
}

fs.unlink('./listaGithub', err => {
  fs.writeFile('./listaGithub', strGithub, { flag: 'wx' }, err => {
    if (err) throw err
    console.log('Guardado en archivo listaGithub')
  })
})
